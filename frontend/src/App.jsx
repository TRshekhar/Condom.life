import { BrowserRouter as Router, Routes, Route,useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from 'react-helmet-async';
import usePageTracking from './components/hooks/usePageTracking';

//components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// pages
import Home from "./pages/Home";
import WriteReview from "./pages/WriteReview";
import Brands from "./pages/Brands";
import Stats from "./pages/Stats";


const PageTracker = () => {
  usePageTracking();
  return null;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
};


export default function App() {
  return (
    <>
      <HelmetProvider>
        <Router>
          <Toaster position="top-center" toastOptions={{
              style: {
                fontFamily: "'DM Sans', sans-serif",
                background: "#1a1a1a",
                color: "#fdf9ed",
                borderRadius: "999px",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: { iconTheme: { primary: "#e8526a", secondary: "#fff" } },
            }}
          />
          <PageTracker />
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/write" element={<WriteReview />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/stats" element={<Stats />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </HelmetProvider>
    </>
  );
}