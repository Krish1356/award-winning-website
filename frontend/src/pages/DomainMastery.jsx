import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTable } from '../lib/mockDB';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, ArrowLeft, Activity } from 'lucide-react';
import Button from '../components/ui/Button';

const DomainMastery = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { recentDomain, matchedMentor, currentScore, improvement } = location.state || {};

    const [domainHistories, setDomainHistories] = useState({});
    const [mockExplored, setMockExplored] = useState(0);

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        const currentUser = savedUser ? JSON.parse(savedUser) : { id: 'u1' };
        const studentId = currentUser.id;

        const allAttempts = getTable('student_quiz_attempts').filter(a => a.student_id === studentId);
        const quizzes = getTable('quizzes');

        const grouped = {};
        allAttempts.forEach(attempt => {
            const domain = quizzes.find(q => q.id === attempt.quiz_id)?.domain || 'General';
            if (!grouped[domain]) grouped[domain] = [];
            grouped[domain].push(attempt);
        });

        // Map and sort each domain
        const formatted = {};
        Object.keys(grouped).forEach(domain => {
            const sortedAttempts = grouped[domain].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            formatted[domain] = sortedAttempts.map((att, idx) => ({
                attempt: `Test ${idx + 1}`,
                score: att.score,
                date: new Date(att.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            }));
        });

        setDomainHistories(formatted);
        setMockExplored(Object.keys(formatted).length);
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Activity className="h-8 w-8 text-indigo-600" />
                        Lifetime Domain Mastery
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">Your universal competence tracker across all technological fields.</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Return to Dashboard
                </Button>
            </div>

            {/* Smart Assessment Triggered Alert */}
            {matchedMentor && (
                <div className="border border-green-200 rounded-2xl p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 shadow-md">
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                        <Award className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-900 mb-2">Optimal Mentor Assigned!</h3>
                    <p className="text-green-700 mb-6 text-base max-w-xl mx-auto leading-relaxed">
                        Based on your latest <strong>{currentScore}%</strong> performance in <strong>{recentDomain}</strong>, our intelligence layer has officially mapped your next growth phase.
                    </p>
                    <div className="flex items-center justify-center p-4 bg-white rounded-xl border border-green-100 shadow-sm max-w-sm mx-auto">
                        <div className="h-16 w-16 bg-gradient-to-tr from-green-200 to-green-300 text-green-800 rounded-full flex items-center justify-center font-bold text-3xl shadow-sm border border-green-100">
                            {matchedMentor.mentor.name.charAt(0)}
                        </div>
                        <div className="text-left ml-4">
                            <p className="text-xl font-bold text-gray-900">{matchedMentor.mentor.name}</p>
                            <p className="text-xs font-semibold text-green-800 tracking-wide uppercase mt-1">Algorithmic Confidence</p>
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, matchedMentor.logData.final_score * 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {Object.entries(domainHistories).map(([domain, data]) => (
                    <div key={domain} className={`border border-gray-200 rounded-2xl p-6 bg-white shadow-sm transition-transform hover:-translate-y-1 ${recentDomain === domain ? 'ring-2 ring-indigo-500 bg-indigo-50 border-transparent' : ''}`}>
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-xl font-bold text-gray-900">{domain}</h3>
                           {recentDomain === domain && <span className="text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full">Updated</span>}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-6 text-center">
                            <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Attempts</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{data.length}</p>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Peak</p>
                                <p className="text-2xl font-bold text-indigo-600 mt-1">{Math.max(...data.map(d => d.score))}%</p>
                            </div>
                        </div>

                        <div className="h-48 w-full mt-4 border-t border-gray-100 pt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="attempt" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} width={30} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#4F46E5"
                                        strokeWidth={3}
                                        dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}

                {Object.keys(domainHistories).length === 0 && (
                    <div className="col-span-full text-center py-20 bg-gray-50 border border-dashed border-gray-300 rounded-2xl">
                        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No Assessment Data Yet</h3>
                        <p className="text-gray-500 mt-2">Complete a skill assessment to begin tracking your universal mastery.</p>
                        <Button variant="primary" className="mt-6" onClick={() => navigate('/assessment')}>Start First Assessment</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DomainMastery;
