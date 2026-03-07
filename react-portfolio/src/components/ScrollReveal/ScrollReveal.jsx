import React from 'react';
import { useFadeIn } from '../../hooks/useAnimations';
import './ScrollReveal.css';

/**
 * ScrollReveal Component
 * Reveals children with animation when they enter the viewport
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to reveal
 * @param {string} props.animation - Animation type: 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'scale', 'rotate'
 * @param {number} props.delay - Delay before animation starts (ms)
 * @param {number} props.threshold - Intersection observer threshold (0-1)
 * @param {boolean} props.once - Trigger animation only once
 * @param {string} props.className - Additional CSS classes
 */
const ScrollReveal = ({
  children,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
  once = true,
  className = ''
}) => {
  const [ref, isVisible] = useFadeIn({ threshold, once });

  const animationClasses = {
    'fade-up': 'animate-fade-up',
    'fade-down': 'animate-fade-down',
    'fade-left': 'animate-fade-left',
    'fade-right': 'animate-fade-right',
    'scale': 'animate-scale',
    'scale-bounce': 'animate-scale-bounce',
    'rotate': 'animate-rotate',
    'slide-up': 'animate-slide-up',
    'slide-down': 'animate-slide-down',
    'bounce-in': 'animate-bounce-in'
  };

  const animationClass = animationClasses[animation] || animationClasses['fade-up'];

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? `visible ${animationClass}` : ''} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
