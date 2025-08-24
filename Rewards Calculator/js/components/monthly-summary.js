import { elements } from './ui.js';
import { updateTransactionDetails } from './transactions.js';
import { logger } from '../utils/logger.js';

export function updateMonthlyDisplay(monthlyData, appState) {
    elements.monthlySummary.innerHTML = '';
    
    const sortedMonths = Object.keys(monthlyData).sort().reverse();
    
    sortedMonths.forEach(monthKey => {
        const data = monthlyData[monthKey];
        const monthCard = document.createElement('div');
        monthCard.className = 'monthly-card';
        monthCard.dataset.monthKey = monthKey;
        
        monthCard.innerHTML = `
            <h4>${data.month} ${data.year}</h4>
            <div class="monthly-points">${data.totalPoints.toLocaleString()}</div>
            <small>${data.transactions.length} transactions</small>
        `;
        
        monthCard.addEventListener('click', () => {
            document.querySelectorAll('.monthly-card').forEach(card => {
                card.classList.remove('active');
            });
            
            monthCard.classList.add('active');
            
            appState.selectedMonthForDetails = monthKey;
            appState.currentTransactionPage = 1;
            updateTransactionDetails(data.transactions, appState);
            
            logger.info('Month selected for details', { monthKey, transactionCount: data.transactions.length });
        });
        
        elements.monthlySummary.appendChild(monthCard);
    });

    if (sortedMonths.length > 0) {
        const firstCard = elements.monthlySummary.querySelector('.monthly-card');
        if (firstCard) {
            firstCard.click();
        }
    }
}