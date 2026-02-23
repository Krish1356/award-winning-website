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
            {/* FAQ Section */}
            <section className="mt-20 max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
                    <p className="text-gray-600 mt-2">Everything you need to know about GradConnect</p>
                </div>
                <div className="space-y-4">
                    {[
                        {
                            q: "What is GradConnect and how does it work?",
                            a: "GradConnect is a smart platform that instantly pairs students with experienced mentors. You simply sign up, take a quick skill assessment, and our AI matches you with mentors tailored precisely to your domain and queries."
                        },
                        {
                            q: "How does the AI-powered matching work?",
                            a: "Our system safely analyzes the specifics of your query (like Web Development, Data Science, etc.), reviews your past skill assessment scores, and cross-references them with the expertise of our verified mentors to find the optimal fit."
                        },
                        {
                            q: "Is the initial skill assessment mandatory?",
                            a: "We highly recommend it! The short 5-question AI-generated quiz helps us accurately determine your current level (Beginner, Intermediate, or Advanced) so you get guidance that isn't too easy or too overwhelming."
                        },
                        {
                            q: "How are mentors verified on the platform?",
                            a: "All mentors go through a vetting process where we review their professional experience, past project portfolios, and domain knowledge. Plus, an ongoing community rating system helps assure high-quality interactions."
                        },
                        {
                            q: "Is there a structured course curriculum I need to follow?",
                            a: "No, GradConnect is designed for highly personalized, query-based learning. While mentors can provide structured guidance if you ask for it, the platform is mainly focused on helping you overcome specific roadblocks and accelerating your personal projects."
                        },
                        {
                            q: "How can I track my learning progress over time?",
                            a: "Your Student Dashboard automatically tracks your resolved queries, domains explored, and displays a graphical representation of your skill improvement scores from your periodic assessments."
                        }
                    ].map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                            <details className="group">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 text-gray-800 hover:bg-gray-50 transition-colors">
                                    <span className="font-semibold">{faq.q}</span>
                                    <span className="transition duration-300 group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <p className="text-gray-600 p-5 pt-0 group-open:animate-fadeIn">
                                    {faq.a}
                                </p>
                            </details>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
