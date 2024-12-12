// // // src/components/Market.js

// // import React, { useState, useContext, useEffect } from 'react';
// // import { AuthContext } from '../context/AuthContext';
// // import { Container, Alert, Navbar, Nav, Form, Button, Card, Table } from 'react-bootstrap';
// // import { Link } from 'react-router-dom';

// // const ASSETS = [
// //   { id: 'bitcoin', name: 'Bitcoin' },
// //   { id: 'ethereum', name: 'Ethereum' },
// //   { id: 'cardano', name: 'Cardano' },
// //   { id: 'dogecoin', name: 'Dogecoin' },
// // ];

// // const Market = () => {
// //   const { token, logout, user } = useContext(AuthContext);
// //   const [selectedAsset, setSelectedAsset] = useState('bitcoin');
// //   const [priceData, setPriceData] = useState(null);
// //   const [error, setError] = useState('');

// //   const [trendingCoins, setTrendingCoins] = useState([]);

// //   const fetchPriceData = async () => {
// //     if (!token) {
// //       setError('No authentication token found. Please log in.');
// //       return;
// //     }

// //     const url = `https://api.coingecko.com/api/v3/simple/price?ids=${selectedAsset}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true&precision=2`;
// //     const options = {
// //       method: 'GET',
// //       headers: {
// //         accept: 'application/json',
// //         'x-cg-demo-api-key': 'CG-VDx26ZbiQMDE3Wxk333TzSeB'
// //       }
// //     };

// //     try {
// //       const response = await fetch(url, options);
// //       if (!response.ok) {
// //         throw new Error('Failed to fetch price data.');
// //       }
// //       const data = await response.json();
// //       setPriceData(data);
// //       setError('');
// //     } catch (err) {
// //       console.error(err);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   };

// //   const fetchTrendingCoins = async () => {
// //     if (!token) {
// //       setError('No authentication token found. Please log in.');
// //       return;
// //     }

// //     const url = 'https://api.coingecko.com/api/v3/search/trending';
// //     const options = {
// //       method: 'GET',
// //       headers: {
// //         accept: 'application/json',
// //         'x-cg-demo-api-key': 'CG-VDx26ZbiQMDE3Wxk333TzSeB'
// //       }
// //     };

// //     try {
// //       const response = await fetch(url, options);
// //       if (!response.ok) {
// //         throw new Error('Failed to fetch trending coins.');
// //       }
// //       const data = await response.json();
// //       // data.coins is an array, each element has an "item" property
// //       setTrendingCoins(data.coins);
// //     } catch (err) {
// //       console.error(err);
// //       setError('Failed to fetch trending coins. Please try again later.');
// //     }
// //   };

// //   useEffect(() => {
// //     if (token) {
// //       fetchTrendingCoins();
// //     }
// //   }, [token]);

// //   const currentAssetData = priceData ? priceData[selectedAsset] : null;

// //   return (
// //     <>
// //       <Navbar bg="light" expand="lg">
// //         <Container>
// //           <Navbar.Brand href="#">ProfitPilot</Navbar.Brand>
// //           <Navbar.Toggle aria-controls="basic-navbar-nav" />
// //           <Navbar.Collapse id="basic-navbar-nav">
// //             <Nav className="ms-auto">
// //               <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
// //               <Nav.Link as={Link} to="/my-trades">My Trades</Nav.Link>
// //               <Nav.Link as={Link} to="/market">Market</Nav.Link>
// //               <Nav.Link as={Link} to="/trading-guide">Trading Guide</Nav.Link>
// //               <Nav.Link onClick={logout}>Logout</Nav.Link>
// //             </Nav>
// //           </Navbar.Collapse>
// //         </Container>
// //       </Navbar>
      
// //       <Container className="mt-4">
// //         <h2>Market</h2>
// //         <p>Welcome, {user?.firstname} {user?.lastname}!</p>

// //         {error && <Alert variant="danger">{error}</Alert>}

