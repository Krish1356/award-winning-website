import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTable } from '../lib/mockDB';
import { PlusCircle, BookOpen, Clock, CheckCircle, Eye } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StudentSidebar from '../components/StudentSidebar';

const StudentDashboard = () => {
    const savedUser = localStorage.getItem('currentUser');
    const currentUser = savedUser ? JSON.parse(savedUser) : { id: 'u1' };
    const studentId = currentUser.id;

    const [skillLevel, setSkillLevel] = useState('Beginner');
    const [recentQueries, setRecentQueries] = useState([]);
    const [stats, setStats] = useState({ pending: 0, resolved: 0 });

    useEffect(() => {
        const allQueries = getTable('queries').filter(q => q.student_id === studentId);
        setRecentQueries(allQueries.reverse());
        
        setStats({
            pending: allQueries.filter(q => q.status === 'pending').length,
            resolved: allQueries.filter(q => q.status === 'resolved').length
        });

        const skills = getTable('student_skill_profile').filter(s => s.student_id === studentId);
        if (skills.length > 0) {
            setSkillLevel(skills[0].level);
        }
    }, [studentId]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
                <Link to="/query/new">
                    <Button variant="primary">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Raise Query
                    </Button>
                </Link>
            </div>

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
        </div>
    );
};

export default StudentDashboard;
