// frontend/src/App.tsx
/**
 * Main Application Router
 * 
 * Defines all routes for the application:
 * - / : Home/Demo page showing Hosted UI integration
 * - /callback : OAuth callback handler
 * - /dashboard : Main dashboard (protected)
 * - /login : Custom login component
 * - /signup : Custom signup component
 * - /upload : Homework upload (protected)
 * - /grades : View grades (protected)
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Callback from './components/Callback/Callback';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/SignUp/Signup';
import UploadHomework from './components/UploadHomework';
import ViewGrades from './components/ViewGrades';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes - require authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadHomework />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grades"
          element={
            <ProtectedRoute>
              <ViewGrades />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;