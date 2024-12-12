// src/components/Market.js

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, Alert, Navbar, Nav, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ASSETS = [
  { id: 'bitcoin', name: 'Bitcoin' },
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'cardano', name: 'Cardano' },
  { id: 'dogecoin', name: 'Dogecoin' },
];

const Market = () => {
  const { token, logout, user } = useContext(AuthContext);
  const [selectedAsset, setSelectedAsset] = useState('bitcoin');
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState('');

  const fetchPriceData = async () => {
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }

    // Using the provided request format:
    // Example: https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true&precision=2
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${selectedAsset}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true&precision=2`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-VDx26ZbiQMDE3Wxk333TzSeB' // remove if not needed
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Failed to fetch price data.');
      }
      const data = await response.json();
      setPriceData(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data. Please try again later.');
    }
  };

  const currentAssetData = priceData ? priceData[selectedAsset] : null;

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
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <Container className="mt-4">
        <h2>Market</h2>
        <p>Welcome, {user?.firstname} {user?.lastname}!</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form className="mb-4" onSubmit={(e) => { e.preventDefault(); fetchPriceData(); }}>
          <Form.Group controlId="assetSelect" className="mb-3">
            <Form.Label>Select Asset</Form.Label>
            <Form.Select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
            >
              {ASSETS.map((asset) => (
                <option key={asset.id} value={asset.id}>{asset.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            Fetch Price
          </Button>
        </Form>

        {currentAssetData && (
          <Card>
            <Card.Header>Price Data for {selectedAsset}</Card.Header>
            <Card.Body>
              <p><strong>USD Price:</strong> {currentAssetData.usd}</p>
              {currentAssetData.usd_market_cap && <p><strong>Market Cap (USD):</strong> {currentAssetData.usd_market_cap}</p>}
              {currentAssetData.usd_24h_vol && <p><strong>24h Volume (USD):</strong> {currentAssetData.usd_24h_vol}</p>}
              {typeof currentAssetData.usd_24h_change === 'number' && (
                <p><strong>24h Change (%):</strong> {currentAssetData.usd_24h_change.toFixed(2)}%</p>
              )}
              {currentAssetData.last_updated_at && (
                <p><strong>Last Updated:</strong> {new Date(currentAssetData.last_updated_at * 1000).toLocaleString()}</p>
              )}
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};

export default Market;
