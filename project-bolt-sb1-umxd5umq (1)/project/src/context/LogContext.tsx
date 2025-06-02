import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { LogState, DoseLog } from '../types';
import { useAuth } from './AuthContext';

// Initial log state
const initialState: LogState = {
  logs: [],
  isLoading: false,
  error: null,
};

// Mock data for demo purposes
const mockLogs: DoseLog[] = [
  {
    id: '1',
    medicationId: '1',
    timestamp: '2023-05-20T08:05:00Z',
    scheduled: '2023-05-20T08:00:00Z',
    status: 'taken',
    userId: '1',
  },
  {
    id: '2',
    medicationId: '1',
    timestamp: '2023-05-20T20:15:00Z',
    scheduled: '2023-05-20T20:00:00Z',
    status: 'late',
    userId: '1',
  },
  {
    id: '3',
    medicationId: '2',
    timestamp: '',
    scheduled: '2023-05-19T09:00:00Z',
    status: 'missed',
    userId: '1',
  },
  {
    id: '4',
    medicationId: '2',
    timestamp: '2023-05-20T09:00:00Z',
    scheduled: '2023-05-20T09:00:00Z',
    status: 'taken',
    userId: '1',
  },
  {
    id: '5',
    medicationId: '3',
    timestamp: '2023-05-20T08:00:00Z',
    scheduled: '2023-05-20T08:00:00Z',
    status: 'taken',
    userId: '1',
  },
  {
    id: '6',
    medicationId: '3',
    timestamp: '2023-05-20T14:05:00Z',
    scheduled: '2023-05-20T14:00:00Z',
    status: 'taken',
    userId: '1',
  },
];

type LogAction =
  | { type: 'FETCH_REQUEST' }
  | { type: 'FETCH_LOGS_SUCCESS'; payload: DoseLog[] }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'ADD_LOG'; payload: DoseLog }
  | { type: 'UPDATE_LOG'; payload: DoseLog }
  | { type: 'DELETE_LOG'; payload: string };

// Log reducer
const logReducer = (state: LogState, action: LogAction): LogState => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_LOGS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        logs: action.payload,
        error: null,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'ADD_LOG':
      return {
        ...state,
        logs: [...state.logs, action.payload],
      };
    case 'UPDATE_LOG':
      return {
        ...state,
        logs: state.logs.map((log) =>
          log.id === action.payload.id ? action.payload : log
        ),
      };
    case 'DELETE_LOG':
      return {
        ...state,
        logs: state.logs.filter((log) => log.id !== action.payload),
      };
    default:
      return state;
  }
};

// Create log context
interface LogContextType extends LogState {
  fetchLogs: () => Promise<void>;
  addLog: (log: Omit<DoseLog, 'id' | 'userId'>) => Promise<void>;
  updateLog: (log: DoseLog) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  getLogsByMedicationId: (medicationId: string) => DoseLog[];
  getRecentLogs: (days?: number) => DoseLog[];
}

const LogContext = createContext<LogContextType | undefined>(undefined);

// Log provider component
export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(logReducer, initialState);
  const { user } = useAuth();

  // Fetch logs from storage or API
  const fetchLogs = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    
    try {
      // In a real app, fetch from API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, use mock data
      const logs = mockLogs.filter(log => user && log.userId === user.id);
      dispatch({ type: 'FETCH_LOGS_SUCCESS', payload: logs });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to fetch logs' 
      });
    }
  };

  // Add new log
  const addLog = async (logData: Omit<DoseLog, 'id' | 'userId'>) => {
    try {
      // In a real app, save to API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newLog: DoseLog = {
        ...logData,
        id: Date.now().toString(),
        userId: user?.id || '',
      };
      
      dispatch({ type: 'ADD_LOG', payload: newLog });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to add log' 
      });
    }
  };

  // Update log
  const updateLog = async (log: DoseLog) => {
    try {
      // In a real app, update via API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'UPDATE_LOG', payload: log });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to update log' 
      });
    }
  };

  // Delete log
  const deleteLog = async (id: string) => {
    try {
      // In a real app, delete via API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'DELETE_LOG', payload: id });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to delete log' 
      });
    }
  };

  // Helper to get logs by medication ID
  const getLogsByMedicationId = (medicationId: string) => {
    return state.logs.filter(log => log.medicationId === medicationId);
  };

  // Helper to get recent logs
  const getRecentLogs = (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return state.logs.filter(log => {
      if (!log.scheduled) return false;
      const logDate = new Date(log.scheduled);
      return logDate >= cutoffDate;
    });
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  return (
    <LogContext.Provider
      value={{
        ...state,
        fetchLogs,
        addLog,
        updateLog,
        deleteLog,
        getLogsByMedicationId,
        getRecentLogs,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};

// Custom hook to use log context
export const useLog = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return context;
};