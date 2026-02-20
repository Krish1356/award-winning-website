import React from 'react';
import { Users, Star, MessageSquare } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const MentorDashboard = () => {
    // Mock Data
    const stats = {
        studentsGuided: 12,
        rating: 4.8,
        activeChats: 3
    };

    const incomingRequests = [
        { id: 1, student: 'Alice Johnson', query: 'Help with React Context API', domain: 'Web Development', time: '2 mins ago' },
        { id: 2, student: 'Bob Smith', query: 'Debugging Python Flask routes', domain: 'Backend', time: '15 mins ago' },
    ];

    return (
        <div className="space-y-6">
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
                            <div key={req.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg bg-gray-50">
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900">{req.query}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="primary">{req.domain}</Badge>
                                        <span className="text-sm text-gray-500">• {req.student}</span>
                                        <span className="text-sm text-gray-400">• {req.time}</span>
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0 flex gap-2">
                                    <Button size="sm" variant="success" className="bg-green-600 hover:bg-green-700 text-white">Accept</Button>
                                    <Button size="sm" variant="outline">Ignore</Button>
                                </div>
                            </div>
                        ))}
                        {incomingRequests.length === 0 && (
                            <p className="text-center text-gray-500 py-4">No new requests at the moment.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MentorDashboard;
