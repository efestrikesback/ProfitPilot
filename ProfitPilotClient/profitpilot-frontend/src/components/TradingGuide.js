import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, Navbar, Nav, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TradingGuide = () => {
  const { logout, user } = useContext(AuthContext);

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
          <Card.Header>Resources & Tips</Card.Header>
          <Card.Body>
            <p>Coming soon... Here we will provide trading strategies, tips, and resources to help you improve.</p>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default TradingGuide;
