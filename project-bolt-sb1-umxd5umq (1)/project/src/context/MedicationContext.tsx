import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MedicationState, Medication, Category } from '../types';
import { useAuth } from './AuthContext';

// Initial medication state
const initialState: MedicationState = {
  medications: [],
  categories: [],
  isLoading: false,
  error: null,
};

// Mock data for demo purposes
const mockCategories: Category[] = [
  { id: '1', name: 'Personal', color: '#4F46E5', userId: '1' },
  { id: '2', name: 'Family', color: '#0D9488', userId: '1' },
  { id: '3', name: 'Children', color: '#F59E0B', userId: '1' },
];

const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Aspirin',
    dose: '100mg',
    frequency: 2,
    startDate: '2023-05-01',
    endDate: '2023-12-31',
    categoryId: '1',
    userId: '1',
    timeSlots: ['08:00', '20:00'],
  },
  {
    id: '2',
    name: 'Vitamin D',
    dose: '1000 IU',
    frequency: 1,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    categoryId: '1',
    userId: '1',
    timeSlots: ['09:00'],
  },
  {
    id: '3',
    name: 'Amoxicillin',
    dose: '500mg',
    frequency: 3,
    startDate: '2023-05-15',
    endDate: '2023-05-25',
    categoryId: '2',
    userId: '1',
    timeSlots: ['08:00', '14:00', '20:00'],
  },
];

type MedicationAction =
  | { type: 'FETCH_REQUEST' }
  | { type: 'FETCH_MEDICATIONS_SUCCESS'; payload: Medication[] }
  | { type: 'FETCH_CATEGORIES_SUCCESS'; payload: Category[] }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'ADD_MEDICATION'; payload: Medication }
  | { type: 'UPDATE_MEDICATION'; payload: Medication }
  | { type: 'DELETE_MEDICATION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string };

// Medication reducer
const medicationReducer = (state: MedicationState, action: MedicationAction): MedicationState => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_MEDICATIONS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        medications: action.payload,
        error: null,
      };
    case 'FETCH_CATEGORIES_SUCCESS':
      return {
        ...state,
        isLoading: false,
        categories: action.payload,
        error: null,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'ADD_MEDICATION':
      return {
        ...state,
        medications: [...state.medications, action.payload],
      };
    case 'UPDATE_MEDICATION':
      return {
        ...state,
        medications: state.medications.map((med) =>
          med.id === action.payload.id ? action.payload : med
        ),
      };
    case 'DELETE_MEDICATION':
      return {
        ...state,
        medications: state.medications.filter((med) => med.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
      };
    default:
      return state;
  }
};

// Create medication context
interface MedicationContextType extends MedicationState {
  fetchMedications: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addMedication: (medication: Omit<Medication, 'id' | 'userId'>) => Promise<void>;
  updateMedication: (medication: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'userId'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

// Medication provider component
export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(medicationReducer, initialState);
  const { user } = useAuth();

  // Fetch medications from storage or API
  const fetchMedications = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    
    try {
      // In a real app, fetch from API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, use mock data
      const medications = mockMedications.filter(med => user && med.userId === user.id);
      dispatch({ type: 'FETCH_MEDICATIONS_SUCCESS', payload: medications });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to fetch medications' 
      });
    }
  };

  // Fetch categories from storage or API
  const fetchCategories = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    
    try {
      // In a real app, fetch from API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, use mock data
      const categories = mockCategories.filter(cat => user && cat.userId === user.id);
      dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: categories });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to fetch categories' 
      });
    }
  };

  // Add new medication
  const addMedication = async (medicationData: Omit<Medication, 'id' | 'userId'>) => {
    try {
      // In a real app, save to API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMedication: Medication = {
        ...medicationData,
        id: Date.now().toString(),
        userId: user?.id || '',
      };
      
      dispatch({ type: 'ADD_MEDICATION', payload: newMedication });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to add medication' 
      });
    }
  };

  // Update medication
  const updateMedication = async (medication: Medication) => {
    try {
      // In a real app, update via API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'UPDATE_MEDICATION', payload: medication });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to update medication' 
      });
    }
  };

  // Delete medication
  const deleteMedication = async (id: string) => {
    try {
      // In a real app, delete via API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'DELETE_MEDICATION', payload: id });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to delete medication' 
      });
    }
  };

  // Add new category
  const addCategory = async (categoryData: Omit<Category, 'id' | 'userId'>) => {
    try {
      // In a real app, save to API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCategory: Category = {
        ...categoryData,
        id: Date.now().toString(),
        userId: user?.id || '',
      };
      
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to add category' 
      });
    }
  };

  // Update category
  const updateCategory = async (category: Category) => {
    try {
      // In a real app, update via API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'UPDATE_CATEGORY', payload: category });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to update category' 
      });
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    try {
      // In a real app, delete via API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to delete category' 
      });
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchMedications();
      fetchCategories();
    }
  }, [user]);

  return (
    <MedicationContext.Provider
      value={{
        ...state,
        fetchMedications,
        fetchCategories,
        addMedication,
        updateMedication,
        deleteMedication,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

// Custom hook to use medication context
export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};