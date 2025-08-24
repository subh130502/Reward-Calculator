import { calculateRewardPoints } from '../services/rewards.js';
import { logger } from '../utils/logger.js';

export function runTests() {
    logger.info('Running unit tests');
    
    const tests = [
        {
            name: 'Basic reward calculation - $120',
            test: () => calculateRewardPoints(120) === 90,
            expected: 90,
            actual: calculateRewardPoints(120)
        },
        {
            name: 'Fractional amount - $120.50',
            test: () => calculateRewardPoints(120.50) === 91,
            expected: 91,
            actual: calculateRewardPoints(120.50)
        },
        {
            name: 'Amount under $50 - $25',
            test: () => calculateRewardPoints(25) === 0,
            expected: 0,
            actual: calculateRewardPoints(25)
        },
        {
            name: 'Amount between $50-$100 - $75',
            test: () => calculateRewardPoints(75) === 25,
            expected: 25,
            actual: calculateRewardPoints(75)
        },
        {
            name: 'Exactly $100',
            test: () => calculateRewardPoints(100) === 50,
            expected: 50,
            actual: calculateRewardPoints(100)
        },
        {
            name: 'Invalid input - negative amount',
            test: () => calculateRewardPoints(-50) === 0,
            expected: 0,
            actual: calculateRewardPoints(-50)
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    tests.forEach(test => {
        if (test.test()) {
            logger.info(`✅ PASS: ${test.name}`);
            passed++;
        } else {
            logger.error(`❌ FAIL: ${test.name} - Expected: ${test.expected}, Actual: ${test.actual}`);
            failed++;
        }
    });
    
    logger.info(`Tests completed: ${passed} passed, ${failed} failed`);
    return { passed, failed, total: tests.length };
}