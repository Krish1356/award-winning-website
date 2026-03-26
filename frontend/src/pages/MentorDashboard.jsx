import React, { useState, useEffect } from 'react';
import { getTable, updateInTable } from '../lib/mockDB';
import { Users, Star, MessageSquare } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import MentorSidebar from '../components/MentorSidebar';

const MentorDashboard = () => {
    const savedUser = localStorage.getItem('currentUser');
    const currentUser = savedUser ? JSON.parse(savedUser) : { id: 'u2' };
    const mentorId = currentUser.id; 
    
    const [stats, setStats] = useState({ studentsGuided: 0, rating: 0, activeChats: 0 });
    const [incomingRequests, setIncomingRequests] = useState([]);
    
    // Mentor Response functionality
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        // Load stats
        const perf = getTable('mentor_performance').find(mp => mp.mentor_id === mentorId);
        if (perf) {
            setStats({
                studentsGuided: perf.total_sessions,
                rating: perf.avg_rating,
                activeChats: 3
            });
        }

        const loadRequests = () => {
            const assignments = getTable('mentor_assignments').filter(a => a.mentor_id === mentorId && a.accepted === 'no');
            const queries = getTable('queries');
            const users = getTable('users');
            
            const reqs = assignments.map(a => {
                const q = queries.find(qi => qi.id === a.query_id);
                const u = q ? users.find(ui => ui.id === q.student_id) : null;
                return {
                    id: a.id,
                    query_id: q?.id,
                    student: u ? u.name : 'Unknown',
                    query: q ? q.title : 'No Title',
                    domain: q ? q.domain : 'General',
                    time: new Date(a.assigned_at).toLocaleTimeString()
                };
            });
            setIncomingRequests(reqs.reverse());
        };
        
        loadRequests();
        // Polling for Viva demo effect
        const interval = setInterval(loadRequests, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleAccept = (assignmentId, queryId) => {
        updateInTable('mentor_assignments', a => a.id === assignmentId, { accepted: 'yes' });
        updateInTable('queries', q => q.id === queryId, { status: 'resolved' });
        setIncomingRequests(prev => prev.filter(r => r.id !== assignmentId));
    };

    const submitResponse = (assignmentId, queryId) => {
        if (!replyText.trim()) return alert("Message cannot be empty!");
        updateInTable('mentor_assignments', a => a.id === assignmentId, { accepted: 'yes' });
        updateInTable('queries', q => q.id === queryId, { status: 'resolved', response: replyText });
        alert('Response Delivered to Student! (Simulated)');
        setIncomingRequests(prev => prev.filter(r => r.id !== assignmentId));
        setReplyingTo(null);
        setReplyText('');
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Students Guided</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.studentsGuided}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center space-x-4">
                        <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                            <Star className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Average Rating</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.rating}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Chats</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.activeChats}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Incoming Requests */}
            <Card>
                <CardHeader>
                    <CardTitle>Incoming Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {incomingRequests.map((req) => (
                            <div key={req.id} className="flex flex-col p-4 border rounded-lg bg-gray-50 mb-4 transition transform hover:-translate-y-1 hover:shadow-md">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900">{req.query}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="primary">{req.domain}</Badge>
                                            <span className="text-sm text-gray-500">• {req.student}</span>
                                            <span className="text-sm text-gray-400">• {req.time}</span>
                                        </div>
                                    </div>
                                    {replyingTo !== req.id && (
                                        <div className="mt-4 sm:mt-0 flex gap-2">
                                            <Button size="sm" variant="success" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setReplyingTo(req.id)}>Accept & Resolve</Button>
                                            <Button size="sm" variant="outline" onClick={() => handleAccept(req.id, req.query_id)}>Ignore</Button>
                                        </div>
                                    )}
                                </div>
                                {replyingTo === req.id && (
                                    <div className="mt-4 flex gap-2">
                                         <input 
                                            type="text" 
                                            className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border" 
                                            placeholder="Type your response to the student's query..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            autoFocus
                                         />
                                        <Button size="default" variant="success" className="bg-green-600 text-white" onClick={() => submitResponse(req.id, req.query_id)}>Send</Button>
                                        <Button size="default" variant="outline" onClick={() => setReplyingTo(null)}>Cancel</Button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {incomingRequests.length === 0 && (
                            <p className="text-center text-gray-500 py-4">No new requests at the moment.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
            </div>
            <MentorSidebar />
        </div>
    );
};

export default MentorDashboard;
