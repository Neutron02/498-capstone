import React from 'react';

function Navbar({ setView }) {
  return (
    <nav className="navbar">
      <button onClick={() => setView('search')}>Search</button>
      <button
        onClick={() => setView('catalogue')}
        style={{ marginRight: '40px' }}
      >
        Catalogue
      </button>
    </nav>
  );
}

export default Navbar;