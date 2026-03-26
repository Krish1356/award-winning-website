import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTable } from '../lib/mockDB';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const users = getTable('users');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            if (user.role === 'mentor') {
                navigate('/mentor/dashboard');
            } else {
                navigate('/dashboard');
            }
            // slight delay to let navbar pick up the new localstorage without a full context (in a real app we'd use Context provider)
            window.dispatchEvent(new Event('storage'));
        } else {
            alert('Invalid credentials! Try alice@student.com / password123');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                    <p className="text-center text-gray-500 mt-2">Sign in to continue to your dashboard</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            id="email"
                            type="email"
                            label="Email Address"
                            placeholder="username@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            id="password"
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="primary" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-purple-600 hover:text-purple-500 font-medium">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
