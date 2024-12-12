// src/components/MyTrades.js

import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Container, Table, Alert, Form, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MyTrades = () => {
  const { token, logout } = useContext(AuthContext);
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState('');

  const [sortColumn, setSortColumn] = useState(null);    // 'entryTime' | 'exitTime' | null
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  const [selectedAsset, setSelectedAsset] = useState('All');
  const [selectedTradeStyle, setSelectedTradeStyle] = useState('All');
  const [profitLossFilter, setProfitLossFilter] = useState('All'); // 'All', 'Profits', or 'Losses'

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await axios.get('http://localhost:8080/trades/my-trades', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setTrades(response.data);
      } catch (err) {
        setError('Failed to fetch trades. Please try again.');
        console.error(err);
      }
    };

    if (token) {
      fetchTrades();
    }
  }, [token]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Extract unique assets from trades
  const uniqueAssets = useMemo(() => {
    const assetSet = new Set();
    trades.forEach((t) => {
      if (t.asset) {
        assetSet.add(t.asset);
      }
    });
    return ['All', ...assetSet];
  }, [trades]);

  // Extract unique trade styles from trades
  const uniqueTradeStyles = useMemo(() => {
    const styleSet = new Set();
    trades.forEach((t) => {
      if (t.tradeStyle) {
        styleSet.add(t.tradeStyle);
      }
    });
    return ['All', ...styleSet];
  }, [trades]);

  // Filter trades by asset, trade style, and profit/loss
  const filteredTrades = useMemo(() => {
    let result = trades;

    // Filter by asset
    if (selectedAsset !== 'All') {
      result = result.filter(t => t.asset === selectedAsset);
    }

    // Filter by trade style
    if (selectedTradeStyle !== 'All') {
      result = result.filter(t => t.tradeStyle === selectedTradeStyle);
    }

    // Filter by profit/loss
    if (profitLossFilter === 'Profits') {
      result = result.filter(t => t.profitLoss > 0);
    } else if (profitLossFilter === 'Losses') {
      result = result.filter(t => t.profitLoss < 0);
    }

    return result;
  }, [trades, selectedAsset, selectedTradeStyle, profitLossFilter]);

  // Sort trades after filtering
  const sortedTrades = useMemo(() => {
    if (!filteredTrades || filteredTrades.length === 0) return [];
    if (!sortColumn) return filteredTrades;

    const sorted = [...filteredTrades];

    sorted.sort((a, b) => {
      let aVal, bVal;
      if (sortColumn === 'entryTime') {
        aVal = new Date(a.entryTime).getTime();
        bVal = new Date(b.entryTime).getTime();
      } else if (sortColumn === 'exitTime') {
        aVal = new Date(a.exitTime).getTime();
        bVal = new Date(b.exitTime).getTime();
      } else {
        return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredTrades, sortColumn, sortDirection]);

  // Get sort symbol
  const getSortSymbol = (column) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? '▲' : '▼';
    }
    return '⇅';
  };

  return (
    <>
      {/* Re-using the same navbar as in the Dashboard */}
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

      <Container className="mt-5">
        <h2 className="mb-4">My Trades</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="assetFilter">
              <Form.Label>Select Asset:</Form.Label>
              <Form.Select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
              >
                {uniqueAssets.map(assetName => (
                  <option key={assetName} value={assetName}>{assetName}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={4}>
            <Form.Group controlId="tradeStyleFilter">
              <Form.Label>Select Trade Style:</Form.Label>
              <Form.Select
                value={selectedTradeStyle}
                onChange={(e) => setSelectedTradeStyle(e.target.value)}
              >
                {uniqueTradeStyles.map(styleName => (
                  <option key={styleName} value={styleName}>{styleName}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={4}>
            <Form.Group controlId="profitLossFilter">
              <Form.Label>Show:</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="All"
                  name="profitLoss"
                  type="radio"
                  id="profitLossAll"
                  value="All"
                  checked={profitLossFilter === 'All'}
                  onChange={(e) => setProfitLossFilter(e.target.value)}
                />
                <Form.Check
                  inline
                  label="Profits Only"
                  name="profitLoss"
                  type="radio"
                  id="profitLossProfits"
                  value="Profits"
                  checked={profitLossFilter === 'Profits'}
                  onChange={(e) => setProfitLossFilter(e.target.value)}
                />
                <Form.Check
                  inline
                  label="Losses Only"
                  name="profitLoss"
                  type="radio"
                  id="profitLossLosses"
                  value="Losses"
                  checked={profitLossFilter === 'Losses'}
                  onChange={(e) => setProfitLossFilter(e.target.value)}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        {sortedTrades.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Entry Price</th>
                <th>Exit Price</th>
                <th>Quantity</th>
                <th>Profit/Loss</th>
                <th
                  onClick={() => handleSort('entryTime')}
                  style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Entry Time {getSortSymbol('entryTime')}
                </th>
                <th
                  onClick={() => handleSort('exitTime')}
                  style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Exit Time {getSortSymbol('exitTime')}
                </th>
                <th>Trade Style</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrades.map((trade) => (
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
        ) : (
          <p>No trades found.</p>
        )}
      </Container>
    </>
  );
};

export default MyTrades;
