import { useState, useEffect, useRef } from 'react';

/**
 * Hook for fade-in animation triggered by scroll (Intersection Observer)
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection threshold (0-1)
 * @param {boolean} options.once - Trigger animation only once
 * @returns {Array} [ref, isVisible] - Ref to attach to element and visibility state
 */
export function useFadeIn(options = {}) {
  const { threshold = 0.1, once = true } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: immediately show content
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  return [ref, isVisible];
}

/**
 * Hook for generating staggered animation delays
 * @param {number} count - Number of items to stagger
 * @param {number} delay - Delay between each item in ms
 * @returns {Array} Array of style objects with transitionDelay
 */
export function useStagger(count, delay = 100) {
  return Array.from({ length: count }, (_, i) => ({
    transitionDelay: `${i * delay}ms`,
    animationDelay: `${i * delay}ms`
  }));
}

/**
 * Hook for parallax scroll effect
 * @param {number} speed - Parallax speed multiplier (0-1 for slower, >1 for faster)
 * @returns {number} Current offset value
 */
export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    // Set initial offset
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return offset;
}

/**
 * Hook for count-up animation
 * @param {number} target - Target number to count to
 * @param {number} duration - Animation duration in ms
 * @param {number} start - Starting number
 * @returns {Array} [count, setIsActive] - Current count and activation function
 */
export function useCountUp(target, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const startTime = Date.now();
    const startValue = start;
    const endValue = target;
    const totalChange = endValue - startValue;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + totalChange * easeOut;

      setCount(Math.floor(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [isActive, target, duration, start]);

  return [count, setIsActive];
}

/**
 * Hook for detecting if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for scroll progress indicator
 * @returns {number} Scroll progress (0-100)
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setProgress(Math.min(Math.max(scrollPercent, 0), 100));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return progress;
}

/**
 * Hook for mouse position tracking
 * @returns {Object} {x, y} - Mouse coordinates
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return position;
}

/**
 * Hook for element hover state
 * @returns {Array} [ref, isHovered] - Ref and hover state
 */
export function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return [ref, isHovered];
}
