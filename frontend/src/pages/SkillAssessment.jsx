import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getTable, insertIntoTable, updateInTable, generateMockEmbedding, findBestMentorForQuery } from '../lib/mockDB';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const SkillAssessment = () => {
    const navigate = useNavigate();

    // UI State
    const [step, setStep] = useState('setup'); // setup, loading, quiz, results
    const [domain, setDomain] = useState('');
    const [experience, setExperience] = useState('');
    const [error, setError] = useState('');

    // Quiz State
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    // Mock Historical Data
    const [pastScores] = useState([
        { date: 'Feb 1', score: 40 },
        { date: 'Feb 10', score: 60 },
        { date: 'Feb 15', score: 50 },
    ]);
    const mockDomainsExplored = 3;

    const generateQuestions = async () => {
        try {
            setError('');
            setStep('loading');

            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.");
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `You are a technical interviewer. Create a 5-question multiple-choice quiz for a ${experience} level student in the domain of ${domain}. 
Return ONLY valid JSON in the exact following format, without markdown blocks or extra text:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0
  }
]`;

            const result = await model.generateContent(prompt);
            const textResponse = result.response.text();

            // Clean up potentially markdown-wrapped JSON
            let cleanJson = textResponse.trim();
            if (cleanJson.startsWith('```json')) {
                cleanJson = cleanJson.substring(7);
            }
            if (cleanJson.startsWith('```')) {
                cleanJson = cleanJson.substring(3);
            }
            if (cleanJson.endsWith('```')) {
                cleanJson = cleanJson.substring(0, cleanJson.length - 3);
            }

            const generatedQuestions = JSON.parse(cleanJson);

            if (!Array.isArray(generatedQuestions) || generatedQuestions.length !== 5) {
                throw new Error("Invalid response format from AI.");
            }

            // --- MockDB Integration: NLP & Assessment ---
            insertIntoTable('ai_interactions', {
                id: 'gen_' + Date.now(),
                user_id: 'u1',
                query: prompt,
                response: cleanJson,
                type: 'quiz',
                timestamp: new Date().toISOString()
            });

            const quizId = 'quiz_' + Date.now();
            insertIntoTable('quizzes', {
                id: quizId,
                domain: domain,
                generated_by: 'gemini',
                created_at: new Date().toISOString()
            });
            
            generatedQuestions.forEach((q, i) => {
                insertIntoTable('quiz_questions', {
                    quiz_id: quizId,
                    question: q.question,
                    options: q.options,
                    correct_answer: q.correctAnswerIndex,
                    difficulty: experience
                });
            });

            const annotatedQuestions = generatedQuestions.map(q => ({ ...q, quizId }));
            setQuestions(annotatedQuestions);
            setStep('quiz');

        } catch (err) {
            console.error("Error generating quiz:", err);
            setError(err.message || "Failed to generate quiz. Please try again.");
            setStep('setup');
        }
    };

    const handleSetupSubmit = (e) => {
        e.preventDefault();
        generateQuestions();
    };

    const handleOptionSelect = (optionIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: optionIndex
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // --- MockDB Integration: Update Skill Profile ---
            const finalScore = calculateScore();
            const quizId = questions[0]?.quizId;
            const savedUser = localStorage.getItem('currentUser');
            const currentUser = savedUser ? JSON.parse(savedUser) : null;
            const studentId = currentUser ? currentUser.id : 'u1';
            
            insertIntoTable('student_quiz_attempts', {
                id: 'att_' + Date.now(),
                student_id: studentId,
                quiz_id: quizId,
                score: finalScore,
                time_taken: 120, // Mock time
                created_at: new Date().toISOString()
            });

            const level = finalScore >= 80 ? 'Advanced' : finalScore >= 50 ? 'Intermediate' : 'Beginner';
            
            const existingProfile = getTable('student_skill_profile').find(s => s.student_id === studentId && s.domain === domain);
            if (existingProfile) {
                updateInTable('student_skill_profile', s => s.student_id === studentId && s.domain === domain, {
                    level,
                    avg_score: (existingProfile.avg_score + finalScore) / 2,
                    last_updated: new Date().toISOString()
                });
            } else {
                insertIntoTable('student_skill_profile', {
                    student_id: studentId,
                    domain: domain,
                    level,
                    avg_score: finalScore,
                    improvement_rate: 0,
                    confidence_score: finalScore / 100,
                    last_updated: new Date().toISOString()
                });
            }

            // --- Trigger Auto-Query and Connect with Mentor! ---
            const queryId = 'q' + Date.now();
            const queryTitle = `Skill Review Request: ${domain} (${level})`;
            const queryDesc = `I just completed a skill assessment for ${domain} (${experience}) and scored ${finalScore}%. Can a mentor review my progress?`;
            
            insertIntoTable('queries', {
                id: queryId,
                student_id: studentId,
                title: queryTitle,
                description: queryDesc,
                domain: domain,
                score: finalScore,
                created_at: new Date().toISOString(),
                status: 'pending'
            });

            const embedding = generateMockEmbedding(`${queryTitle} ${queryDesc}`);
            insertIntoTable('query_embeddings', {
                query_id: queryId,
                embedding_vector: embedding
            });

            // Engage Hybrid Recommendation Engine
            findBestMentorForQuery(queryId);

            setStep('results');
        }
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.correctAnswerIndex) {
                correct++;
            }
        });
        return Math.round((correct / questions.length) * 100);
    };

    // View Components
    const renderSetup = () => (
        <form onSubmit={handleSetupSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                    {error}
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Domain</label>
                <select
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                >
                    <option value="">Select a domain...</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Cyber Security">Cyber Security</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience / Knowledge Level</label>
                <div className="space-y-4">
                    <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                            type="radio"
                            name="experience"
                            value="Beginner"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
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
                            value="Intermediate"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
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
                            value="Advanced"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
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
                Start Assessment
            </Button>
        </form>
    );

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-600 font-medium">Generating your custom AI assessment...</p>
        </div>
    );

    const renderQuiz = () => {
        const question = questions[currentQuestionIndex];
        const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-medium text-gray-500">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="text-sm font-medium bg-purple-100 text-purple-800 py-1 px-3 rounded-full">
                        {domain} - {experience}
                    </span>
                </div>

                <h3 className="text-xl font-medium text-gray-900">{question.question}</h3>

                <div className="space-y-3 mt-6">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            className={`w-full text-left p-4 rounded-lg border transition-colors ${selectedAnswers[currentQuestionIndex] === index
                                    ? 'border-purple-600 bg-purple-50'
                                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                }`}
                        >
                            <span className="inline-block w-6 font-medium text-gray-500">
                                {String.fromCharCode(65 + index)}.
                            </span>
                            {option}
                        </button>
                    ))}
                </div>

                <div className="pt-6 flex justify-end">
                    <Button
                        onClick={handleNext}
                        disabled={!isAnswered}
                        variant="primary"
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
                    </Button>
                </div>
            </div>
        );
    };

    const renderResults = () => {
        const currentScore = calculateScore();
        // Calculate mock improvement based on last score
        const lastScore = pastScores[pastScores.length - 1].score;
        const improvement = currentScore - lastScore;

        // Append current score to graph data
        const graphData = [...pastScores, { date: 'Today', score: currentScore }];

        return (
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete</h2>
                    <p className="text-gray-500 text-lg">Here's how you performed in {domain}</p>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-xl p-6 text-center bg-white shadow-sm">
                        <p className="text-sm font-medium text-gray-500 mb-2">Current Score</p>
                        <h3 className="text-4xl font-bold text-purple-600">{currentScore}%</h3>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6 text-center bg-white shadow-sm">
                        <p className="text-sm font-medium text-gray-500 mb-2">Improvement Score</p>
                        <h3 className={`text-4xl font-bold ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {improvement >= 0 ? '+' : ''}{improvement}%
                        </h3>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6 text-center bg-white shadow-sm">
                        <p className="text-sm font-medium text-gray-500 mb-2">Domains Explored</p>
                        <h3 className="text-4xl font-bold text-gray-900">{mockDomainsExplored}</h3>
                    </div>
                </div>

                {/* Graph */}
                <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm mt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Your Learning Progress</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#9333EA"
                                    strokeWidth={3}
                                    dot={{ fill: '#9333EA', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex justify-center pt-4">
                    <Button onClick={() => navigate('/dashboard')} variant="primary">
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <Card className="shadow-lg border-0 ring-1 ring-gray-200">
                {(step === 'setup' || step === 'loading') && (
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold text-gray-900">Skill Assessment</CardTitle>
                        <p className="text-gray-500 mt-2">Find out your current level to match with the best mentors.</p>
                    </CardHeader>
                )}
                <CardContent className="pt-6">
                    {step === 'setup' && renderSetup()}
                    {step === 'loading' && renderLoading()}
                    {step === 'quiz' && renderQuiz()}
                    {step === 'results' && renderResults()}
                </CardContent>
            </Card>
        </div>
    );
};

export default SkillAssessment;
