// src/components/TradingGuide.js

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, Navbar, Nav, Card, Accordion } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const TradingGuide = () => {
  const { logout, user } = useContext(AuthContext);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const styleParam = queryParams.get('style'); // e.g. "swing trading", "day trading", "scalp trading"

  let defaultActiveKey = '0'; // day trading by default
  if (styleParam) {
    const lowerStyle = styleParam.toLowerCase();
    if (lowerStyle.includes('day')) {
      defaultActiveKey = '0';
    } else if (lowerStyle.includes('swing')) {
      defaultActiveKey = '1';
    } else if (lowerStyle.includes('scalp')) {
      defaultActiveKey = '2';
    }
  }

  // A helper component for responsive video embedding
  const ResponsiveVideo = ({ src }) => (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: '20px' }}>
      <iframe
        src={src}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: 'absolute', top:0, left:0, width:'100%', height:'100%' }}
      ></iframe>
    </div>
  );

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
        <h2>Trading Guide</h2>
        <p>Welcome, {user?.firstname} {user?.lastname}!</p>

        <Card className="mb-4">
          <Card.Header>Trading Strategies & Resources</Card.Header>
          <Card.Body>
            <p>Explore the different trading strategies below. Click on each one to expand and learn more:</p>
            
            <Accordion defaultActiveKey={defaultActiveKey} alwaysOpen>
              {/* Day Trading Guide */}
              <Accordion.Item eventKey="0">
                <Accordion.Header>Day Trading Guide</Accordion.Header>
                <Accordion.Body>
                  <h5>Introduction</h5>
                  <p>Day trading involves buying and selling financial instruments within the same trading day. Here are some tips and strategies:</p>
                  <ul>
                    <li>Develop a solid trading plan with clear entry and exit criteria.</li>
                    <li>Focus on volatile assets to capitalize on intraday price movements.</li>
                    <li>Manage risk by setting stop-loss orders and position sizing.</li>
                    <li>Use technical analysis tools like moving averages, RSI, and MACD for quick decision making.</li>
                  </ul>

                  <h5>Recommended Resources (Videos)</h5>
                  {/* Day Trading Links */}
                  <ResponsiveVideo src="https://www.youtube.com/embed/DRAcPbYPNVk" />
                  <ResponsiveVideo src="https://www.youtube.com/embed/QstdS67Iyv0?list=PL1xI23WKVWifg6nqTu2sMZVF8nWfQ8udX" />
                </Accordion.Body>
              </Accordion.Item>

              {/* Swing Trading Guide */}
              <Accordion.Item eventKey="1">
                <Accordion.Header>Swing Trading Guide</Accordion.Header>
                <Accordion.Body>
                  <h5>Introduction</h5>
                  <p>Swing trading aims to capture price moves that unfold over a few days to several weeks, rather than within a single day.</p>
                  <ul>
                    <li>Identify medium-term trends and use daily charts.</li>
                    <li>Look for breakouts, pullbacks, and trend continuations.</li>
                    <li>Set realistic profit targets and adjust stop-losses to lock in profits.</li>
                    <li>Combine fundamental and technical analysis for a more informed approach.</li>
                  </ul>

                  <h5>Recommended Resources (Videos)</h5>
                  {/* Swing Trading Links */}
                  <ResponsiveVideo src="https://www.youtube.com/embed/KO7lX7-Fi7U" />
                  <ResponsiveVideo src="https://www.youtube.com/embed/o6MOQEzXwuM" />
                  <ResponsiveVideo src="https://www.youtube.com/embed/cyTeIilsUcs" />
                </Accordion.Body>
              </Accordion.Item>

              {/* Scalp Trading Guide */}
              <Accordion.Item eventKey="2">
                <Accordion.Header>Scalp Trading Guide</Accordion.Header>
                <Accordion.Body>
                  <h5>Introduction</h5>
                  <p>Scalping involves taking advantage of very small price changes, typically within minutes or seconds, and accumulating profits over multiple trades.</p>
                  <ul>
                    <li>Focus on highly liquid markets (major forex pairs, large cap stocks, or highly traded cryptos).</li>
                    <li>Use Level II order book data for precise entries and exits.</li>
                    <li>Keep trades short to minimize exposure to sudden market swings.</li>
                    <li>Develop fast execution skills and consider using trading bots or advanced order types.</li>
                  </ul>

                  <h5>Recommended Resources (Videos)</h5>
                  {/* Scalp Trading Links */}
                  <ResponsiveVideo src="https://www.youtube.com/embed/XBcMiYK7qYY" />
                  <ResponsiveVideo src="https://www.youtube.com/embed/-0slMH7N6eI" />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default TradingGuide;
