import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';
import Button from '../components/ui/Button';

const Home = () => {
    return (
        <div className="p-8">
            {/* Hero Section */}
            <section className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-800">
                    Master Your Skills with <br />
                    <span className="text-purple-400">Smart Mentorship</span>
                </h1>
                <p className="text-lg text-black mb-8 mt-4">
                    Get matched with the perfect mentor based on your skill level and specific queries.
                    Personalized guidance to accelerate your growth.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/register">
                        <Button>
                            Get Started
                        </Button>
                    </Link>
                    <Link to="/mentors">
                        <Button variant="outline">
                            Browse Mentors
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="grid md:grid-cols-3 gap-8">
                <div className="border border-black rounded-2xl p-4 text-center bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-gray-100 cursor-default">
                    <h3 className="text-xl font-bold text-black mb-2">AI-Powered Matching</h3>
                    <p className="text-base text-black">
                        Our system analyzes your query and skill level to connect you with the most relevant mentor instantly.
                    </p>
                </div>
                <div className="border border-black rounded-2xl p-4 text-center bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-gray-100 cursor-default">
                    <h3 className="text-xl font-bold text-black mb-2">Skill Assessment</h3>
                    <p className="text-base text-black">
                        Take a quick quiz to determine your current level (Beginner, Intermediate, Advanced) for better guidance.
                    </p>
                </div>
                <div className="border border-black rounded-2xl p-4 text-center bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-gray-100 cursor-default">
                    <h3 className="text-xl font-bold text-black mb-2">Verified Mentors</h3>
                    <p className="text-base text-black">
                        Learn from industry experts who have been vetted and rated by other students for quality.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
