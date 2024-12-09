// // src/components/MyTrades.js

// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { Container, Table, Alert } from 'react-bootstrap';

// const MyTrades = () => {
//   const { token } = useContext(AuthContext);
//   const [trades, setTrades] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchTrades = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/trades/my-trades', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         setTrades(response.data);
//       } catch (err) {
//         setError('Failed to fetch trades. Please try again.');
//         console.error(err);
//       }
//     };

//     fetchTrades();
//   }, [token]);

//   return (
//     <Container className="mt-5">
//       <h2 className="mb-4">My Trades</h2>
//       {error && <Alert variant="danger">{error}</Alert>}
//       {trades.length > 0 ? (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>Asset</th>
//               <th>Entry Price</th>
//               <th>Exit Price</th>
//               <th>Quantity</th>
//               <th>Profit/Loss</th>
//               <th>Entry Time</th>
//               <th>Exit Time</th>
//               <th>Trade Style</th>
//             </tr>
//           </thead>
//           <tbody>
//             {trades.map((trade) => (
//               <tr key={trade.id}>
//                 <td>{trade.asset}</td>
//                 <td>{trade.entryPrice.toFixed(2)}</td>
//                 <td>{trade.exitPrice.toFixed(2)}</td>
//                 <td>{trade.quantity.toFixed(4)}</td>
//                 <td
//                   style={{ color: trade.profitLoss >= 0 ? 'green' : 'red' }}
//                 >
//                   {trade.profitLoss.toFixed(2)}
//                 </td>
//                 <td>{new Date(trade.entryTime).toLocaleString()}</td>
//                 <td>{new Date(trade.exitTime).toLocaleString()}</td>
//                 <td>{trade.tradeStyle}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       ) : (
//         <p>No trades found.</p>
//       )}
//     </Container>
//   );
// };

// export default MyTrades;



// src/components/MyTrades.js

import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Container, Table, Alert } from 'react-bootstrap';

const MyTrades = () => {
  const { token } = useContext(AuthContext);
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState('');
  const [sortColumn, setSortColumn] = useState(null);    // 'entryTime' | 'exitTime' | null
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

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

  const sortedTrades = useMemo(() => {
    if (!trades || trades.length === 0) return [];
    if (!sortColumn) return trades;

    const sorted = [...trades];

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
  }, [trades, sortColumn, sortDirection]);

  // Function to get the appropriate sort symbol for a column
  const getSortSymbol = (column) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? '▲' : '▼';
    }
    // If the column is not currently sorted, show a neutral sort indicator
    return '⇅';
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">My Trades</h2>
      {error && <Alert variant="danger">{error}</Alert>}
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
  );
};

export default MyTrades;
