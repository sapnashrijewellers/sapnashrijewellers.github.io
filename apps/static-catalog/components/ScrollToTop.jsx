import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Assuming React Router v6

/**
 * A utility component that scrolls the window to the top 
 * whenever the route changes.
 */
export default function ScrollToTop() {
  // Get the current location object from React Router
  const { pathname } = useLocation();

  useEffect(() => {
    // This code runs every time the 'pathname' changes (i.e., when navigation occurs)
    window.scrollTo(0, 0); 
    // The dependency array ensures this effect only re-runs when the path changes.
  }, [pathname]);

  // This component doesn't render anything visually
  return null; 
}