import * as XLSX from 'xlsx';
import { Patient } from '../types';

export const exportToExcel = (patients: Patient[], filename: string = 'patients-data') => {
  // Transform patient data for Excel export
  const excelData = patients.map(patient => ({
    'Patient ID': patient.id,
    'Name': patient.name,
    'Age': patient.age,
    'Gender': patient.gender,
    'Diagnosis': patient.diagnosis,
    'Prescription': patient.prescription,
    'Created By': patient.createdBy,
    'Created Date': new Date(patient.createdAt).toLocaleDateString(),
    'Last Updated': new Date(patient.updatedAt).toLocaleDateString()
  }));

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 15 }, // Patient ID
    { wch: 20 }, // Name
    { wch: 8 },  // Age
    { wch: 10 }, // Gender
    { wch: 30 }, // Diagnosis
    { wch: 30 }, // Prescription
    { wch: 15 }, // Created By
    { wch: 15 }, // Created Date
    { wch: 15 }  // Last Updated
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Patients');

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}-${timestamp}.xlsx`;

  // Export the file
  XLSX.writeFile(workbook, fullFilename);
};

export const exportSelectedToExcel = (patients: Patient[], selectedIds: string[], filename: string = 'selected-patients') => {
  const selectedPatients = patients.filter(patient => selectedIds.includes(patient.id));
  exportToExcel(selectedPatients, filename);
}; 