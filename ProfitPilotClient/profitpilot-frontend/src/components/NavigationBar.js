import React, { useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { LinkContainer } from 'react-router-bootstrap';

const NavigationBar = () => {
  const { token, logout, user } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">ProfitPilot</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {token && (
          <Nav className="mr-auto">
            <LinkContainer to="/dashboard">
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/my-trades">
              <Nav.Link>My Trades</Nav.Link>
            </LinkContainer>
          </Nav>
        )}
        <Nav className="ml-auto">
          {token ? (
            <>
              <Navbar.Text className="mr-3">
                Signed in as: {user?.firstname} {user?.lastname}
              </Navbar.Text>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </>
          ) : (
            <>
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/register">
                <Nav.Link>Register</Nav.Link>
              </LinkContainer>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
