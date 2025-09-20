import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../shared/Navbar';

const MainLayout = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      
      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        <p>PropertyPulse &copy; {currentYear}</p>
      </footer>
    </div>
  );
};

export default MainLayout;
