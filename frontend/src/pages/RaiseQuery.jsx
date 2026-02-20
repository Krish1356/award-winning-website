import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const RaiseQuery = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState({
        title: '',
        domain: '',
        description: '',
    });

    const handleChange = (e) => {
        setQuery({ ...query, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Query submitted:', query);
        // Mock submission
        alert('Your query has been submitted! We are finding the best mentor for you.');
        navigate('/dashboard');
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Raise a New Query</CardTitle>
                    <p className="text-gray-500">Describe your issue or question to get matched with an expert mentor.</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            id="title"
                            label="Query Title"
                            placeholder="e.g., Error in React useEffect dependency array"
                            value={query.title}
                            onChange={handleChange}
                            required
                        />

                        <div>
                            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                            <select
                                id="domain"
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                value={query.domain}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a domain...</option>
                                <option value="web-dev">Web Development</option>
                                <option value="data-science">Data Science</option>
                                <option value="mobile-dev">Mobile Development</option>
                                <option value="cyber-security">Cyber Security</option>
                                <option value="cloud">Cloud Computing</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                id="description"
                                rows="5"
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                placeholder="Provide more details about your problem..."
                                value={query.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <Button type="submit" variant="primary" className="w-full">
                            Submit Query
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RaiseQuery;