// //         <Form className="mb-4" onSubmit={(e) => { e.preventDefault(); fetchPriceData(); }}>
// //           <Form.Group controlId="assetSelect" className="mb-3">
// //             <Form.Label>Get Live Price</Form.Label>
// //             <Form.Select
// //               value={selectedAsset}
// //               onChange={(e) => setSelectedAsset(e.target.value)}
// //             >
// //               {ASSETS.map((asset) => (
// //                 <option key={asset.id} value={asset.id}>{asset.name}</option>
// //               ))}
// //             </Form.Select>
// //           </Form.Group>

// //           <Button variant="primary" type="submit">
// //             Fetch Price
// //           </Button>
// //         </Form>

// //         {currentAssetData && (
// //           <Card className="mb-4">
// //             <Card.Header>Price Data for {selectedAsset}</Card.Header>
// //             <Card.Body>
// //               <p><strong>USD Price:</strong> {currentAssetData.usd}</p>
// //               {currentAssetData.usd_market_cap && <p><strong>Market Cap (USD):</strong> {currentAssetData.usd_market_cap}</p>}
// //               {currentAssetData.usd_24h_vol && <p><strong>24h Volume (USD):</strong> {currentAssetData.usd_24h_vol}</p>}
// //               {typeof currentAssetData.usd_24h_change === 'number' && (
// //                 <p><strong>24h Change (%):</strong> {currentAssetData.usd_24h_change.toFixed(2)}%</p>
// //               )}
// //               {currentAssetData.last_updated_at && (
// //                 <p><strong>Last Updated:</strong> {new Date(currentAssetData.last_updated_at * 1000).toLocaleString()}</p>
// //               )}
// //             </Card.Body>
// //           </Card>
// //         )}

// //         {/* Trending Section */}
// //         <Card className="mb-4">
// //           <Card.Header>Trending Coins</Card.Header>
// //           <Card.Body>
// //             {trendingCoins.length === 0 ? (
// //               <p>No trending coins data available.</p>
// //             ) : (
// //               <Table striped bordered hover responsive>
// //                 <thead>
// //                   <tr>
// //                     <th>Rank</th>
// //                     <th>Coin</th>
// //                     <th>Symbol</th>
// //                     <th>Market Cap Rank</th>
// //                     <th>Thumb</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {trendingCoins.map((coinObj, index) => {
// //                     const item = coinObj.item;
// //                     return (
// //                       <tr key={item.coin_id}>
// //                         <td>{index + 1}</td>
// //                         <td>{item.name}</td>
// //                         <td>{item.symbol.toUpperCase()}</td>
// //                         <td>{item.market_cap_rank || 'N/A'}</td>
// //                         <td>
// //                           <img src={item.thumb} alt={item.name} style={{ width: '24px', height: '24px' }} />
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </Table>
// //             )}
// //           </Card.Body>
// //         </Card>
// //       </Container>
// //     </>
// //   );
// // };

// // export default Market;


// // src/components/Market.js

// import React, { useState, useContext, useEffect } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { Container, Alert, Navbar, Nav, Form, Button, Card, Table } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// const ASSETS = [
//   { id: 'bitcoin', name: 'Bitcoin' },
//   { id: 'ethereum', name: 'Ethereum' },
//   { id: 'cardano', name: 'Cardano' },
//   { id: 'dogecoin', name: 'Dogecoin' },
// ];

// const Market = () => {
//   const { token, logout, user } = useContext(AuthContext);
//   const [selectedAsset, setSelectedAsset] = useState('bitcoin');
//   const [priceData, setPriceData] = useState(null);
//   const [error, setError] = useState('');

//   const [trendingCoins, setTrendingCoins] = useState([]);
//   const [coinsList, setCoinsList] = useState([]);

//   const fetchPriceData = async () => {
//     if (!token) {
//       setError('No authentication token found. Please log in.');
//       return;
//     }

//     const url = `https://api.coingecko.com/api/v3/simple/price?ids=${selectedAsset}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true&precision=2`;
//     const options = {
//       method: 'GET',
//       headers: {
//         accept: 'application/json',
//         'x-cg-demo-api-key': 'CG-VDx26ZbiQMDE3Wxk333TzSeB'
//       }
//     };

