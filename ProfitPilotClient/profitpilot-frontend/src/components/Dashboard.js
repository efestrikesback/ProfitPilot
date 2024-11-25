// src/components/Dashboard.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { token, logout, user } = useContext(AuthContext);
    const [risk, setRisk] = useState({});
    const [styles, setStyles] = useState({});
    const [insights, setInsights] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setError('No authentication token found. Please log in.');
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            try {
                const [riskRes, stylesRes, insightsRes] = await Promise.all([
                    axios.get('http://localhost:8080/trades/risk-assessment', { headers }),
                    axios.get('http://localhost:8080/trades/trade-styles', { headers }),
                    axios.get('http://localhost:8080/trades/personal-insights', { headers })
                ]);

                setRisk(riskRes.data);
                setStyles(stylesRes.data);
                setInsights(insightsRes.data);
                setError('');
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('Unauthorized access. Please log in again.');
                    logout();
                } else {
                    setError('Failed to fetch data. Please try again.');
                }
                console.error(err);
            }
        };

        fetchData();
    }, [token, logout]);

    return (
        <div style={styles.container}>
            <h2>Dashboard</h2>
            <p>Welcome, {user?.firstname} {user?.lastname}!</p>
            <button onClick={logout} style={styles.logoutButton}>Logout</button>

            {error && <p style={styles.error}>{error}</p>}

            <h3>Risk Assessment</h3>
            <pre>{JSON.stringify(risk, null, 2)}</pre>

            <h3>Trade Styles</h3>
            <pre>{JSON.stringify(styles, null, 2)}</pre>

            <h3>Personal Insights</h3>
            <pre>{JSON.stringify(insights, null, 2)}</pre>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: 'auto',
        padding: '20px',
        textAlign: 'center',
        marginTop: '20px'
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        float: 'right'
    },
    error: {
        color: 'red',
        fontSize: '1em',
        marginBottom: '10px'
    }
};

export default Dashboard;
