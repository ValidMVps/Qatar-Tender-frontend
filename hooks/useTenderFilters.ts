// hooks/useTenderFilters.ts
import { useState, useEffect, useCallback } from 'react';

import { getTenders, getActiveCategories } from '../services/tenderApi';
import { ApiError, Category, Tender } from '@/types/ui';

// Filter state interface
export interface FilterState {
    searchTerm: string;
    selectedCategories: string[];
    selectedExperienceLevels: string[];
    selectedJobType: string;
    hourlyMin: string;
    hourlyMax: string;
    selectedFixedPriceRange: string[];
    selectedProposalCounts: string[];
    selectedClientInfo: string[];
    selectedClientHistory: string[];
    selectedClientLocation: string;
    selectedProjectLengths: string[];
}

// Pagination state interface
export interface PaginationState {
    jobsPerPage: string;
    currentPage: number;
    sortBy: 'newest' | 'oldest' | 'budget-high' | 'budget-low';
}

// Hook return type
export interface UseTenderFiltersReturn {
    // Data
    tenders: Tender[];
    categories: Category[];
    filteredTenders: Tender[];

    // Loading states
    loading: boolean;
    error: string | null;

    // Filter state
    filters: FilterState;
    pagination: PaginationState;

    // Actions
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    handleFilterChange: <K extends keyof FilterState>(
        key: K,
        value: FilterState[K] | ((prev: FilterState[K]) => FilterState[K])
    ) => void;
    handleMultiSelectFilter: (
        filterKey: keyof Pick<FilterState, 'selectedProposalCounts' | 'selectedClientInfo' | 'selectedClientHistory' | 'selectedProjectLengths' | 'selectedFixedPriceRange'>,
        value: string
    ) => void;
    handleCategoryChange: (category: string) => void;
    handleSearchChange: (value: string) => void;
    handleSortChange: (sortBy: string) => void;
    clearAllFilters: () => void;

    // Pagination helpers
    totalPages: number;
    startIndex: number;
    endIndex: number;
    tendersToDisplay: Tender[];
}

// Initial filter state
const initialFilterState: FilterState = {
    searchTerm: "",
    selectedCategories: [],
    selectedExperienceLevels: [],
    selectedJobType: "all",
    hourlyMin: "",
    hourlyMax: "",
    selectedFixedPriceRange: [],
    selectedProposalCounts: [],
    selectedClientInfo: [],
    selectedClientHistory: [],
    selectedClientLocation: "all",
    selectedProjectLengths: [],
};

// Initial pagination state
const initialPaginationState: PaginationState = {
    jobsPerPage: "10",
    currentPage: 1,
    sortBy: "newest",
};

