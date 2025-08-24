import { logger } from '../utils/logger.js';

export const elements = {
    loadingState: document.getElementById('loadingState'),
    errorState: document.getElementById('errorState'),
    resultsSection: document.getElementById('resultsSection'),
    noDataMessage: document.getElementById('noDataMessage'),
    customerSelect: document.getElementById('customerSelect'),
    monthFilter: document.getElementById('monthFilter'),
    yearFilter: document.getElementById('yearFilter'),
    applyFilters: document.getElementById('applyFilters'),
    retryBtn: document.getElementById('retryBtn'),
    totalPoints: document.getElementById('totalPoints'),
    monthlySummary: document.getElementById('monthlySummary'),
    transactionTable: document.getElementById('transactionTable'),
    paginationContainer: document.getElementById('paginationContainer')
};

export function showLoading() {
    elements.loadingState.style.display = 'block';
    elements.errorState.style.display = 'none';
    elements.resultsSection.style.display = 'none';
    logger.info('Showing loading state');
}

export function hideLoading() {
    elements.loadingState.style.display = 'none';
    logger.info('Hiding loading state');
}

export function showError(message) {
    elements.errorState.style.display = 'block';
    elements.errorState.querySelector('.error-message').textContent = message;
    elements.resultsSection.style.display = 'none';
    hideLoading();
    logger.error('Showing error state', { message });
}

export function showResults() {
    elements.errorState.style.display = 'none';
    elements.resultsSection.style.display = 'block';
    hideLoading();
    logger.info('Showing results section');
}

export function updatePagination(pagination, allTransactions, callback) {
    if (pagination.totalPages <= 1) {
        elements.paginationContainer.innerHTML = '';
        return;
    }

    const paginationHtml = `
        <button class="pagination-btn" ${!pagination.hasPreviousPage ? 'disabled' : ''} data-page="prev">
            Previous
        </button>
        <span class="pagination-info">
            Page ${pagination.currentPage} of ${pagination.totalPages} 
            (${pagination.startIndex}-${pagination.endIndex} of ${pagination.totalItems})
        </span>
        <button class="pagination-btn" ${!pagination.hasNextPage ? 'disabled' : ''} data-page="next">
            Next
        </button>
    `;

    elements.paginationContainer.innerHTML = paginationHtml;

    elements.paginationContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('pagination-btn') && !e.target.disabled) {
            const action = e.target.dataset.page;
            
            if (action === 'prev' && pagination.hasPreviousPage) {
                callback('prev', allTransactions);
            } else if (action === 'next' && pagination.hasNextPage) {
                callback('next', allTransactions);
            }
            
            logger.info('Pagination navigation', { action });
        }
    });
}