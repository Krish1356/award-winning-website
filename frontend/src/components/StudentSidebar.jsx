import React, { useEffect, useState } from 'react';
import { getTable } from '../lib/mockDB';
import { BookOpen, TrendingUp, Users } from 'lucide-react';

const StudentSidebar = ({ studentId }) => {
    const [quizHistory, setQuizHistory] = useState([]);
    const [skills, setSkills] = useState([]);
    const [mentors, setMentors] = useState([]);

    useEffect(() => {
        // Load past quizzes
        const attempts = getTable('student_quiz_attempts').filter(a => a.student_id === studentId);
        const quizzes = getTable('quizzes');
        const history = attempts.map(a => {
            const domain = quizzes.find(q => q.id === a.quiz_id)?.domain || 'General';
            return { ...a, domain };
        });
        setQuizHistory(history.reverse()); // most recent first

        // Load skill profiles
        const skillProfiles = getTable('student_skill_profile').filter(s => s.student_id === studentId);
        setSkills(skillProfiles);

        // Load past mentors taken
        const assignments = getTable('mentor_assignments').filter(a => a.student_id === studentId || a.accepted === 'yes'); // in reality filter by student_id
        // Wait, assignments table only has query_id and mentor_id. We need to check if the query relates to the student
        const queries = getTable('queries').filter(q => q.student_id === studentId);
        const queryIds = queries.map(q => q.id);
        const myAssignments = getTable('mentor_assignments').filter(a => queryIds.includes(a.query_id) && a.accepted === 'yes');
        
        const allUsers = getTable('users');
        const assignedMentors = myAssignments.map(a => allUsers.find(u => u.id === a.mentor_id)).filter(Boolean);
        // unique mentors
        const uniqueMentors = [...new Map(assignedMentors.map(m => [m.id, m])).values()];
        setMentors(uniqueMentors);
    }, [studentId]);

    return (
        <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Skill Map</h3>
                </div>
                {skills.length === 0 ? (
                    <p className="text-sm text-gray-500">No skill data yet.</p>
                ) : (
                    <ul className="space-y-3 mt-2">
                        {skills.map((s, idx) => (
                            <li key={idx} className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-700">{s.domain}</span>
                                <div className="text-right">
                                    <span className="block text-xs font-bold text-gray-900">{s.level}</span>
                                    <span className={`block text-xs ${s.improvement_rate >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {s.improvement_rate >= 0 ? '+' : ''}{(s.improvement_rate * 100).toFixed(0)}% Improv.
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Past Quizzes</h3>
                </div>
                {quizHistory.length === 0 ? (
                    <p className="text-sm text-gray-500">No quizzes taken yet.</p>
                ) : (
                    <ul className="space-y-3 mt-2">
                        {quizHistory.slice(0, 5).map((q, idx) => (
                            <li key={idx} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <span className="block text-sm font-medium text-gray-800">{q.domain}</span>
                                    <span className="block text-xs text-gray-500">{new Date(q.created_at).toLocaleDateString()}</span>
                                </div>
                                <span className="text-sm font-bold text-purple-600">{q.score}%</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                    <Users className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Your Mentors</h3>
                </div>
                {mentors.length === 0 ? (
                    <p className="text-sm text-gray-500">No mentors assigned yet.</p>
                ) : (
                    <ul className="space-y-3 mt-2">
                        {mentors.map((m, idx) => (
                            <li key={idx} className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                                    {m.name.charAt(0)}
                                </div>
                                <div>
                                    <span className="block text-sm font-medium text-gray-800">{m.name}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default StudentSidebar;
