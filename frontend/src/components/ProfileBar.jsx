import React, { useEffect, useState } from 'react';
import { getTable } from '../lib/mockDB';
import { User, Mail, ShieldCheck, GraduationCap, Calendar, Award } from 'lucide-react';
import Card, { CardContent } from './ui/Card';

const ProfileBar = ({ user }) => {
    const [details, setDetails] = useState({
        mentorsTaken: [],
        domain: '',
        joinDate: '',
        rating: null
    });

    useEffect(() => {
        if (!user) return;
        
        const joinD = user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recent';
        
        if (user.role === 'student') {
            const assignments = getTable('mentor_assignments').filter(a => a.accepted === 'yes');
            const queries = getTable('queries').filter(q => q.student_id === user.id);
            const queryIds = queries.map(q => q.id);
            const myAssignments = assignments.filter(a => queryIds.includes(a.query_id));
            
            const allUsers = getTable('users');
            const mentors = [...new Set(myAssignments.map(a => {
                const q = queries.find(qi => qi.id === a.query_id);
                const m = allUsers.find(u => u.id === a.mentor_id);
                return m ? `${m.name} (${q?.domain || 'General'})` : null;
            }).filter(Boolean))];
            
            setDetails({ ...details, mentorsTaken: mentors, joinDate: joinD });
        } else {
            const exp = getTable('mentor_expertise').find(e => e.mentor_id === user.id);
            const perf = getTable('mentor_performance').find(p => p.mentor_id === user.id);
            setDetails({ 
                ...details, 
                domain: exp?.domain || 'General', 
                rating: perf?.avg_rating || 'Unrated',
                joinDate: joinD 
            });
        }
    }, [user]);

    if (!user) return null;

    return (
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-sm dark:from-gray-800 dark:to-gray-850 dark:border-gray-700">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl border-2 border-blue-200">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center dark:text-white">
                                {user.name} 
                                {user.role === 'mentor' && <ShieldCheck className="h-5 w-5 text-blue-500 ml-2" />}
                            </h2>
                            <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4 dark:text-gray-400">
                                <span className="flex items-center"><Mail className="h-4 w-4 mr-1" /> {user.email}</span>
                                <span className="flex items-center capitalize"><User className="h-4 w-4 mr-1" /> {user.role}</span>
                                <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> Joined: {details.joinDate}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200 md:pl-6 dark:border-gray-700 w-full md:w-auto">
                        {user.role === 'student' ? (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 dark:text-gray-400">Mentors & Courses Taken</p>
                                {details.mentorsTaken.length > 0 ? (
                                    <ul className="text-sm text-gray-700 space-y-1 dark:text-gray-300">
                                        {details.mentorsTaken.map((m, idx) => (
                                            <li key={idx} className="flex items-center"><GraduationCap className="h-3 w-3 mr-2 text-indigo-500" /> {m}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500 italic dark:text-gray-400">No mentors assigned yet.</p>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-3">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Expertise Domain</p>
                                    <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                                        {details.domain}
                                    </span>
                                </div>
                                <div className="flex items-center text-yellow-600 font-bold">
                                    <Award className="h-4 w-4 mr-1" />
                                    <span>{details.rating} Average Rating</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileBar;
