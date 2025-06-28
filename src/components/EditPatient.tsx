import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Alert, Breadcrumbs, Link, Stack, Chip } from '@mui/material';
import { ArrowBack, Home, Edit, Person } from '@mui/icons-material';
import { PatientForm } from './PatientForm';
import { usePatients } from '../contexts/PatientsContext';
import { Patient } from '../types';

export const EditPatient: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getPatient, updatePatient } = usePatients();

  const patient = id ? getPatient(id) : undefined;

  const handleSave = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!id) return;
    
    try {
      await updatePatient(id, patientData);
      navigate('/patients');
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleCancel = () => {
    navigate('/patients');
  };

  if (!patient) {
    return (
      <Box>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/patients')}
            variant="outlined"
            sx={{ mb: 3 }}
            size="large"
          >
            Back to Patients
          </Button>
          <Alert 
            severity="error"
            sx={{ 
              borderRadius: 3,
              '& .MuiAlert-message': { fontSize: '1rem' }
            }}
          >
            <Typography variant="h6" gutterBottom>Patient Not Found</Typography>
            The patient record you're looking for doesn\'t exist. It may have been deleted or the ID is invalid.
          </Alert>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link 
              color="inherit" 
              href="#" 
              onClick={() => navigate('/dashboard')}
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Home sx={{ mr: 0.5, fontSize: 20 }} />
              Dashboard
            </Link>
            <Link 
              color="inherit" 
              href="#" 
              onClick={() => navigate('/patients')}
              sx={{ textDecoration: 'none' }}
            >
              Patients
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              <Edit sx={{ mr: 0.5, fontSize: 20 }} />
              Edit Patient
            </Typography>
          </Breadcrumbs>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/patients')}
                variant="outlined"
                size="large"
              >
                Back to Patients
              </Button>
            </motion.div>
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Edit Patient Record
            </Typography>
            <Chip 
              icon={<Person />} 
              label={patient.name} 
              color="primary" 
              variant="outlined"
            />
          </Box>
          <Typography variant="body1" color="text.secondary">
            Update patient information and medical records for <strong>{patient.name}</strong>
          </Typography>
        </Box>
      </motion.div>

      <PatientForm patient={patient} onSave={handleSave} onCancel={handleCancel} />
    </Box>
  );
};