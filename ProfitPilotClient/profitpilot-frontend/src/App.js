import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

function App() {
    const { token } = useContext(AuthContext);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
