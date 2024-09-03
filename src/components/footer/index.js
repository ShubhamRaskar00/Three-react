import React from 'react';

function Footer() {
    const currentYear = new Date().getFullYear();
  return (
    <footer className="text-center py-4">
        <p>&copy; {currentYear} SR SHUBH. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
