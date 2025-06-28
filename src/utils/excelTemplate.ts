import * as XLSX from 'xlsx';

export const downloadExcelTemplate = () => {
  // Sample data for the template
  const templateData = [
    {
      'Name': 'John Smith',
      'Age': 45,
      'Gender': 'Male',
      'Diagnosis': 'Hypertension',
      'Prescription': 'Lisinopril 10mg daily'
    },
    {
      'Name': 'Sarah Johnson',
      'Age': 32,
      'Gender': 'Female',
      'Diagnosis': 'Type 2 Diabetes',
      'Prescription': 'Metformin 500mg twice daily'
    },
    {
      'Name': 'Michael Brown',
      'Age': 28,
      'Gender': 'Male',
      'Diagnosis': 'Asthma',
      'Prescription': 'Albuterol inhaler as needed'
    }
  ];

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // Set column widths
  const columnWidths = [
    { wch: 20 }, // Name
    { wch: 8 },  // Age
    { wch: 10 }, // Gender
    { wch: 30 }, // Diagnosis
    { wch: 40 }  // Prescription
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Patient Template');

  // Generate filename
  const filename = 'medflow-patient-template.xlsx';

  // Download the file
  XLSX.writeFile(workbook, filename);
}; 