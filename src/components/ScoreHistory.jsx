// src/components/ScoreHistory.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserScores } from '../services/scoreService';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const ScoreHistory = () => {
    const { user } = useAuth();
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            if (user) {
                try {
                    const userScores = await getUserScores(user.uid);
                    setScores(userScores);
                } catch (error) {
                    console.error('Error fetching scores:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchScores();
    }, [user]);

    if (!user) return null;

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Your Quiz History</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center">Loading scores...</div>
                ) : (
                    <div className="space-y-4">
                        {scores.map((score) => (
                            <div
                                key={score.id}
                                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <div className="font-medium">{score.symbol}</div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(score.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">
                                        Score: {score.score}/{score.totalQuestions}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {((score.score / score.totalQuestions) * 100).toFixed(0)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ScoreHistory;