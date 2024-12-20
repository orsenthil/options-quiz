// src/services/scoreService.js
import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    limit
} from 'firebase/firestore';

export const saveScore = async (userId, score, totalQuestions, symbol, date) => {
    try {
        const scoresRef = collection(db, 'scores');
        await addDoc(scoresRef, {
            userId,
            score,
            totalQuestions,
            symbol,
            date: new Date(),
            tradeDate: date
        });
    } catch (error) {
        console.error('Error saving score:', error);
        throw error;
    }
};

export const getUserScores = async (userId) => {
    try {
        const scoresRef = collection(db, 'scores');
        const q = query(
            scoresRef,
            where('userId', '==', userId),
            orderBy('date', 'desc'),
            limit(10)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate()
        }));
    } catch (error) {
        console.error('Error fetching user scores:', error);
        throw error;
    }
};