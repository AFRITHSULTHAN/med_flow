import * as XLSX from 'xlsx';
import { Patient } from '../types';

export interface ExcelPatientData {
  'Patient ID'?: string;
  'Name': string;
  'Age': number;
  'Gender': 'Male' | 'Female' | 'Other';
  'Diagnosis': string;
  'Prescription': string;
  'Created Date'?: string;
  'Last Updated'?: string;
}

export const importFromExcel = (file: File): Promise<Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelPatientData[];
        
        // Transform the data to match our Patient interface
        const patients = jsonData.map(row => ({
          name: row.Name || '',
          age: Number(row.Age) || 0,
          gender: row.Gender || 'Other',
          diagnosis: row.Diagnosis || '',
          prescription: row.Prescription || ''
        })).filter(patient => 
          patient.name.trim() !== '' && 
          patient.age > 0 && 
          patient.diagnosis.trim() !== ''
        );
        
        resolve(patients);
      } catch (error) {
        reject(new Error('Failed to parse Excel file. Please check the file format.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const validateExcelFile = (file: File): boolean => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv' // .csv
  ];
  
  return allowedTypes.includes(file.type);
}; 