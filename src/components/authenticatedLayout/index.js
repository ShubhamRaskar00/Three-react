import React from 'react';
import Header from '../header';

function AuthenticatedLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

export default AuthenticatedLayout;
