import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

/**
 * PageTransition Component
 * Provides smooth transitions between page navigations
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 */
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fade-in');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fade-out');
    }
  }, [location, displayLocation]);

  const onAnimationEnd = () => {
    if (transitionStage === 'fade-out') {
      setTransitionStage('fade-in');
      setDisplayLocation(location);
    }
  };

  return (
    <div
      className={`page-transition ${transitionStage}`}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
};

export default PageTransition;
