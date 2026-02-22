import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BookOpen, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const StudentDashboard = () => {
    // Mock Data
    const skillLevel = 'Beginner';
    const recentQueries = [
        { id: 1, title: 'How to use useEffect in React?', status: 'Resolved', date: '2026-02-19' },
        { id: 2, title: 'Understanding Python Decorators', status: 'Pending', date: '2026-02-21' },
    ];

    return (
        <div className="space-y-6">
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
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <BookOpen className="h-6 w-6" />
                        </div>
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
                        <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Queries</p>
                            <h3 className="text-2xl font-bold text-gray-900">1</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Resolved Queries</p>
                            <h3 className="text-2xl font-bold text-gray-900">12</h3>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{query.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Badge variant={query.status === 'Resolved' ? 'success' : 'warning'}>
                                                {query.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentDashboard;
