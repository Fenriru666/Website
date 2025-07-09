import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function MainLayout() {
  return (
    // Sử dụng flex-col để đảm bảo Header, Main, Footer xếp chồng lên nhau
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;