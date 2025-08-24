import { REWARD_CONSTANTS } from '../data/mock-data.js';

export function createPagination(items, currentPage = 1, itemsPerPage = REWARD_CONSTANTS.PAGINATION_SIZE) {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);
    
    return {
        items: currentItems,
        currentPage,
        totalPages,
        totalItems: items.length,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        startIndex: startIndex + 1,
        endIndex: Math.min(endIndex, items.length)
    };
}