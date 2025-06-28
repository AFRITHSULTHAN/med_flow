import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import {
  People,
  PersonAdd,
  TrendingUp,
  AccessTime,
  Person,
  Add,
  ArrowForward,
  BarChart,
  FileDownload,
  FileUpload,
} from '@mui/icons-material';
import { usePatients } from '../contexts/PatientsContext';
import { exportToExcel } from '../utils/excelExport';
import { ExcelImport } from './ExcelImport';
import { Patient } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { patients, filteredPatients, addPatient } = usePatients();
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const recentPatients = patients
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const genderStats = {
    male: patients.filter(p => p.gender === 'Male').length,
    female: patients.filter(p => p.gender === 'Female').length,
    other: patients.filter(p => p.gender === 'Other').length,
  };

  const handleImportPatients = (importedPatients: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[]) => {
    console.log('Dashboard: Importing patients:', importedPatients);
    importedPatients.forEach(patient => {
      console.log('Adding patient:', patient);
      addPatient(patient);
    });
  };

  const StatCard = ({ title, value, icon, color, subtitle, index }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card 
        sx={{ 
          height: '100%',
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
            background: `linear-gradient(90deg, ${theme => theme.palette[color]?.main || '#2563eb'} 0%, ${theme => theme.palette[color]?.light || '#60a5fa'} 100%)`,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mb: 0.5 }}>
                {value}
              </Typography>
              <Typography color="text.secondary" variant="body1" fontWeight={500}>
                {title}
              </Typography>
            </Box>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: `${color}.main`, 
                  width: 56,
                  height: 56,
                  background: `linear-gradient(135deg, ${theme => theme.palette[color]?.main || '#2563eb'} 0%, ${theme => theme.palette[color]?.dark || '#1d4ed8'} 100%)`,
                  boxShadow: `0 8px 24px ${theme => theme.palette[color]?.main || '#2563eb'}40`,
                }}
              >
                {icon}
              </Avatar>
            </motion.div>
          </Box>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

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
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Overview of your patient records and recent activity
            </Typography>
            <Chip 
              icon={<BarChart />} 
              label={`${patients.length} Total Records`} 
              color="primary" 
              variant="outlined"
            />
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
                onClick={() => exportToExcel(patients, 'medflow-patients')}
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
                variant="outlined"
                startIcon={<People />}
                onClick={() => navigate('/patients')}
                size="large"
              >
                View All Patients
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

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={patients.length}
            icon={<People />}
            color="primary"
            subtitle="All registered patients"
            index={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Male Patients"
            value={genderStats.male}
            icon={<Person />}
            color="info"
            subtitle={`${((genderStats.male / patients.length) * 100 || 0).toFixed(1)}% of total`}
            index={1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Female Patients"
            value={genderStats.female}
            icon={<Person />}
            color="secondary"
            subtitle={`${((genderStats.female / patients.length) * 100 || 0).toFixed(1)}% of total`}
            index={2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="This Month"
            value={patients.filter(p => {
              const patientDate = new Date(p.createdAt);
              const now = new Date();
              return patientDate.getMonth() === now.getMonth() && 
                     patientDate.getFullYear() === now.getFullYear();
            }).length}
            icon={<TrendingUp />}
            color="success"
            subtitle="New patients added"
            index={3}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Paper 
              sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Recent Patients
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest patient records and updates
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/patients')}
                  size="small"
                >
                  View All
                </Button>
              </Box>
              
              {recentPatients.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <PersonAdd sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    </motion.div>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No patients yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Start by adding your first patient record
                    </Typography>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/patients/add')}
                      >
                        Add First Patient
                      </Button>
                    </motion.div>
                  </Box>
                </motion.div>
              ) : (
                <List sx={{ p: 0 }}>
                  {recentPatients.map((patient, index) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <ListItem
                        sx={{
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 3,
                          mb: 1,
                          background: 'rgba(255, 255, 255, 0.02)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            borderColor: 'rgba(37, 99, 235, 0.3)',
                            transform: 'translateX(8px)',
                          },
                        }}
                        onClick={() => navigate(`/patients/edit/${patient.id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                              width: 48,
                              height: 48,
                              fontSize: '1.2rem',
                              fontWeight: 600,
                            }}
                          >
                            {patient.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle1" fontWeight="600">
                                {patient.name}
                              </Typography>
                              <Chip
                                label={patient.gender}
                                size="small"
                                color={patient.gender === 'Male' ? 'primary' : patient.gender === 'Female' ? 'secondary' : 'default'}
                              />
                              <Chip
                                label={`${patient.age} years`}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {patient.diagnosis.length > 60 
                                  ? `${patient.diagnosis.substring(0, 60)}...`
                                  : patient.diagnosis
                                }
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Updated: {new Date(patient.updatedAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              )}
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Paper 
              sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Common tasks and shortcuts
              </Typography>
              <Stack spacing={2}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => navigate('/patients/add')}
                    fullWidth
                    size="large"
                  >
                    Add New Patient
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outlined"
                    startIcon={<People />}
                    onClick={() => navigate('/patients')}
                    fullWidth
                    size="large"
                  >
                    View All Patients
                  </Button>
                </motion.div>
              </Stack>
            </Paper>

            <Paper 
              sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Gender Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Patient demographics overview
              </Typography>
              <Stack spacing={2}>
                {[
                  { label: 'Male', value: genderStats.male, color: 'primary', percentage: ((genderStats.male / patients.length) * 100 || 0).toFixed(1) },
                  { label: 'Female', value: genderStats.female, color: 'secondary', percentage: ((genderStats.female / patients.length) * 100 || 0).toFixed(1) },
                  { label: 'Other', value: genderStats.other, color: 'default', percentage: ((genderStats.other / patients.length) * 100 || 0).toFixed(1) },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>{stat.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stat.percentage}% of total
                        </Typography>
                      </Box>
                      <Chip 
                        label={stat.value} 
                        color={stat.color as any}
                        sx={{
                          fontWeight: 600,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                      />
                    </Box>
                  </motion.div>
                ))}
              </Stack>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      <ExcelImport
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImportPatients}
      />
    </Box>
  );
};