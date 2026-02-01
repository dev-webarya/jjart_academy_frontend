import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ClassesPage from './pages/ClassesPage';
import ExhibitionsPage from './pages/ExhibitionsPage';
import GalleryPage from './pages/GalleryPage';
import InstructorsPage from './pages/InstructorsPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import FeePaymentPage from './pages/FeePaymentPage';
// Shop Components
import ArtworkShop from './components/shop/ArtworkShop';
import MaterialsShop from './components/shop/MaterialsShop';
import Cart from './components/shop/Cart';
import CheckoutPage from './components/shop/CheckoutPage';

// Events Components


// Student Components
import StudentPanel from './pages/StudentPanel';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentAttendance from './pages/student/StudentAttendance';
import EnhancedStudentProfile from './pages/student/EnhancedStudentProfile';
import MyOrders from './pages/student/MyOrders';
import MyEvents from './pages/student/MyEvents';
import Settings from './pages/student/Settings';
import OnlineClasses from './pages/student/OnlineClasses';
import StudentCertificates from './pages/student/StudentCertificates';
import RegularClasses from './pages/student/RegularClasses';
import StudentFeePayment from './pages/student/StudentFeePayment';


import './App.css';


// Protected Student Route Component
const ProtectedStudentRoute = ({ children }) => {
  const { isAuthenticated, isStudent, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 to-indigo-600">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }
  return isAuthenticated && isStudent ? children : <Navigate to="/" replace />;
};
// Layout wrapper to conditionally show Navbar and Footer
const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = false;
  const isStudentRoute = location.pathname.startsWith('/student');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {!isAdminRoute && !isStudentRoute && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/exhibitions" element={<ExhibitionsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/instructors" element={<InstructorsPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/fee-payment" element={<FeePaymentPage />} />
        {/* Shop Routes */}
        <Route path="/shop/artworks" element={<ArtworkShop />} />
        <Route path="/shop/materials" element={<MaterialsShop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedStudentRoute>
            <StudentPanel />
          </ProtectedStudentRoute>
        }>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="classes" element={<RegularClasses />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="online-classes" element={<OnlineClasses />} />
          <Route path="fees" element={<StudentFeePayment />} />
          <Route path="certificates" element={<StudentCertificates />} />
          <Route path="profile" element={<EnhancedStudentProfile />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="events" element={<MyEvents />} />
          <Route path="settings" element={<Settings />} />
          {/* Redirect removed routes to dashboard */}
          <Route path="achievements" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="assignments" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="-classes" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="my-gallery" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="gallery" element={<Navigate to="/student/dashboard" replace />} />
        </Route>

      </Routes>
      {!isAdminRoute && !isStudentRoute && <Footer />}
    </div>
  );
};

function App() {
  useEffect(() => {
    // Initialize smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Router>
            <ScrollToTop />
            <AppLayout />
          </Router>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
