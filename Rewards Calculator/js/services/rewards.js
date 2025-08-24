import { REWARD_CONSTANTS, MONTH_NAMES } from '../data/mock-data.js';
import { logger } from '../utils/logger.js';

export function calculateRewardPoints(amount) {
    if (!amount || amount < 0) {
        logger.warn('Invalid amount provided for reward calculation', { amount });
        return 0;
    }

    let points = 0;
    
    if (amount > REWARD_CONSTANTS.TIER_TWO_THRESHOLD) {
        points += (amount - REWARD_CONSTANTS.TIER_TWO_THRESHOLD) * REWARD_CONSTANTS.TIER_TWO_POINTS;
        points += (REWARD_CONSTANTS.TIER_TWO_THRESHOLD - REWARD_CONSTANTS.TIER_ONE_THRESHOLD) * REWARD_CONSTANTS.TIER_ONE_POINTS;
    } else if (amount > REWARD_CONSTANTS.TIER_ONE_THRESHOLD) {
        points += (amount - REWARD_CONSTANTS.TIER_ONE_THRESHOLD) * REWARD_CONSTANTS.TIER_ONE_POINTS;
    }
    
    logger.debug(`Calculated ${points} points for $${amount} transaction`);
    return Math.floor(points); 
}

export function getMonthlyBreakdown(transactions) {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                month: MONTH_NAMES[(date.getMonth() + 1).toString().padStart(2, '0')],
                year: date.getFullYear(),
                transactions: [],
                totalPoints: 0
            };
        }
        
        const points = calculateRewardPoints(transaction.amount);
        monthlyData[monthKey].transactions.push({
            ...transaction,
            points
        });
        monthlyData[monthKey].totalPoints += points;
    });
    
    return monthlyData;
}