export const useTenderFilters = (): UseTenderFiltersReturn => {
    // State
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>(initialFilterState);
    const [pagination, setPagination] = useState<PaginationState>(initialPaginationState);

    // Load initial data
    useEffect(() => {
        const loadData = async (): Promise<void> => {
            try {
                setLoading(true);
                setError(null);

                const [tendersData, categoriesData] = await Promise.all([
                    getTenders({ status: 'active' }),
                    getActiveCategories()
                ]);

                setTenders(tendersData);
                setCategories(categoriesData);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message);
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Debounced API call for filters
    const debouncedFetchTenders = useCallback(
        async (searchTerm: string, selectedCategories: string[]): Promise<void> => {
            try {
                setLoading(true);

                const apiFilters: TenderFilters = {
                    status: 'active',
                    search: searchTerm || undefined,
                    category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
                    sortBy: pagination.sortBy,
                };

                const tendersData = await getTenders(apiFilters);
                setTenders(tendersData);
                setPagination(prev => ({ ...prev, currentPage: 1 }));
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message);
                console.error('Error fetching filtered tenders:', err);
            } finally {
                setLoading(false);
            }
        },
        [pagination.sortBy]
    );

    // Effect for debounced filtering
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (filters.searchTerm || filters.selectedCategories.length > 0) {
                debouncedFetchTenders(filters.searchTerm, filters.selectedCategories);
            }
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [filters.searchTerm, filters.selectedCategories, debouncedFetchTenders]);

    // Filter handlers
    const handleFilterChange = useCallback(<K extends keyof FilterState>(
        key: K,
        value: FilterState[K] | ((prev: FilterState[K]) => FilterState[K])
    ): void => {
        setFilters(prev => ({
            ...prev,
            [key]: typeof value === 'function' ? value(prev[key]) : value
        }));
    }, []);

    const handleMultiSelectFilter = useCallback((
        filterKey: keyof Pick<FilterState, 'selectedProposalCounts' | 'selectedClientInfo' | 'selectedClientHistory' | 'selectedProjectLengths' | 'selectedFixedPriceRange'>,
        value: string
    ): void => {
        handleFilterChange(filterKey, (prev) =>
            Array.isArray(prev) && prev.includes(value)
                ? prev.filter((item) => item !== value)
                : Array.isArray(prev)
                    ? [...prev, value]
                    : [value]
        );
    }, [handleFilterChange]);

    const handleCategoryChange = useCallback((category: string): void => {
        setFilters(prev => ({
            ...prev,
            selectedCategories: prev.selectedCategories.includes(category)
                ? prev.selectedCategories.filter((c) => c !== category)
                : [...prev.selectedCategories, category]
        }));
    }, []);

    const handleSearchChange = useCallback((value: string): void => {
        setFilters(prev => ({ ...prev, searchTerm: value }));
    }, []);

    const handleSortChange = useCallback((newSortBy: string): void => {
        const sortBy = newSortBy as 'newest' | 'oldest' | 'budget-high' | 'budget-low';
        setPagination(prev => ({ ...prev, sortBy }));

        // Sort tenders locally
        const sortedTenders = [...tenders].sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'budget-high':
                    return Number(b.estimatedBudget) - Number(a.estimatedBudget);
                case 'budget-low':
                    return Number(a.estimatedBudget) - Number(b.estimatedBudget);
                case 'newest':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        setTenders(sortedTenders);
    }, [tenders]);

    const clearAllFilters = useCallback((): void => {
        setFilters(initialFilterState);
        setPagination(initialPaginationState);
    }, []);

    // Client-side filtering
    const filteredTenders = tenders.filter((tender): boolean => {
        const matchesJobType =
            filters.selectedJobType === "all" ||
            (filters.selectedJobType === "hourly" && tender.status === "active") ||
            (filters.selectedJobType === "fixed_price" && tender.status === "active");

        // Add more client-side filters as needed
        const matchesFixedPriceRange = filters.selectedFixedPriceRange.length === 0 ||
            filters.selectedFixedPriceRange.some(range => {
                // Add logic to match price ranges
                return true; // Implement based on your range definitions
            });

        const matchesClientLocation = filters.selectedClientLocation === "all" ||
            tender.location.toLowerCase().includes(filters.selectedClientLocation.toLowerCase());

        return matchesJobType && matchesFixedPriceRange && matchesClientLocation;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredTenders.length / Number.parseInt(pagination.jobsPerPage));
    const startIndex = (pagination.currentPage - 1) * Number.parseInt(pagination.jobsPerPage);
    const endIndex = startIndex + Number.parseInt(pagination.jobsPerPage);
    const tendersToDisplay = filteredTenders.slice(startIndex, endIndex);

    return {
        // Data
        tenders,
        categories,
        filteredTenders,

        // Loading states
        loading,
        error,

        // Filter state
        filters,
        pagination,

        // Actions
        setFilters,
        setPagination,
        handleFilterChange,
        handleMultiSelectFilter,
        handleCategoryChange,
        handleSearchChange,
        handleSortChange,
        clearAllFilters,

        // Pagination helpers
        totalPages,
        startIndex,
        endIndex,
        tendersToDisplay,
    };
};