//     try {
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error('Failed to fetch price data.');
//       }
//       const data = await response.json();
//       setPriceData(data);
//       setError('');
//     } catch (err) {
//       console.error(err);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   };

//   const fetchTrendingCoins = async () => {
//     if (!token) {
//       setError('No authentication token found. Please log in.');
//       return;
//     }

//     const url = 'https://api.coingecko.com/api/v3/search/trending';
//     const options = {
//       method: 'GET',
//       headers: {
//         accept: 'application/json',
//         'x-cg-demo-api-key': 'CG-VDx26ZbiQMDE3Wxk333TzSeB'
//       }
//     };

//     try {
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error('Failed to fetch trending coins.');
//       }
//       const data = await response.json();
//       setTrendingCoins(data.coins);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to fetch trending coins. Please try again later.');
//     }
//   };

//   const fetchCoinsList = async () => {
//     if (!token) {
//       setError('No authentication token found. Please log in.');
//       return;
//     }

//     const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=btc&order=volume_desc&per_page=20&sparkline=false';
//     const options = {
//       method: 'GET',
//       headers: {
//         accept: 'application/json',
//         'x-cg-demo-api-key': 'CG-VDx26ZbiQMDE3Wxk333TzSeB'
//       }
//     };

//     try {
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error('Failed to fetch coins list.');
//       }
//       const data = await response.json();
//       setCoinsList(data);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to fetch coins list. Please try again later.');
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchTrendingCoins();
//       fetchCoinsList();
//     }
//   }, [token]);

//   const currentAssetData = priceData ? priceData[selectedAsset] : null;

//   return (
//     <>
//       <Navbar bg="light" expand="lg">
//         <Container>
//           <Navbar.Brand href="#">ProfitPilot</Navbar.Brand>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="ms-auto">
//               <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
//               <Nav.Link as={Link} to="/my-trades">My Trades</Nav.Link>
//               <Nav.Link as={Link} to="/market">Market</Nav.Link>
//               <Nav.Link as={Link} to="/trading-guide">Trading Guide</Nav.Link>
//               <Nav.Link onClick={logout}>Logout</Nav.Link>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>
      
//       <Container className="mt-4">
//         <h2>Market</h2>
//         <p>Welcome, {user?.firstname} {user?.lastname}!</p>

//         {error && <Alert variant="danger">{error}</Alert>}

//         {/* Asset Price Section */}
//         <Form className="mb-4" onSubmit={(e) => { e.preventDefault(); fetchPriceData(); }}>
//           <Form.Group controlId="assetSelect" className="mb-3">
//             <Form.Label>Select Asset</Form.Label>
//             <Form.Select
//               value={selectedAsset}
//               onChange={(e) => setSelectedAsset(e.target.value)}
//             >
//               {ASSETS.map((asset) => (
//                 <option key={asset.id} value={asset.id}>{asset.name}</option>
//               ))}
//             </Form.Select>
//           </Form.Group>

//           <Button variant="primary" type="submit">
//             Fetch Price
//           </Button>
//         </Form>

//         {currentAssetData && (
//           <Card className="mb-4">
//             <Card.Header>Price Data for {selectedAsset}</Card.Header>
//             <Card.Body>
//               <p><strong>USD Price:</strong> {currentAssetData.usd}</p>
//               {currentAssetData.usd_market_cap && <p><strong>Market Cap (USD):</strong> {currentAssetData.usd_market_cap}</p>}
//               {currentAssetData.usd_24h_vol && <p><strong>24h Volume (USD):</strong> {currentAssetData.usd_24h_vol}</p>}
//               {typeof currentAssetData.usd_24h_change === 'number' && (
//                 <p><strong>24h Change (%):</strong> {currentAssetData.usd_24h_change.toFixed(2)}%</p>
//               )}
//               {currentAssetData.last_updated_at && (
//                 <p><strong>Last Updated:</strong> {new Date(currentAssetData.last_updated_at * 1000).toLocaleString()}</p>
//               )}
//             </Card.Body>
//           </Card>
//         )}

