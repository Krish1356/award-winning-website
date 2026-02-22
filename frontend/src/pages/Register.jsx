import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, GraduationCap } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';

const Register = () => {
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register attempt:', { ...formData, role });
        // TODO: Implement actual registration logic
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] py-12">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                    <p className="text-center text-gray-500 mt-2">Join as a Student or Mentor</p>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${role === 'student'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                }`}
                            onClick={() => setRole('student')}
                        >
                            <User className="h-8 w-8 mb-2" />
                            <span className="font-medium">Student</span>
                        </button>
                        <button
                            type="button"
                            className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${role === 'mentor'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                }`}
                            onClick={() => setRole('mentor')}
                        >
                            <GraduationCap className="h-8 w-8 mb-2" />
                            <span className="font-medium">Mentor</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            id="name"
                            label="Full Name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            id="email"
                            type="email"
                            label="Email Address"
                            placeholder="username@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                id="password"
                                type="password"
                                label="Password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                id="confirmPassword"
                                type="password"
                                label="Confirm Password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Button type="submit" variant="primary" className="w-full mt-2">
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;
