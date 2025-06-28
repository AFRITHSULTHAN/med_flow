import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { PatientsProvider } from './contexts/PatientsContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { PatientsList } from './components/PatientsList';
import { AddPatient } from './components/AddPatient';
import { EditPatient } from './components/EditPatient';
import { theme } from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <PatientsProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/patients" element={<PatientsList />} />
                        <Route path="/patients/add" element={<AddPatient />} />
                        <Route path="/patients/edit/:id" element={<EditPatient />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </PatientsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;