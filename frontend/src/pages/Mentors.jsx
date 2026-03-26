import React, { useEffect, useState } from 'react';
import { getTable } from '../lib/mockDB';
import { Star, GraduationCap, Briefcase, Award } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Mentors = () => {
    const [mentorsList, setMentorsList] = useState([]);

    useEffect(() => {
        const users = getTable('users').filter(u => u.role === 'mentor');
        const profiles = getTable('mentor_profile');
        const expertise = getTable('mentor_expertise');
        const performance = getTable('mentor_performance');

        const combined = users.map(user => {
            const prof = profiles.find(p => p.user_id === user.id);
            const exp = expertise.find(e => e.mentor_id === user.id);
            const perf = performance.find(pe => pe.mentor_id === user.id);

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                experience: prof?.experience_years || 0,
                bio: prof?.bio || 'Experienced Mentor',
                domain: exp?.domain || 'General',
                level: exp?.level || 'Intermediate',
                skills: exp?.skills_text?.split(', ') || [],
                rating: perf?.avg_rating || 0,
                totalSessions: perf?.total_sessions || 0,
            };
        });

        setMentorsList(combined);
    }, []);

    const getLevelBadgeColor = (level) => {
        switch (level) {
            case 'Expert': return 'success';
            case 'Advanced': return 'primary';
            case 'Intermediate': return 'warning';
            default: return 'secondary';
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                    Our Global Mentors
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Connect with industry experts across specific domains to elevate your skills and career.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mentorsList.map((mentor) => (
                    <Card key={mentor.id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{mentor.name}</h3>
                                    <p className="text-sm font-medium text-purple-600">{mentor.domain} Specialist</p>
                                </div>
                                <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="text-sm font-bold text-yellow-700">{mentor.rating}</span>
                                </div>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mentor.bio}</p>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-sm text-gray-500">
                                    <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                                    {mentor.experience} Years Experience
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Award className="h-4 w-4 mr-2 text-gray-400" />
                                    {mentor.totalSessions} Students Guided
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                                    Level: <Badge variant={getLevelBadgeColor(mentor.level)} className="ml-2">{mentor.level}</Badge>
                                </div>
                            </div>

                            <div className="mt-4 border-t pt-4">
                                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Top Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {mentor.skills.slice(0, 3).map((skill, idx) => (
                                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                            {skill}
                                        </span>
                                    ))}
                                    {mentor.skills.length > 3 && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                                            +{mentor.skills.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Mentors;
