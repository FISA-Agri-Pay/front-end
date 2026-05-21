import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-[390px] bg-white min-h-screen shadow-lg relative overflow-x-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
