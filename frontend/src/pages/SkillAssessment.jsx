import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';

const SkillAssessment = () => {
    const navigate = useNavigate();
    const [domain, setDomain] = useState('');
    const [experience, setExperience] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Assessment submitted:', { domain, experience });
        // Mock logic to calculate level
        alert('You have been assessed as: Intermediate');
        navigate('/dashboard');
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Skill Assessment</CardTitle>
                    <p className="text-gray-500">Let's find out your current level to match you with the best mentors.</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Domain</label>
                            <select
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                required
                            >
                                <option value="">Select a domain...</option>
                                <option value="web-dev">Web Development</option>
                                <option value="data-science">Data Science</option>
                                <option value="mobile-dev">Mobile Development</option>
                                <option value="cyber-security">Cyber Security</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience / Knowledge Level</label>
                            <div className="space-y-4">
                                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="experience"
                                        value="beginner"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        onChange={(e) => setExperience(e.target.value)}
                                        required
                                    />
                                    <div>
                                        <span className="block text-sm font-medium text-gray-900">Beginner</span>
                                        <span className="block text-sm text-gray-500">I am just starting out and learning the basics.</span>
                                    </div>
                                </label>
                                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="experience"
                                        value="intermediate"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        onChange={(e) => setExperience(e.target.value)}
                                    />
                                    <div>
                                        <span className="block text-sm font-medium text-gray-900">Intermediate</span>
                                        <span className="block text-sm text-gray-500">I have built a few projects and understand core concepts.</span>
                                    </div>
                                </label>
                                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="experience"
                                        value="advanced"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        onChange={(e) => setExperience(e.target.value)}
                                    />
                                    <div>
                                        <span className="block text-sm font-medium text-gray-900">Advanced</span>
                                        <span className="block text-sm text-gray-500">I have professional experience and deep knowledge.</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <Button type="submit" variant="primary" className="w-full">
                            Calculate My Level
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SkillAssessment;
