import React, { createContext, useContext, useEffect, useState } from 'react';
import { Patient } from '../types';
import { patientsService } from '../services/patients';
import { useAuth } from './AuthContext';

interface PatientsContextType {
  patients: Patient[];
  loading: boolean;
  searchQuery: string;
  genderFilter: string;
  filteredPatients: Patient[];
  setSearchQuery: (query: string) => void;
  setGenderFilter: (filter: string) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePatient: (id: string, patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  getPatient: (id: string) => Patient | undefined;
  refreshPatients: () => void;
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientsProvider');
  }
  return context;
};

export const PatientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');

  const loadPatients = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userPatients = patientsService.getPatients(user.id);
      setPatients(userPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [user]);

  const filteredPatients = React.useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = searchQuery === '' || 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGender = genderFilter === 'all' || patient.gender === genderFilter;
      
      return matchesSearch && matchesGender;
    });
  }, [patients, searchQuery, genderFilter]);

  const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    try {
      const newPatient = patientsService.addPatient(patientData, user.id);
      // Update the patients state immediately with the new patient
      setPatients(prevPatients => [...prevPatients, newPatient]);
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  };

  const updatePatient = async (id: string, patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      patientsService.updatePatient(id, patientData);
      await loadPatients();
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  };

  const deletePatient = async (id: string) => {
    try {
      patientsService.deletePatient(id);
      await loadPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  };

  const getPatient = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  const refreshPatients = () => {
    loadPatients();
  };

  const value: PatientsContextType = {
    patients,
    loading,
    searchQuery,
    genderFilter,
    filteredPatients,
    setSearchQuery,
    setGenderFilter,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    refreshPatients
  };

  return (
    <PatientsContext.Provider value={value}>
      {children}
    </PatientsContext.Provider>
  );
};