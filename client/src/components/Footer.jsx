import React from 'react';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="container footer-content">
        <p>&copy; {new Date().getFullYear()} Lost & Found Management System. All rights reserved.</p>
        {/* <p>Built with MERN Stack.</p> */}
      </div>
    </footer>
  );
}

export default Footer;