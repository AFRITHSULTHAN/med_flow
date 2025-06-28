import { Patient } from '../types';

const PATIENTS_KEY = 'medflow_patients';

export const patientsService = {
  getPatients(userId: string): Patient[] {
    const patientsStr = localStorage.getItem(PATIENTS_KEY);
    const allPatients: Patient[] = patientsStr ? JSON.parse(patientsStr) : [];
    return allPatients.filter(p => p.createdBy === userId);
  },

  addPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Patient {
    const allPatients = this.getAllPatients();
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId
    };

    allPatients.push(newPatient);
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(allPatients));
    return newPatient;
  },

  updatePatient(id: string, updates: Partial<Patient>): Patient | null {
    const allPatients = this.getAllPatients();
    const index = allPatients.findIndex(p => p.id === id);
    
    if (index === -1) return null;

    allPatients[index] = {
      ...allPatients[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(PATIENTS_KEY, JSON.stringify(allPatients));
    return allPatients[index];
  },

  deletePatient(id: string): boolean {
    const allPatients = this.getAllPatients();
    const filteredPatients = allPatients.filter(p => p.id !== id);
    
    if (filteredPatients.length === allPatients.length) return false;

    localStorage.setItem(PATIENTS_KEY, JSON.stringify(filteredPatients));
    return true;
  },

  getAllPatients(): Patient[] {
    const patientsStr = localStorage.getItem(PATIENTS_KEY);
    return patientsStr ? JSON.parse(patientsStr) : [];
  }
};