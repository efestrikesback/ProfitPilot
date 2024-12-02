// src/components/MyTrades.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Container, Table, Alert } from 'react-bootstrap';

const MyTrades = () => {
  const { token } = useContext(AuthContext);
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/my-trades', {
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

    fetchTrades();
  }, [token]);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">My Trades</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {trades.length > 0 ? (
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
            {trades.map((trade) => (
              <tr key={trade.id}>
                <td>{trade.asset}</td>
                <td>{trade.entryPrice.toFixed(2)}</td>
                <td>{trade.exitPrice.toFixed(2)}</td>
                <td>{trade.quantity.toFixed(4)}</td>
                <td
                  style={{ color: trade.profitLoss >= 0 ? 'green' : 'red' }}
                >
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
  );
};

export default MyTrades;
