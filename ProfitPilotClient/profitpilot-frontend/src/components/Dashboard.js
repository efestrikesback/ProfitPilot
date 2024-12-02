// src/components/Dashboard.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Container, Button, Alert, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { token, logout, user } = useContext(AuthContext);
  const [risk, setRisk] = useState({});
  const [stylesData, setStylesData] = useState({});
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
        setStylesData(stylesRes.data);
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
  }, [logout, user]);

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#">ProfitPilot</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/my-trades">My Trades</Nav.Link>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <h2>Dashboard</h2>
        <p>Welcome, {user?.firstname} {user?.lastname}!</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <h3>Risk Assessment</h3>
        <pre>{JSON.stringify(risk, null, 2)}</pre>

        <h3>Trade Styles</h3>
        <pre>{JSON.stringify(stylesData, null, 2)}</pre>

        <h3>Personal Insights</h3>
        <pre>{JSON.stringify(insights, null, 2)}</pre>
      </Container>
    </>
  );
};

export default Dashboard;
