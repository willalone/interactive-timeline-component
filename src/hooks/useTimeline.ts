import { useState, useCallback, useMemo } from 'react';
import { TimelinePeriod } from '../types';

interface UseTimelineReturn {
  activePeriod: number;
  isAnimating: boolean;
  changePeriod: (index: number) => void;
  nextPeriod: () => void;
  prevPeriod: () => void;
  currentPeriod: TimelinePeriod | undefined;
  totalPeriods: number;
}

export const useTimeline = (periods: TimelinePeriod[]): UseTimelineReturn => {
  const [activePeriod, setActivePeriod] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalPeriods = useMemo(() => periods.length, [periods.length]);

  const changePeriod = useCallback((index: number) => {
    if (isAnimating || index === activePeriod || index < 0 || index >= totalPeriods) {
      return;
    }

    setIsAnimating(true);
    setActivePeriod(index);

    // Сброс состояния анимации после завершения
    setTimeout(() => {
      setIsAnimating(false);
    }, 800); // Соответствует длительности GSAP анимации
  }, [activePeriod, isAnimating, totalPeriods]);

  const nextPeriod = useCallback(() => {
    const nextIndex = (activePeriod + 1) % totalPeriods;
    changePeriod(nextIndex);
  }, [activePeriod, totalPeriods, changePeriod]);

  const prevPeriod = useCallback(() => {
    const prevIndex = activePeriod === 0 ? totalPeriods - 1 : activePeriod - 1;
    changePeriod(prevIndex);
  }, [activePeriod, totalPeriods, changePeriod]);

  const currentPeriod = useMemo(() => 
    periods[activePeriod], [periods, activePeriod]
  );

  return {
    activePeriod,
    isAnimating,
    changePeriod,
    nextPeriod,
    prevPeriod,
    currentPeriod,
    totalPeriods
  };
};