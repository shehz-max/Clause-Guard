"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ContractStatus {
  id: string;
  filename: string;
  status: 'pending' | 'processing' | 'analyzed' | 'error';
  progress: number;
  pageCount: number | null;
  createdAt: string;
  error: string | null;
  analysis: {
    id: string;
    riskScore: number;
    riskLevel: string;
    createdAt: string;
  } | null;
}

interface UseContractStatusOptions {
  pollInterval?: number;
  maxPollingTime?: number;
  onComplete?: (status: ContractStatus) => void;
  onError?: (error: Error) => void;
}

export function useContractStatus(
  contractId: string | null,
  initialStatus?: ContractStatus,
  options: UseContractStatusOptions = {}
) {
  const {
    pollInterval = 3000,
    maxPollingTime = 120000, // 2 minutes
    onComplete,
    onError
  } = options;

  const [status, setStatus] = useState<ContractStatus | undefined>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!contractId) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/contract/status?id=${contractId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch status');
      }
      
      setStatus(data.data);
      
      // Check if analysis is complete or failed
      if (data.data.status === 'analyzed') {
        setIsComplete(true);
        onComplete?.(data.data);
      } else if (data.data.status === 'error') {
        setIsComplete(true);
        setError(new Error(data.data.error || 'Analysis failed'));
        onError?.(new Error(data.data.error || 'Analysis failed'));
      }
      
      // Check if polling time exceeded
      if (startTimeRef.current && Date.now() - startTimeRef.current > maxPollingTime) {
        setIsComplete(true);
        setError(new Error('Polling timeout exceeded'));
      }
      
    } catch (err: any) {
      setError(err);
      onError?.(err);
      console.error('Status fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [contractId, maxPollingTime, onComplete, onError]);

  const startPolling = useCallback(() => {
    if (!contractId) return;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Reset state
    setIsComplete(false);
    setError(null);
    startTimeRef.current = Date.now();
    
    // Initial fetch
    fetchStatus();
    
    // Start polling
    intervalRef.current = setInterval(fetchStatus, pollInterval);
  }, [contractId, pollInterval, fetchStatus]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount or when contractId changes
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-start polling if contractId is provided and not analyzed
  useEffect(() => {
    if (contractId && (!status || status.status !== 'analyzed')) {
      startPolling();
    }
    
    return () => stopPolling();
  }, [contractId]);

  return {
    status,
    isLoading,
    error,
    isComplete,
    refetch: fetchStatus,
    startPolling,
    stopPolling
  };
}

// Hook for fetching all contracts with status
export function useContractList() {
  const [contracts, setContracts] = useState<ContractStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchContracts = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    setIsLoading(true);
    
    try {
      // Use the dashboard's server-side fetch for initial load
      // Client-side polling is only for status updates
      const response = await fetch('/api/health');
      const health = await response.json();
      
      if (!health.healthy) {
        throw new Error('Database connection unhealthy');
      }
      
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchContracts(true);
  }, [fetchContracts]);

  return {
    contracts,
    isLoading,
    isRefreshing,
    error,
    refetch: fetchContracts,
    refresh
  };
}