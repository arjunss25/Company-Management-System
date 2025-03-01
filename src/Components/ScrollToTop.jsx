import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate scroll reset without animation
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
