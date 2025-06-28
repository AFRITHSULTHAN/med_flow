import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  Divider,
} from '@mui/material';
import {
  Person,
  Cake,
  Wc,
  LocalHospital,
  Medication,
  Save,
  Cancel,
  Badge,
} from '@mui/icons-material';
import { Patient } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface PatientFormProps {
  patient?: Patient;
  onSave: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ patient, onSave, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male' as const,
    diagnosis: '',
    prescription: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        age: patient.age.toString(),
        gender: patient.gender,
        diagnosis: patient.diagnosis,
        prescription: patient.prescription
      });
    }
  }, [patient]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Patient name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Patient name must be at least 2 characters';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0 || Number(formData.age) > 150) {
      newErrors.age = 'Age must be a number between 1 and 150';
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Diagnosis is required';
    } else if (formData.diagnosis.trim().length < 5) {
      newErrors.diagnosis = 'Diagnosis must be at least 5 characters';
    }

    if (!formData.prescription.trim()) {
      newErrors.prescription = 'Prescription is required';
    } else if (formData.prescription.trim().length < 5) {
      newErrors.prescription = 'Prescription must be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setIsSubmitting(true);
    try {
      await onSave({
        name: formData.name.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        diagnosis: formData.diagnosis.trim(),
        prescription: formData.prescription.trim(),
        createdBy: user.id
      });
    } catch (error) {
      console.error('Error saving patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Paper 
        sx={{ 
          p: 4, 
          maxWidth: 900, 
          mx: 'auto',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {patient ? 'Edit Patient Information' : 'Add New Patient'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {patient ? 'Update patient details and medical information' : 'Enter comprehensive patient details and medical information'}
            </Typography>
          </Box>
        </motion.div>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Basic Information Card */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card 
                  variant="outlined"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Badge sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        Basic Information
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <motion.div
                          whileFocus={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TextField
                            fullWidth
                            label="Patient Name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name || 'Enter the full name of the patient'}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Person color="action" />
                                </InputAdornment>
                              ),
                            }}
                            required
                          />
                        </motion.div>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <motion.div
                          whileFocus={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TextField
                            fullWidth
                            label="Age"
                            type="number"
                            value={formData.age}
                            onChange={(e) => handleChange('age', e.target.value)}
                            error={!!errors.age}
                            helperText={errors.age || 'Patient age in years'}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Cake color="action" />
                                </InputAdornment>
                              ),
                              inputProps: { min: 1, max: 150 }
                            }}
                            required
                          />
                        </motion.div>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            value={formData.gender}
                            label="Gender"
                            onChange={(e) => handleChange('gender', e.target.value)}
                            startAdornment={
                              <InputAdornment position="start">
                                <Wc color="action" />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Medical Information Card */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card 
                  variant="outlined"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <LocalHospital sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        Medical Information
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <motion.div
                          whileFocus={{ scale: 1.005 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TextField
                            fullWidth
                            label="Diagnosis"
                            multiline
                            rows={4}
                            value={formData.diagnosis}
                            onChange={(e) => handleChange('diagnosis', e.target.value)}
                            error={!!errors.diagnosis}
                            helperText={errors.diagnosis || 'Provide a detailed diagnosis including symptoms, conditions, and medical findings'}
                            placeholder="Enter comprehensive diagnosis information including symptoms, test results, and medical observations..."
                            required
                          />
                        </motion.div>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <motion.div
                          whileFocus={{ scale: 1.005 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TextField
                            fullWidth
                            label="Prescription & Treatment Notes"
                            multiline
                            rows={5}
                            value={formData.prescription}
                            onChange={(e) => handleChange('prescription', e.target.value)}
                            error={!!errors.prescription}
                            helperText={errors.prescription || 'Include detailed prescription information, dosages, treatment plans, and follow-up instructions'}
                            placeholder="Enter detailed prescription information including:&#10;• Medications and dosages&#10;• Treatment instructions&#10;• Follow-up care&#10;• Special considerations..."
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                  <Medication color="action" />
                                </InputAdornment>
                              ),
                            }}
                            required
                          />
                        </motion.div>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Form Actions */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Divider sx={{ my: 3 }} />
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outlined"
                      onClick={onCancel}
                      startIcon={<Cancel />}
                      disabled={isSubmitting}
                      size="large"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={isSubmitting}
                      size="large"
                      sx={{ minWidth: 160 }}
                    >
                      {isSubmitting ? 'Saving...' : (patient ? 'Update Patient' : 'Add Patient')}
                    </Button>
                  </motion.div>
                </Stack>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
};