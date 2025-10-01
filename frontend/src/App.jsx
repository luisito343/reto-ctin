// src/App.jsx
import { Outlet, NavLink } from 'react-router-dom';

function App() {
  return (
    <div>
      <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <NavLink to="/startups" style={{ marginRight: '15px' }}>
          Startups
        </NavLink>
        <NavLink to="/technologies">
          Technologies
        </NavLink>
      </nav>
      
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
