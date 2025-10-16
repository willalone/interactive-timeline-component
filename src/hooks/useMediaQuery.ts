import { useState, useEffect } from 'react';
import type { MediaQueryState, Breakpoint } from '../types';

/**
 * Хук для отслеживания медиа-запросов и определения текущего breakpoint
 */
export const useMediaQuery = (): MediaQueryState => {
  const [mediaQueryState, setMediaQueryState] = useState<MediaQueryState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    currentBreakpoint: 'desktop',
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const tabletQuery = window.matchMedia(
      '(min-width: 769px) and (max-width: 1199px)'
    );
    const desktopQuery = window.matchMedia('(min-width: 1200px)');

    const updateMediaQueryState = (): void => {
      const isMobile = mobileQuery.matches;
      const isTablet = tabletQuery.matches;
      const isDesktop = desktopQuery.matches;

      let currentBreakpoint: Breakpoint = 'desktop';
      if (isMobile) currentBreakpoint = 'mobile';
      else if (isTablet) currentBreakpoint = 'tablet';

      setMediaQueryState({
        isMobile,
        isTablet,
        isDesktop,
        currentBreakpoint,
      });
    };

    // Инициализация
    updateMediaQueryState();

    // Добавляем слушатели
    mobileQuery.addEventListener('change', updateMediaQueryState);
    tabletQuery.addEventListener('change', updateMediaQueryState);
    desktopQuery.addEventListener('change', updateMediaQueryState);

    // Очистка слушателей
    return () => {
      mobileQuery.removeEventListener('change', updateMediaQueryState);
      tabletQuery.removeEventListener('change', updateMediaQueryState);
      desktopQuery.removeEventListener('change', updateMediaQueryState);
    };
  }, []);

  return mediaQueryState;
};
