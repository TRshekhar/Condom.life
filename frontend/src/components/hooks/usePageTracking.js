import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../services/analytics';

// Custom hook to track page views
const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    const pagePath = location.pathname + location.search;
    const pageTitle = document.title;
    
    analytics.pageView(pagePath, pageTitle);
  }, [location]);
};

export default usePageTracking;