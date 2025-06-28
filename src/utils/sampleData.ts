import { Patient } from '../types';

export const samplePatients: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[] = [
  {
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    diagnosis: 'Hypertension',
    prescription: 'Lisinopril 10mg daily'
  },
  {
    name: 'Sarah Johnson',
    age: 32,
    gender: 'Female',
    diagnosis: 'Type 2 Diabetes',
    prescription: 'Metformin 500mg twice daily'
  },
  {
    name: 'Michael Brown',
    age: 28,
    gender: 'Male',
    diagnosis: 'Asthma',
    prescription: 'Albuterol inhaler as needed'
  },
  {
    name: 'Emily Davis',
    age: 55,
    gender: 'Female',
    diagnosis: 'Osteoarthritis',
    prescription: 'Ibuprofen 400mg three times daily'
  },
  {
    name: 'David Wilson',
    age: 41,
    gender: 'Male',
    diagnosis: 'Depression',
    prescription: 'Sertraline 50mg daily'
  }
]; 