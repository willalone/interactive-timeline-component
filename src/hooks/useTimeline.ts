import { useState, useCallback, useMemo } from 'react';
import type { TimelinePeriod } from '../types';

// Возвращаемые значения хука таймлайна
interface UseTimelineReturn {
  activePeriod: number;
  isAnimating: boolean;
  changePeriod: (index: number) => void;
  nextPeriod: () => void;
  prevPeriod: () => void;
  currentPeriod: TimelinePeriod | undefined;
  totalPeriods: number;
}

export const useTimeline = (
  periods: readonly TimelinePeriod[]
): UseTimelineReturn => {
  const [activePeriod, setActivePeriod] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalPeriods = useMemo(() => periods.length, [periods.length]);

  // Смена активного периода с защитой от лишних кликов во время анимации
  const changePeriod = useCallback(
    (index: number): void => {
      if (
        isAnimating ||
        index === activePeriod ||
        index < 0 ||
        index >= totalPeriods
      ) {
        return;
      }

      setIsAnimating(true);
      setActivePeriod(index);

      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    },
    [activePeriod, isAnimating, totalPeriods]
  );

  const nextPeriod = useCallback((): void => {
    const nextIndex = (activePeriod + 1) % totalPeriods;
    changePeriod(nextIndex);
  }, [activePeriod, totalPeriods, changePeriod]);

  const prevPeriod = useCallback((): void => {
    const prevIndex = activePeriod === 0 ? totalPeriods - 1 : activePeriod - 1;
    changePeriod(prevIndex);
  }, [activePeriod, totalPeriods, changePeriod]);

  const currentPeriod = useMemo(
    () => periods[activePeriod],
    [periods, activePeriod]
  );

  return {
    activePeriod,
    isAnimating,
    changePeriod,
    nextPeriod,
    prevPeriod,
    currentPeriod,
    totalPeriods,
  };
};
