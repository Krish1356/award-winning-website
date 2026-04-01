import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTable, submitFeedback } from '../lib/mockDB';
import { PlusCircle, BookOpen, Clock, CheckCircle, Eye, Star, MessageCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StudentSidebar from '../components/StudentSidebar';
import ProfileBar from '../components/ProfileBar';
import ChatBox from '../components/ChatBox';

const StudentDashboard = () => {
    const savedUser = localStorage.getItem('currentUser');
    const currentUser = savedUser ? JSON.parse(savedUser) : { id: 'u1' };
    const studentId = currentUser.id;

    const [skillLevel, setSkillLevel] = useState('Beginner');
    const [recentQueries, setRecentQueries] = useState([]);
    const [stats, setStats] = useState({ pending: 0, resolved: 0 });
    const [feedbacks, setFeedbacks] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [recommendedMentors, setRecommendedMentors] = useState([]);
    const [skillStrengths, setSkillStrengths] = useState({ strong: [], weak: [] });

    // Feedback Modal State
    const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, queryId: null });
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    // Chat Box State
    const [activeChat, setActiveChat] = useState({ isOpen: false, queryId: null, mentorName: '' });

    const handleOpenChat = (query) => {
        const assignment = getTable('mentor_assignments').find(a => a.query_id === query.id && a.accepted === 'yes');
        const mentor = assignment ? getTable('users').find(u => u.id === assignment.mentor_id) : null;
        setActiveChat({
            isOpen: true,
            queryId: query.id,
            mentorName: mentor ? mentor.name : 'Mentor'
        });
    };

    useEffect(() => {
        const allQueries = getTable('queries').filter(q => q.student_id === studentId);
        setRecentQueries(allQueries.reverse());
        
        setStats({
            pending: allQueries.filter(q => q.status === 'pending').length,
            resolved: allQueries.filter(q => q.status === 'resolved').length
        });

        setFeedbacks(getTable('feedback').filter(f => f.student_id === studentId));

        const skills = getTable('student_skill_profile').filter(s => s.student_id === studentId);
        if (skills.length > 0) {
            // Sort to grab the most recently updated skill dynamically
            const latestSkill = [...skills].sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated))[0];
            setSkillLevel(latestSkill.level);

            const targetDomain = latestSkill.domain;
            const mentorsInDomain = getTable('mentor_expertise')
                .filter(me => me.domain === targetDomain)
                .map(me => {
                    const userObj = getTable('users').find(u => u.id === me.mentor_id);
                    const mentorProfile = getTable('mentor_profile').find(p => p.user_id === me.mentor_id);
                    return { ...userObj, ...me, avg_rating: mentorProfile?.avg_rating || 5.0 };
                });
            setRecommendedMentors(mentorsInDomain);

            // Compute Strong and Weak dynamically mapped Sub-topics
            const topicPerformance = getTable('student_topic_performance').filter(t => t.student_id === studentId);
            const calculatedTopics = topicPerformance.map(t => ({
                domain: t.domain,
                topic: t.topic,
                avg_score: Math.round((t.correct_answers / t.total_attempts) * 100)
            }));
            const strong = calculatedTopics.filter(t => t.avg_score >= 70);
            const weak = calculatedTopics.filter(t => t.avg_score < 70);
            setSkillStrengths({ strong, weak });
        }

        const attempts = getTable('student_quiz_attempts').filter(a => a.student_id === studentId);
        attempts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        
        const mappedData = attempts.map(attempt => {
            const d = new Date(attempt.created_at);
            return { 
                date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), 
                score: attempt.score 
            };
        });
        setGraphData(mappedData);
    }, [studentId]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">Student Dashboard</h1>
                <Link to="/query/new">
                    <Button variant="primary">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Raise Query
                    </Button>
                    </Link>
                </div>

                <ProfileBar user={currentUser} />

            {/* Stats / Skill Level */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="flex items-center space-x-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Current Skill Level</p>
                            <h3 className="text-2xl font-bold text-gray-900">{skillLevel}</h3>
                            <Link to="/assessment" className="text-sm text-blue-600 hover:underline">
                                Re-assess Skill
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center space-x-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Queries</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center space-x-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Resolved Queries</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.resolved}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Skill Progress Graph */}
            <Card>
                <CardHeader>
                    <CardTitle>Skill Progress Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    {graphData.length > 0 ? (
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={graphData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#9333EA"
                                        strokeWidth={3}
                                        dot={{ fill: '#9333EA', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg dark:bg-gray-800">
                            <p className="mb-2">No assessment data available yet.</p>
                            <Link to="/assessment" className="text-purple-600 font-medium hover:underline">Take your first quiz to see progress!</Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Strengths & Weaknesses */}
            {(skillStrengths.strong.length > 0 || skillStrengths.weak.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-green-600">Strong Topics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {skillStrengths.strong.length > 0 ? (
                                <ul className="space-y-3">
                                    {skillStrengths.strong.map((s, idx) => (
                                        <li key={idx} className="flex justify-between items-center p-3 border border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <div>
                                                <span className="block font-bold text-green-900 dark:text-green-100">{s.topic}</span>
                                                <span className="block text-xs text-green-700 dark:text-green-300 font-medium">{s.domain}</span>
                                            </div>
                                            <Badge variant="success">{s.avg_score}%</Badge>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No strong topics yet. Keep practicing!</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-red-500">Poor Topics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {skillStrengths.weak.length > 0 ? (
                                <ul className="space-y-3">
                                    {skillStrengths.weak.map((s, idx) => (
                                        <li key={idx} className="flex justify-between items-center p-3 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                            <div>
                                                <span className="block font-bold text-red-900 dark:text-red-100">{s.topic}</span>
                                                <span className="block text-xs text-red-700 dark:text-red-300 font-medium">{s.domain}</span>
                                            </div>
                                            <Badge variant="error" className="bg-red-100 text-red-800">{s.avg_score}%</Badge>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No poor topics! Great job.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Recommended Mentors */}
            {recommendedMentors.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recommended Mentors</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Based on your recent mastery of {recommendedMentors[0].domain}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendedMentors.map(mentor => (
                                <div key={mentor.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 flex flex-col justify-between hover:shadow-md transition">
                                    <div>
                                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{mentor.name}</h4>
                                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium my-1">{mentor.level} in {mentor.domain}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{mentor.skills_text}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center text-sm font-medium text-yellow-500">
                                            <Star className="h-4 w-4 fill-current mr-1" />
                                            {mentor.avg_rating.toFixed(1)} Rating
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Queries */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Queries</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentQueries.map((query) => (
                                    <tr key={query.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{query.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(query.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Badge variant={query.status.toLowerCase() === 'resolved' ? 'success' : 'warning'}>
                                                {query.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => {
                                                    if (query.status === 'resolved') {
                                                        alert(query.response ? `Mentor's Response:\n\n"${query.response}"` : 'The mentor has accepted your query but has not attached a written response yet.');
                                                    } else {
                                                        alert('Your query is still pending mentor assignment in the Network.');
                                                    }
                                                }}>
                                                    <Eye className="h-4 w-4 mr-2 inline" />
                                                    View Response
                                                </Button>
                                                {query.status === 'resolved' && (
                                                    <Button variant="outline" size="sm" onClick={() => handleOpenChat(query)}>
                                                        <MessageCircle className="h-4 w-4 mr-1 inline text-blue-500" />
                                                        Chat
                                                    </Button>
                                                )}
                                                {query.status === 'resolved' && !feedbacks.some(f => f.query_id === query.id) && (
                                                    <Button variant="outline" size="sm" onClick={() => {
                                                        setFeedbackModal({ isOpen: true, queryId: query.id });
                                                        setRating(5);
                                                        setComment('');
                                                    }}>
                                                        <Star className="h-4 w-4 mr-1 inline text-yellow-500" />
                                                        Rate
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
            </div>
            <StudentSidebar studentId={studentId} />

            {/* Feedback Modal */}
            {feedbackModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md bg-white dark:bg-gray-800">
                        <CardHeader className="flex justify-between items-center border-b">
                            <CardTitle>Rate Mentor's Help</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setFeedbackModal({ isOpen: false, queryId: null })}>Close</Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Star Rating</label>
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                // We must define onClick on the element. lucide-react maps Props.
                                                className={`h-8 w-8 cursor-pointer ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                                onClick={() => setRating(star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comments (Optional)</label>
                                    <textarea 
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none"
                                        rows="3"
                                        placeholder="How was the mentor's guidance?"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button variant="primary" onClick={() => {
                                        submitFeedback(feedbackModal.queryId, studentId, rating, comment);
                                        setFeedbacks(getTable('feedback').filter(f => f.student_id === studentId));
                                        alert("Thank you for your feedback! The mentor's rating has been updated.");
                                        setFeedbackModal({ isOpen: false, queryId: null });
                                        // Dispatch event to update other components dynamically
                                        window.dispatchEvent(new Event('storage'));
                                    }}>
                                        Submit Feedback
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Chat Box Widget */}
            {activeChat.isOpen && (
                <ChatBox 
                    queryId={activeChat.queryId} 
                    currentUser={currentUser} 
                    onClose={() => setActiveChat({ isOpen: false, queryId: null, mentorName: '' })} 
                    title={`Chat with ${activeChat.mentorName}`}
                />
            )}
        </div>
    );
};

export default StudentDashboard;
