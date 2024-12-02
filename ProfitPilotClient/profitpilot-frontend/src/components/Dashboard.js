import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Container, Alert, Navbar, Nav, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Import Chart components
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

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

        console.log('Risk Data:', riskRes.data);
        console.log('Styles Data:', stylesRes.data);
        console.log('Insights Data:', insightsRes.data);

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
  }, [token, logout]);

  // Prepare data for charts
  const prepareRiskChartData = () => {
    if (!risk || Object.keys(risk).length === 0) return null;

    const data = {
      labels: ['Profitable Trades', 'Loss Trades'],
      datasets: [
        {
          label: 'Number of Trades',
          data: [risk.profitableTrades, risk.lossTrades],
          backgroundColor: ['#28a745', '#dc3545']
        }
      ]
    };

    return data;
  };

  const prepareStylesChartData = () => {
    if (!stylesData || Object.keys(stylesData).length === 0) return null;

    const labels = Object.keys(stylesData);
    const values = Object.values(stylesData);

    const data = {
      labels: labels,  
      datasets: [
        {
          label: 'Trade Count',
          data: values,
          backgroundColor: ['#007bff', '#17a2b8', '#ffc107', '#28a745', '#dc3545']
        }
      ]
    };

    return data;
  };

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

        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>Risk Assessment</Card.Header>
              <Card.Body>
                {prepareRiskChartData() ? (
                  <Pie data={prepareRiskChartData()} />
                ) : (
                  <p>No data available for Risk Assessment.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>Trade Styles Distribution</Card.Header>
              <Card.Body>
                {prepareStylesChartData() ? (
                  <Bar data={prepareStylesChartData()} options={{ indexAxis: 'y' }} />
                ) : (
                  <p>No data available for Trade Styles.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Header>Personal Insights</Card.Header>
          <Card.Body>
            {insights && Object.keys(insights).length > 0 ? (
              <ul>
                {Object.entries(insights).map(([key, value]) => (
                  <li key={key}>{`${key}: ${value}`}</li>
                ))}
              </ul>
            ) : (
              <p>No personal insights available.</p>
            )}
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>Data Debugging</Card.Header>
          <Card.Body>
            <h4>Risk Data</h4>
            <pre>{JSON.stringify(risk, null, 2)}</pre>
            <h4>Trade Styles Data</h4>
            <pre>{JSON.stringify(stylesData, null, 2)}</pre>
            <h4>Insights Data</h4>
            <pre>{JSON.stringify(insights, null, 2)}</pre>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Dashboard;
