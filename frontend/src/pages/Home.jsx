import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';
import Button from '../components/ui/Button';

const Home = () => {
    return (
        <div className="space-y-16 py-8">
            {/* Hero Section */}
            <section className="text-center space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                    Master Your Skills with <br />
                    <span className="text-blue-600">Smart Mentorship</span>
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-gray-500">
                    Get matched with the perfect mentor based on your skill level and specific queries.
                    Personalized guidance to accelerate your growth.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/register">
                        <Button size="lg" className="px-8 py-3 text-lg">
                            Get Started <ArrowRight className="ml-2 h-5 w-5 inline" />
                        </Button>
                    </Link>
                    <Link to="/mentors">
                        <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                            Browse Mentors
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="grid md:grid-cols-3 gap-8 px-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center space-y-4">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-blue-600">
                        <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">AI-Powered Matching</h3>
                    <p className="text-gray-500">
                        Our system analyzes your query and skill level to connect you with the most relevant mentor instantly.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center space-y-4">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-green-600">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Skill Assessment</h3>
                    <p className="text-gray-500">
                        Take a quick quiz to determine your current level (Beginner, Intermediate, Advanced) for better guidance.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center space-y-4">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-purple-600">
                        <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Verified Mentors</h3>
                    <p className="text-gray-500">
                        Learn from industry experts who have been vetted and rated by other students for quality.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
