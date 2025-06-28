import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Paper,
  Fab,
  Stack,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  Edit,
  Delete,
  Person,
  Add,
  Clear,
  PersonAdd,
  MoreVert,
  Visibility,
  FileDownload,
  FileUpload,
} from '@mui/icons-material';
import { usePatients } from '../contexts/PatientsContext';
import { exportToExcel } from '../utils/excelExport';
import { ExcelImport } from './ExcelImport';
import { Patient } from '../types';

export const PatientsList: React.FC = () => {
  const navigate = useNavigate();
  const {
    filteredPatients,
    searchQuery,
    genderFilter,
    setSearchQuery,
    setGenderFilter,
    deletePatient,
    addPatient,
  } = usePatients();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const handleDeleteClick = (patientId: string) => {
    setPatientToDelete(patientId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (patientToDelete) {
      await deletePatient(patientToDelete);
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setGenderFilter('all');
  };

  const handleImportPatients = (importedPatients: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[]) => {
    console.log('PatientsList: Importing patients:', importedPatients);
    importedPatients.forEach(patient => {
      console.log('Adding patient:', patient);
      addPatient(patient);
    });
  };

  const hasActiveFilters = searchQuery !== '' || genderFilter !== 'all';

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Patient Records
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Manage and view all patient records
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip 
                icon={<Person />} 
                label={`${filteredPatients.length} Patients`} 
                color="primary" 
                variant="outlined"
              />
              {hasActiveFilters && (
                <Chip 
                  icon={<FilterList />} 
                  label="Filtered" 
                  color="secondary" 
                  variant="outlined"
                  size="small"
                />
              )}
            </Stack>
          </Box>
          <Stack direction="row" spacing={2}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                startIcon={<FileUpload />}
                onClick={() => setImportDialogOpen(true)}
                size="large"
                color="info"
              >
                Import from Excel
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={() => exportToExcel(filteredPatients, 'medflow-patients-filtered')}
                size="large"
                color="success"
              >
                Export to Excel
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/patients/add')}
                size="large"
              >
                Add Patient
              </Button>
            </motion.div>
          </Stack>
        </Box>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Search & Filter
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by patient name or diagnosis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Gender Filter</InputLabel>
                <Select
                  value={genderFilter}
                  label="Gender Filter"
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <MenuItem value="all">All Genders</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1}>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<Clear />}
                      onClick={clearFilters}
                      fullWidth
                    >
                      Clear
                    </Button>
                  </motion.div>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Patients Grid */}
      <AnimatePresence>
        {filteredPatients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          >
            <Paper 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <PersonAdd sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              </motion.div>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {hasActiveFilters ? 'No patients match your search' : 'No patients yet'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {hasActiveFilters 
                  ? 'Try adjusting your search terms or filters'
                  : 'Get started by adding your first patient record'
                }
              </Typography>
              {!hasActiveFilters && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/patients/add')}
                    size="large"
                  >
                    Add First Patient
                  </Button>
                </motion.div>
              )}
            </Paper>
          </motion.div>
        ) : (
          <Grid container spacing={3}>
            {filteredPatients.map((patient, index) => (
              <Grid item xs={12} sm={6} lg={4} key={patient.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  layout
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                      },
                    }}
                    onClick={() => navigate(`/patients/edit/${patient.id}`)}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                          <Avatar 
                            sx={{ 
                              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                              mr: 2,
                              width: 56,
                              height: 56,
                              fontSize: '1.5rem',
                              fontWeight: 600,
                              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                            }}
                          >
                            {patient.name.charAt(0)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
                              {patient.name}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Chip
                                label={`${patient.age} years`}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={patient.gender}
                                size="small"
                                color={
                                  patient.gender === 'Male' ? 'primary' : 
                                  patient.gender === 'Female' ? 'secondary' : 'default'
                                }
                              />
                            </Stack>
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom fontWeight={600}>
                          Diagnosis
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                          {patient.diagnosis.length > 80 
                            ? `${patient.diagnosis.substring(0, 80)}...`
                            : patient.diagnosis
                          }
                        </Typography>

                        <Typography variant="subtitle2" color="primary" gutterBottom fontWeight={600}>
                          Prescription
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {patient.prescription.length > 80 
                            ? `${patient.prescription.substring(0, 80)}...`
                            : patient.prescription
                          }
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 'auto', pt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Last updated: {new Date(patient.updatedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/patients/edit/${patient.id}`);
                          }}
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            },
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(patient.id);
                          }}
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </motion.div>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Fab
          color="primary"
          aria-label="add patient"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 12px 32px rgba(37, 99, 235, 0.6)',
            },
          }}
          onClick={() => navigate('/patients/add')}
        >
          <Add />
        </Fab>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Patient Record</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this patient record? This action cannot be undone and will permanently remove all associated data.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete Record
          </Button>
        </DialogActions>
      </Dialog>

      <ExcelImport
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImportPatients}
      />
    </Box>
  );
};