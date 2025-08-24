import { mockTransactions } from '../data/mock-data.js';
import { logger } from '../utils/logger.js';

export async function fetchTransactionData() {
    logger.info('Fetching transaction data from API');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (Math.random() < 0.05) {
        logger.error('API call failed');
        throw new Error('Failed to fetch transaction data');
    }
    
    logger.info('Transaction data fetched successfully', { count: mockTransactions.length });
    return mockTransactions;
}