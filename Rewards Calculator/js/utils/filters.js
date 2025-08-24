import { logger } from './logger.js';

export function getUniqueCustomers(transactions) {
    const customerMap = new Map();
    
    transactions.forEach(transaction => {
        if (!customerMap.has(transaction.customerId)) {
            customerMap.set(transaction.customerId, {
                customerId: transaction.customerId,
                customerName: transaction.customerName
            });
        }
    });
    
    return Array.from(customerMap.values()).sort((a, b) => a.customerName.localeCompare(b.customerName));
}

export function filterTransactions(transactions, customerId, month, year) {
    logger.info('Filtering transactions', { customerId, month, year });
    
    let filtered = transactions.filter(t => t.customerId === customerId);
    
    if (month === 'last3') {
        const currentDate = new Date();
        const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
        filtered = filtered.filter(t => new Date(t.date) >= threeMonthsAgo);
    } else {
        filtered = filtered.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getFullYear().toString() === year &&
                   (transactionDate.getMonth() + 1).toString().padStart(2, '0') === month;
        });
    }
    
    logger.info(`Filtered to ${filtered.length} transactions`);
    return filtered;
}