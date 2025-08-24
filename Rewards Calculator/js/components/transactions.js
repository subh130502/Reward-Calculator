import { calculateRewardPoints } from '../services/rewards.js';
import { createPagination } from '../utils/pagination.js';
import { elements, updatePagination } from './ui.js';
import { logger } from '../utils/logger.js';

export function updateTransactionDetails(transactions, appState) {
    const transactionsWithPoints = transactions.map(transaction => ({
        ...transaction,
        points: calculateRewardPoints(transaction.amount)
    }));

    transactionsWithPoints.sort((a, b) => new Date(b.date) - new Date(a.date));

    const pagination = createPagination(
        transactionsWithPoints,
        appState.currentTransactionPage
    );

    const table = document.createElement('table');
    table.className = 'transaction-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Reward Points</th>
            </tr>
        </thead>
        <tbody>
            ${pagination.items.map(transaction => `
                <tr>
                    <td>${transaction.transactionId}</td>
                    <td>${new Date(transaction.date).toLocaleDateString()}</td>
                    <td class="amount-cell">$${transaction.amount.toFixed(2)}</td>
                    <td class="points-cell">${transaction.points}</td>
                </tr>
            `).join('')}
        </tbody>
    `;

    elements.transactionTable.innerHTML = '';
    elements.transactionTable.appendChild(table);

    updatePagination(pagination, transactionsWithPoints, (action, allTransactions) => {
        if (action === 'prev' && pagination.hasPreviousPage) {
            appState.currentTransactionPage--;
        } else if (action === 'next' && pagination.hasNextPage) {
            appState.currentTransactionPage++;
        }
        
        updateTransactionDetails(allTransactions, appState);
        logger.info('Pagination navigation', { 
            action, 
            newPage: appState.currentTransactionPage 
        });
    });
}