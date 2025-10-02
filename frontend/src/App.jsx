// src/App.jsx
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';


function App() {
  return (
    <div>
      <Navbar expand="lg" bg="dark" variant="dark" sticky="top">
        <Container>
          
          <Navbar.Brand href="/">Reto CIID</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/startups">
                Startups
              </Nav.Link>
              <Nav.Link as={NavLink} to="/technologies">
                Technologies
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <main>
          <Outlet />
        </main>
      </Container>
    </div>
  );
}

export default App;
