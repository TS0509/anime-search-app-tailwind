import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/anime/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}