//         {/* Coins List with Market Data Section */}
//         <Card className="mb-4">
//           <Card.Header>Coins List (Top 20 by Volume)</Card.Header>
//           <Card.Body>
//             {coinsList.length === 0 ? (
//               <p>No coins data available.</p>
//             ) : (
//               <Table striped bordered hover responsive>
//                 <thead>
//                   <tr>
//                     <th>Rank</th>
//                     <th>Coin</th>
//                     <th>Symbol</th>
//                     <th>Current Price (BTC)</th>
//                     <th>Market Cap (BTC)</th>
//                     <th>Total Volume (BTC)</th>
//                     <th>Image</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {coinsList.map((coin, index) => (
//                     <tr key={coin.id}>
//                       <td>{coin.market_cap_rank || index + 1}</td>
//                       <td>{coin.name}</td>
//                       <td>{coin.symbol.toUpperCase()}</td>
//                       <td>{coin.current_price}</td>
//                       <td>{coin.market_cap}</td>
//                       <td>{coin.total_volume}</td>
//                       <td>
//                         <img src={coin.image} alt={coin.name} style={{ width: '24px', height: '24px' }} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             )}
//           </Card.Body>
//         </Card>

//         {/* Trending Section */}
//         <Card className="mb-4">
//           <Card.Header>Trending Coins</Card.Header>
//           <Card.Body>
//             {trendingCoins.length === 0 ? (
//               <p>No trending coins data available.</p>
//             ) : (
//               <Table striped bordered hover responsive>
//                 <thead>
//                   <tr>
//                     <th>Rank</th>
//                     <th>Coin</th>
//                     <th>Symbol</th>
//                     <th>Market Cap Rank</th>
//                     <th>Thumb</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {trendingCoins.map((coinObj, index) => {
//                     const item = coinObj.item;
//                     return (
//                       <tr key={item.coin_id}>
//                         <td>{index + 1}</td>
//                         <td>{item.name}</td>
//                         <td>{item.symbol.toUpperCase()}</td>
//                         <td>{item.market_cap_rank || 'N/A'}</td>
//                         <td>
//                           <img src={item.thumb} alt={item.name} style={{ width: '24px', height: '24px' }} />
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </Table>
//             )}
//           </Card.Body>
//         </Card>
//       </Container>
//     </>
//   );
// };

// export default Market;


// src/components/Market.js

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, Alert, Navbar, Nav, Form, Button, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// From your given data, we will create a coins array with their coingecko 'id' and 'name'.
// The user said "just take their name", but API requires 'id', so we'll use 'id' for fetching and 'name' for display.
// Using the provided snippet, we have a list of coins with their `id` and `name`.

const COINS = [
  { id: 'tether', name: 'Tether' },
  { id: 'bitcoin', name: 'Bitcoin' },
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'xrp', name: 'XRP' },
  { id: 'usd-coin', name: 'USDC' },
  { id: 'first-digital-usd', name: 'First Digital USD' },
  { id: 'vnst-stablecoin', name: 'VNST Stablecoin' },
  { id: 'dogecoin', name: 'Dogecoin' },
  { id: 'solana', name: 'Solana' },
  { id: 'pepe', name: 'Pepe' },
  { id: 'chainlink', name: 'Chainlink' },
  { id: 'tron', name: 'TRON' },
  { id: 'sui', name: 'Sui' },
  { id: 'aave', name: 'Aave' },
  { id: 'cardano', name: 'Cardano' },
  { id: 'wrapped-solana', name: 'Wrapped SOL' },
  { id: 'binancecoin', name: 'BNB' },
  { id: 'shiba-inu', name: 'Shiba Inu' },
  { id: 'uniswap', name: 'Uniswap' },
  { id: 'hedera-hashgraph', name: 'Hedera' }
];

