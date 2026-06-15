import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import HistoryPage from './pages/HistoryPage';
import MyPage from './pages/MyPage';
import EditProfilePage from './pages/EditProfilePage';
import Wallet from './pages/WalletPage';
import AssPage from './pages/AssPage';
import SignupPage from './pages/SignupPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import DirectCheckoutPage from './pages/DirectCheckoutPage';
import PrivateRoute from './components/PrivateRoute';
import ChatbotPage from './pages/ChatbotPage';
import PaymentPinSetupPage from './pages/PaymentPinSetupPage';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <div className="flex justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-[390px] bg-white min-h-screen shadow-lg relative overflow-x-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup/*" element={<SignupPage />} />
            <Route path="/signup-account" element={<SignupPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/payment-pin-setup" element={<PaymentPinSetupPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product-detail/:productId" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
              <Route path="/checkout-direct" element={<DirectCheckoutPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/mypage/edit" element={<EditProfilePage />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/ass" element={<AssPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
