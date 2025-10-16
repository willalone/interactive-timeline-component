import { gsap } from 'gsap';

const ANIMATION_CONFIG = {
  duration: {
    fast: 0.3,
    normal: 0.8,
    slow: 1.5
  },
  ease: {
    out: 'power2.out',
    inOut: 'power2.inOut',
    back: 'back.out(1.7)'
  }
} as const;

/**
 * Пульсация элемента - быстрое увеличение и возврат к исходному размеру
 */
export const pulse = (element: HTMLElement): void => {
  gsap.to(element, {
    scale: 1.1,
    duration: ANIMATION_CONFIG.duration.fast,
    ease: ANIMATION_CONFIG.ease.inOut,
    yoyo: true,
    repeat: 1
  });
};

export const fadeInUp = (element: HTMLElement, delay: number = 0): void => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 50 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      ease: ANIMATION_CONFIG.ease.out, 
      delay 
    }
  );
};

export const scaleIn = (element: HTMLElement, delay: number = 0): void => {
  gsap.fromTo(
    element,
    { scale: 0, rotation: -180 },
    { 
      scale: 1, 
      rotation: 0, 
      duration: ANIMATION_CONFIG.duration.slow, 
      ease: ANIMATION_CONFIG.ease.back, 
      delay 
    }
  );
};

export const rotate = (element: HTMLElement, angle: number, duration: number = 0.8): void => {
  gsap.to(element, {
    rotation: `+=${angle}`,
    duration,
    ease: ANIMATION_CONFIG.ease.inOut
  });
};

export const slideInFromLeft = (element: HTMLElement, delay: number = 0): void => {
  gsap.fromTo(
    element,
    { opacity: 0, x: -100 },
    { 
      opacity: 1, 
      x: 0, 
      duration: ANIMATION_CONFIG.duration.normal, 
      ease: ANIMATION_CONFIG.ease.out, 
      delay 
    }
  );
};

export const slideInFromRight = (element: HTMLElement, delay: number = 0): void => {
  gsap.fromTo(
    element,
    { opacity: 0, x: 100 },
    { 
      opacity: 1, 
      x: 0, 
      duration: ANIMATION_CONFIG.duration.normal, 
      ease: ANIMATION_CONFIG.ease.out, 
      delay 
    }
  );
};

export const bounceIn = (element: HTMLElement): void => {
  gsap.fromTo(
    element,
    { scale: 0, opacity: 0 },
    { 
      scale: 1, 
      opacity: 1, 
      duration: 0.6, 
      ease: ANIMATION_CONFIG.ease.back 
    }
  );
};

export const staggerIn = (elements: HTMLElement[], staggerDelay: number = 0.1): void => {
  gsap.fromTo(
    elements,
    { opacity: 0, y: 30 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      ease: ANIMATION_CONFIG.ease.out,
      stagger: staggerDelay
    }
  );
};