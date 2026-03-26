import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { insertIntoTable, generateMockEmbedding, findBestMentorForQuery } from '../lib/mockDB';

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
        
        const savedUser = localStorage.getItem('currentUser');
        const currentUser = savedUser ? JSON.parse(savedUser) : null;
        
        // 1. Create the query record
        const queryId = 'q' + Date.now();
        insertIntoTable('queries', {
            id: queryId,
            student_id: currentUser ? currentUser.id : 'u1',
            title: query.title,
            description: query.description,
            domain: query.domain,
            created_at: new Date().toISOString(),
            status: 'pending'
        });

        // 2. NLP MODULE: Generate Embedding for the query
        const textToEmbed = `${query.title} ${query.description} ${query.domain}`;
        const embedding = generateMockEmbedding(textToEmbed);
        insertIntoTable('query_embeddings', {
            query_id: queryId,
            embedding_vector: embedding
        });

        // 3. HYBRID RECOMMENDATION ENGINE: Find best mentor
        const bestMatch = findBestMentorForQuery(queryId);

        if (bestMatch) {
            alert(`Success! Based on ML Similarity (${bestMatch.logData.query_similarity_score}) and Skill Match (${bestMatch.logData.skill_match_score}), we matched you with ${bestMatch.mentor.name}!`);
        } else {
            alert('Your query has been submitted! We are finding the best mentor for you.');
        }

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
                                <option value="Web Development">Web Development</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Machine Learning">Machine Learning</option>
                                <option value="Mobile Development">Mobile Development</option>
                                <option value="Cyber Security">Cyber Security</option>
                                <option value="Cloud Computing">Cloud Computing</option>
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
