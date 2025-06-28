import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CloudUpload,
  FileUpload,
  CheckCircle,
  Error,
  Warning,
  Download,
} from '@mui/icons-material';
import { importFromExcel, validateExcelFile } from '../utils/excelImport';
import { downloadExcelTemplate } from '../utils/excelTemplate';
import { Patient } from '../types';

interface ExcelImportProps {
  onImport: (patients: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[]) => void;
  open: boolean;
  onClose: () => void;
}

export const ExcelImport: React.FC<ExcelImportProps> = ({ onImport, open, onClose }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsLoading(true);

    try {
      if (!validateExcelFile(file)) {
        throw new Error('Please select a valid Excel file (.xlsx, .xls) or CSV file.');
      }

      const patients = await importFromExcel(file);
      
      if (patients.length === 0) {
        throw new Error('No valid patient data found in the file. Please check the format.');
      }

      setPreviewData(patients);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleConfirmImport = () => {
    console.log('Importing patients:', previewData);
    onImport(previewData);
    setPreviewData([]);
    setShowPreview(false);
    onClose();
  };

  const handleCancel = () => {
    setPreviewData([]);
    setShowPreview(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Import Patients from Excel
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload an Excel file to import patient records
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {!showPreview ? (
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: isDragOver ? '2px dashed #2563eb' : '2px dashed #e5e7eb',
                  backgroundColor: isDragOver ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />
                
                {isLoading ? (
                  <Box sx={{ py: 4 }}>
                    <CircularProgress size={48} sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Processing Excel file...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Please wait while we extract patient data
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ py: 4 }}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                    </motion.div>
                    
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Drop Excel file here
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      or click to browse files
                    </Typography>
                    
                    <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                      <Chip label=".xlsx" size="small" />
                      <Chip label=".xls" size="small" />
                      <Chip label=".csv" size="small" />
                    </Stack>
                  </Box>
                )}
              </Paper>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Expected Excel Format:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Your Excel file should have the following columns:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                <Chip label="Name" size="small" color="primary" />
                <Chip label="Age" size="small" color="primary" />
                <Chip label="Gender" size="small" color="primary" />
                <Chip label="Diagnosis" size="small" color="primary" />
                <Chip label="Prescription" size="small" color="primary" />
              </Stack>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={downloadExcelTemplate}
                  size="small"
                  color="primary"
                >
                  Download Template
                </Button>
              </motion.div>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Preview ({previewData.length} patients found)
            </Typography>
            
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {previewData.slice(0, 10).map((patient, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={patient.name}
                      secondary={`${patient.age} years old | ${patient.gender} | ${patient.diagnosis}`}
                    />
                    <CheckCircle color="success" />
                  </ListItem>
                  {index < Math.min(9, previewData.length - 1) && <Divider />}
                </React.Fragment>
              ))}
              {previewData.length > 10 && (
                <ListItem>
                  <ListItemText
                    primary={`... and ${previewData.length - 10} more patients`}
                    color="text.secondary"
                  />
                </ListItem>
              )}
            </List>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        {showPreview && (
          <Button
            onClick={handleConfirmImport}
            variant="contained"
            startIcon={<FileUpload />}
            size="large"
          >
            Import {previewData.length} Patients
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}; 