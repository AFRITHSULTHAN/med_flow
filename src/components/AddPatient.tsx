import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Breadcrumbs, Link, Stack } from '@mui/material';
import { ArrowBack, Home, PersonAdd } from '@mui/icons-material';
import { PatientForm } from './PatientForm';
import { usePatients } from '../contexts/PatientsContext';
import { Patient } from '../types';

export const AddPatient: React.FC = () => {
  const navigate = useNavigate();
  const { addPatient } = usePatients();

  const handleSave = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addPatient(patientData);
      navigate('/patients');
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  const handleCancel = () => {
    navigate('/patients');
  };

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
              <PersonAdd sx={{ mr: 0.5, fontSize: 20 }} />
              Add Patient
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

          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Add New Patient
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create a comprehensive patient record with medical information and treatment details
            </Typography>
          </Box>
        </Box>
      </motion.div>

      <PatientForm onSave={handleSave} onCancel={handleCancel} />
    </Box>
  );
};