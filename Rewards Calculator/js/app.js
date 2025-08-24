import { fetchTransactionData } from './services/api.js';
import { calculateRewardPoints, getMonthlyBreakdown } from './services/rewards.js';
import { getUniqueCustomers, filterTransactions } from './utils/filters.js';
import { logger } from './utils/logger.js';
import { elements, showLoading, hideLoading, showError, showResults } from './components/ui.js';
import { updateTransactionDetails } from './components/transactions.js';
import { updateMonthlyDisplay } from './components/monthly-summary.js';
import { runTests } from './tests/rewards.test.js';

let appState = {
    transactions: [],
    customers: [],
    selectedCustomerId: '',
    selectedMonth: 'last3',
    selectedYear: '2025',
    currentTransactionPage: 1,
    selectedMonthForDetails: null,
    loading: false,
    error: null
};

function populateCustomerDropdown() {
    const customers = getUniqueCustomers(appState.transactions);
    appState.customers = customers;
    
    elements.customerSelect.innerHTML = '<option value="">Select a customer...</option>';
    
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.customerId;
        option.textContent = customer.customerName;
        elements.customerSelect.appendChild(option);
    });
    
    if (customers.length > 0) {
        appState.selectedCustomerId = customers[0].customerId;
        elements.customerSelect.value = customers[0].customerId;
    }
    
    logger.info('Customer dropdown populated', { count: customers.length });
}

function updateResults() {
    if (!appState.selectedCustomerId) {
        elements.noDataMessage.style.display = 'block';
        elements.resultsSection.querySelector('.summary-cards').style.display = 'none';
        elements.resultsSection.querySelector('.monthly-summary').style.display = 'none';
        elements.resultsSection.querySelector('.transaction-details').style.display = 'none';
        return;
    }

    const filteredTransactions = filterTransactions(
        appState.transactions,
        appState.selectedCustomerId,
        appState.selectedMonth,
        appState.selectedYear
    );

    if (filteredTransactions.length === 0) {
        elements.noDataMessage.style.display = 'block';
        elements.resultsSection.querySelector('.summary-cards').style.display = 'none';
        elements.resultsSection.querySelector('.monthly-summary').style.display = 'none';
        elements.resultsSection.querySelector('.transaction-details').style.display = 'none';
        return;
    }

    elements.noDataMessage.style.display = 'none';
    elements.resultsSection.querySelector('.summary-cards').style.display = 'block';
    elements.resultsSection.querySelector('.monthly-summary').style.display = 'block';
    elements.resultsSection.querySelector('.transaction-details').style.display = 'block';

    const totalPoints = filteredTransactions.reduce((total, transaction) => {
        return total + calculateRewardPoints(transaction.amount);
    }, 0);

    elements.totalPoints.textContent = totalPoints.toLocaleString();

    const monthlyData = getMonthlyBreakdown(filteredTransactions);
    updateMonthlyDisplay(monthlyData, appState);

    logger.info('Results updated', { 
        totalTransactions: filteredTransactions.length,
        totalPoints,
        monthlyBreakdowns: Object.keys(monthlyData).length
    });
}


async function initializeApp() {
    logger.info('Initializing application');
    
    showLoading();
    
    try {
        appState.transactions = await fetchTransactionData();
        populateCustomerDropdown();
        updateResults();
        showResults();
        logger.info('Application initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize application', error);
        showError('Failed to load transaction data. Please try again.');
    }
}

function handleFilterChange() {
    appState.selectedCustomerId = elements.customerSelect.value;
    appState.selectedMonth = elements.monthFilter.value;
    appState.selectedYear = elements.yearFilter.value;
    appState.currentTransactionPage = 1;
    appState.selectedMonthForDetails = null;
    
    logger.info('Filters changed', {
        customerId: appState.selectedCustomerId,
        month: appState.selectedMonth,
        year: appState.selectedYear
    });
    
    updateResults();
}

elements.applyFilters.addEventListener('click', handleFilterChange);
elements.retryBtn.addEventListener('click', initializeApp);

elements.customerSelect.addEventListener('change', handleFilterChange);

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    runTests(); 
});