const Market = () => {
  const { token, logout, user } = useContext(AuthContext);
  const [error, setError] = useState('');

  const [selectedCoin, setSelectedCoin] = useState('bitcoin'); // default coin = bitcoin
  const [chartData, setChartData] = useState(null);

  const [trendingCoins, setTrendingCoins] = useState([]);
  const [coinsList, setCoinsList] = useState([]);

  // Fetch chart data for the selected coin
  const fetchChartData = async (coinId) => {
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }

    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=BTC&days=1`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-VDx26ZbiQMDE3Wxk333TzSeB'
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Failed to fetch chart data.');
      }
      const data = await response.json();
      setChartData(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch chart data. Please try again later.');
    }
  };

  const fetchTrendingCoins = async () => {
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }

    const url = 'https://api.coingecko.com/api/v3/search/trending';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-VDx26ZbiQMDE3Wxk333TzSeB'
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Failed to fetch trending coins.');
      }
      const data = await response.json();
      setTrendingCoins(data.coins);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch trending coins. Please try again later.');
    }
  };

  const fetchCoinsList = async () => {
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }

    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=btc&order=volume_desc&per_page=20&sparkline=false';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-VDx26ZbiQMDE3Wxk333TzSeB'
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Failed to fetch coins list.');
      }
      const data = await response.json();
      setCoinsList(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch coins list. Please try again later.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchChartData(selectedCoin);
      fetchTrendingCoins();
      fetchCoinsList();
    }
  }, [token, selectedCoin]);

  // Prepare chart data for line chart
  const prepareLineChartData = () => {
    if (!chartData || !chartData.prices) return null;

    // chartData.prices is an array of [timestamp, price]
    const labels = chartData.prices.map((p) => {
      const date = new Date(p[0]);
      return date.toLocaleTimeString(); // e.g. "12:34:56"
    });
    const prices = chartData.prices.map((p) => p[1]);

    return {
      labels,
      datasets: [
        {
          label: `${selectedCoin.toUpperCase()} Price (BTC)`,
          data: prices,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          tension: 0.1
        }
      ]
    };
  };

  const lineChartData = prepareLineChartData();

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
        <h2>Market</h2>
        <p>Welcome, {user?.firstname} {user?.lastname}!</p>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Chart Section */}
        <Card className="mb-4">
          <Card.Header>Coin Market Chart (24h) - BTC Pricing</Card.Header>
          <Card.Body>
            <Form className="mb-3">
              <Form.Group controlId="coinSelect">
                <Form.Label>Select Coin:</Form.Label>
                <Form.Select
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                >
                  {COINS.map((coin) => (
                    <option key={coin.id} value={coin.id}>{coin.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
            {lineChartData ? (
              <div style={{ height: '400px' }}>
                <Line data={lineChartData} />
              </div>
            ) : (
              <p>Loading chart data...</p>
            )}
          </Card.Body>
        </Card>

        {/* Coins List with Market Data Section */}
        <Card className="mb-4">
          <Card.Header>Coins List (Top 20 by Volume)</Card.Header>
          <Card.Body>
            {coinsList.length === 0 ? (
              <p>No coins data available.</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Coin</th>
                    <th>Symbol</th>
                    <th>Current Price (BTC)</th>
                    <th>Market Cap (BTC)</th>
                    <th>Total Volume (BTC)</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {coinsList.map((coin, index) => (
                    <tr key={coin.id}>
                      <td>{coin.market_cap_rank || index + 1}</td>
                      <td>{coin.name}</td>
                      <td>{coin.symbol.toUpperCase()}</td>
                      <td>{coin.current_price}</td>
                      <td>{coin.market_cap}</td>
                      <td>{coin.total_volume}</td>
                      <td>
                        <img src={coin.image} alt={coin.name} style={{ width: '24px', height: '24px' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Trending Section */}
        <Card className="mb-4">
          <Card.Header>Trending Coins</Card.Header>
          <Card.Body>
            {trendingCoins.length === 0 ? (
              <p>No trending coins data available.</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Coin</th>
                    <th>Symbol</th>
                    <th>Market Cap Rank</th>
                    <th>Thumb</th>
                  </tr>
                </thead>
                <tbody>
                  {trendingCoins.map((coinObj, index) => {
                    const item = coinObj.item;
                    return (
                      <tr key={item.coin_id}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.symbol.toUpperCase()}</td>
                        <td>{item.market_cap_rank || 'N/A'}</td>
                        <td>
                          <img src={item.thumb} alt={item.name} style={{ width: '24px', height: '24px' }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Market;
