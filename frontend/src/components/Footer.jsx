import React from "react";

const Footer = () => (
  <footer className="bg-brand-ink text-gray-300 mt-12">
    <div className="max-w-7xl mx-auto px-4 py-8 text-sm flex flex-col md:flex-row justify-between gap-4">
      <p>&copy; {new Date().getFullYear()} Zonemarket. A demo ecommerce platform.</p>
      <p>Built with React, Node.js, Express &amp; MongoDB.</p>
    </div>
  </footer>
);

export default Footer;
