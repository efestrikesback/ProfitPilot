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

  // Determine defaultActiveKey based on styleParam
  let defaultActiveKey = '0'; // default to day trading if none provided
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
                  <h5>Recommended Resources</h5>
                  <p>Check out online courses, webinars, and books on day trading. For more detailed guides, stay tuned as we populate this section with curated materials.</p>
                </Accordion.Body>
              </Accordion.Item>

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
                  <h5>Recommended Resources</h5>
                  <p>Books, newsletters, and educational videos focusing on intermediate-term strategies will be added here soon.</p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>Scalp Trading Guide</Accordion.Header>
                <Accordion.Body>
                  <h5>Introduction</h5>
                  <p>Scalping involves taking advantage of very small price changes, typically within minutes or seconds, and accumulating profits over multiple trades.</p>
                  <ul>
                    <li>Focus on highly liquid markets.</li>
                    <li>Use Level II order book data for precise entries and exits.</li>
                    <li>Keep trades short to minimize exposure.</li>
                    <li>Develop fast execution skills and consider using trading bots or advanced order types.</li>
                  </ul>
                  <h5>Recommended Resources</h5>
                  <p>We will add recommended tools, platforms, and charting techniques for scalping in the near future.</p>
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
