import React, { useEffect, useState } from 'react';
import { getTable } from '../lib/mockDB';
import { Network, Award, ShieldCheck } from 'lucide-react';

const MentorSidebar = () => {
    const [mentorDirectory, setMentorDirectory] = useState([]);

    useEffect(() => {
        const users = getTable('users').filter(u => u.role === 'mentor');
        const expertiseTable = getTable('mentor_expertise');
        const perfTable = getTable('mentor_performance');

        const directory = users.map(u => {
            const exp = expertiseTable.find(e => e.mentor_id === u.id);
            const perf = perfTable.find(p => p.mentor_id === u.id);
            return {
                id: u.id,
                name: u.name,
                domain: exp?.domain || 'General',
                level: exp?.level || 'Intermediate',
                rating: perf?.avg_rating || 0
            };
        });
        setMentorDirectory(directory);
    }, []);

    const getLevelColor = (level) => {
        switch (level) {
            case 'Expert': return 'bg-purple-100 text-purple-800';
            case 'Advanced': return 'bg-blue-100 text-blue-800';
            case 'Intermediate': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <Network className="h-5 w-5 text-indigo-600" />
                        <h3 className="font-semibold text-gray-900">Mentor Network</h3>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                    Compare student assessment levels with established mentors across various domains.
                </p>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {mentorDirectory.map(mentor => (
                        <div key={mentor.id} className="p-3 border rounded-lg hover:shadow-md transition-shadow bg-gray-50 flex flex-col space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800">{mentor.name}</h4>
                                    <p className="text-xs font-medium text-gray-500">{mentor.domain}</p>
                                </div>
                                <div className="flex items-center text-yellow-500 text-xs font-bold">
                                    ⭐ {mentor.rating}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getLevelColor(mentor.level)}`}>
                                    {mentor.level}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
                 <div className="flex items-center space-x-2 mb-2">
                    <ShieldCheck className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">Matching Logic</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                    When a student scores poorly on an assessment, their <strong>Level</strong> shifts to Beginner. Our recommendation engine parses this Sidebar network and intelligently biases towards Mentors who excel in foundational teachings.
                </p>
            </div>
        </div>
    );
};

export default MentorSidebar;
