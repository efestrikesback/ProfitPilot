// src/components/Dashboard.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Container, Alert, Navbar, Nav, Row, Col, Card, Table, Button } from 'react-bootstrap';
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
  const [bestTrades, setBestTrades] = useState([]);
  const [worstTrades, setWorstTrades] = useState([]);

  const [reloadMessage, setReloadMessage] = useState('');

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
      const [riskRes, stylesRes, insightsRes, bestRes, worstRes] = await Promise.all([
        axios.get('http://localhost:8080/trades/risk-assessment', { headers }),
        axios.get('http://localhost:8080/trades/trade-styles', { headers }),
        axios.get('http://localhost:8080/trades/personal-insights', { headers }),
        axios.get('http://localhost:8080/trades/best-trades', { headers }),
        axios.get('http://localhost:8080/trades/worst-trades', { headers })
      ]);

      setRisk(riskRes.data);
      setStylesData(stylesRes.data);
      setInsights(insightsRes.data);
      setBestTrades(bestRes.data);
      setWorstTrades(worstRes.data);
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

  useEffect(() => {
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

  const renderBestWorstTable = (tradesList) => {
    if (!tradesList || tradesList.length === 0) {
      return <p>No trades found.</p>;
    }

    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Entry Price</th>
            <th>Exit Price</th>
            <th>Quantity</th>
            <th>Profit/Loss</th>
            <th>Entry Time</th>
            <th>Exit Time</th>
            <th>Trade Style</th>
          </tr>
        </thead>
        <tbody>
          {tradesList.map(trade => (
            <tr key={trade.id}>
              <td>{trade.asset}</td>
              <td>{trade.entryPrice.toFixed(2)}</td>
              <td>{trade.exitPrice.toFixed(2)}</td>
              <td>{trade.quantity.toFixed(4)}</td>
              <td style={{ color: trade.profitLoss >= 0 ? 'green' : 'red' }}>
                {trade.profitLoss.toFixed(2)}
              </td>
              <td>{new Date(trade.entryTime).toLocaleString()}</td>
              <td>{new Date(trade.exitTime).toLocaleString()}</td>
              <td>{trade.tradeStyle}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const renderInsights = () => {
    if (!insights || Object.keys(insights).length === 0) {
      return <p>No personal insights available.</p>;
    }

    return (
      <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
        {Object.entries(insights).map(([key, value]) => {
          const percentage = parseFloat(value);
          let color = 'black';
          if (percentage > 50) {
            color = 'darkgreen';
          } else if (percentage > 40) {
            color = 'green';
          } else if (percentage < 30) {
            color = 'darkred';
          } else {
            // between 30 and 40 inclusive
            color = 'red';
          }

          // Extract style name from key
          const [styleName] = key.split(' ');
          const friendlyStyleName = styleName.replace('_', ' ').toLowerCase();

          return (
            <li key={key} style={{ marginBottom: '5px' }}>
              {/* Colored bullet */}
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  backgroundColor: color,
                  borderRadius: '50%',
                  marginRight: '5px',
                  verticalAlign: 'middle'
                }}
              ></span>
              {/* Text showing style and percentage */}
              <span style={{ verticalAlign: 'middle', color: color }}>
                {`${key}: ${percentage.toFixed(2)}%`}
              </span>
              {/* If percentage < 40% for any style, show button */}
              {percentage < 40 && (
                <Button
                  as={Link}
                  to={`/trading-guide?style=${friendlyStyleName}`}
                  variant="primary"
                  size="sm"
                  style={{ marginLeft: '10px', verticalAlign: 'middle' }}
                >
                  Want to be a better at {friendlyStyleName}?
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // Function to call the reload trades API
  const handleReloadTrades = async () => {
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.delete('http://localhost:8080/trades/reload', { headers });
      setReloadMessage(response.data); // "Trades have been cleared and new mock trades generated."
      setError('');
      // After success, refresh the page to update displayed data
      // A short timeout can make the message visible for a moment before reload
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
    } catch (err) {
      setReloadMessage('');
      if (err.response && err.response.status === 401) {
        setError('Unauthorized access. Please log in again.');
        logout();
      } else {
        setError('Failed to reload trades. Please try again.');
      }
      console.error(err);
    }
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
              <Nav.Link as={Link} to="/market">Market</Nav.Link>
              <Nav.Link as={Link} to="/trading-guide">Trading Guide</Nav.Link>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <h2>Dashboard</h2>
        <p>Welcome, {user?.firstname} {user?.lastname}!</p>

        {error && <Alert variant="danger">{error}</Alert>}
        {reloadMessage && <Alert variant="success">{reloadMessage}</Alert>}

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
            {renderInsights()}
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>Top 3 Best Trades</Card.Header>
          <Card.Body>
            {renderBestWorstTable(bestTrades)}
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>Top 3 Worst Trades</Card.Header>
          <Card.Body>
            {renderBestWorstTable(worstTrades)}
          </Card.Body>
        </Card>

        {/* Button to reset trading data */}
        <Card className="mb-4">
          <Card.Header>Reset Trading Data</Card.Header>
          <Card.Body>
            <Button variant="warning" onClick={handleReloadTrades}>
              Delete and Regenerate Trades
            </Button>
            <p className="mt-2">Clicking this will remove all current trades and generate new mock data.</p>
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
            <h4>Best Trades</h4>
            <pre>{JSON.stringify(bestTrades, null, 2)}</pre>
            <h4>Worst Trades</h4>
            <pre>{JSON.stringify(worstTrades, null, 2)}</pre>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Dashboard;
