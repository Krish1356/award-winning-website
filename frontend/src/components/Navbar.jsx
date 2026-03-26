import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BookOpen, User, LogOut } from 'lucide-react';
import Button from './ui/Button';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    });

    const isLoggedIn = !!currentUser;

    // Listen to storage event so login sets the navbar automatically across tabs or without reload
    React.useEffect(() => {
        const handleStorage = () => {
            const saved = localStorage.getItem('currentUser');
            setCurrentUser(saved ? JSON.parse(saved) : null);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        window.location.href = '/login';
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <svg className="h-8 w-8 text-purple-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M 87.1 35 A 40 40 0 1 0 90 50 H 65" />
                                <path d="M 63.2 35 A 20 20 0 1 0 63.2 65" />
                            </svg>
                            <span className="ml-2 text-xl font-bold text-gray-900">GradConnect</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/" className="border-transparent text-gray-500 hover:border-purple-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Home
                            </Link>
                            {isLoggedIn && (
                                <Link to={currentUser.role === 'mentor' ? "/mentor/dashboard" : "/dashboard"} className="border-transparent text-gray-500 hover:border-purple-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Dashboard
                                </Link>
                            )}
                            <Link to="/mentors" className="border-transparent text-gray-500 hover:border-purple-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Mentors
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 text-sm font-medium">Welcome, {currentUser.name}</span>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                        >
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link to="/" className="bg-purple-50 border-purple-500 text-purple-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                            Home
                        </Link>
                        {isLoggedIn && (
                            <Link to={currentUser.role === 'mentor' ? "/mentor/dashboard" : "/dashboard"} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                                Dashboard
                            </Link>
                        )}
                        <Link to="/mentors" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                            Mentors
                        </Link>
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200">
                        {isLoggedIn ? (
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <User className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-600" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{currentUser.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{currentUser.email}</div>
                                </div>
                                <div className="ml-auto">
                                   <Button variant="ghost" size="sm" onClick={handleLogout}>
                                        <LogOut className="h-5 w-5 text-gray-500 hover:text-red-500" />
                                   </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 space-y-1 px-4">
                                <Link to="/login" className="block w-full">
                                    <Button variant="outline" className="w-full justify-center">Login</Button>
                                </Link>
                                <Link to="/register" className="block w-full mt-2">
                                    <Button variant="primary" className="w-full justify-center">Sign up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
