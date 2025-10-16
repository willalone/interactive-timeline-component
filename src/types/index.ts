export interface TimelineEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly year: number;
  readonly month?: string;
}

export interface TimelinePeriod {
  readonly id: string;
  readonly name: string;
  readonly startYear: number;
  readonly endYear: number;
  readonly color: string;
  readonly events: readonly TimelineEvent[];
}

export interface TimelineProps {
  readonly periods: readonly TimelinePeriod[];
  readonly className?: string;
}

export interface PeriodConfig {
  readonly id: number;
  readonly label: string;
  readonly startYear: number;
  readonly endYear: number;
}

export interface SliderEvent {
  readonly id: string;
  readonly year: number;
  readonly description: string;
}

export interface SliderState {
  readonly offset: number;
  readonly maxOffset: number;
  readonly activeIndex: number;
  readonly totalCount: number;
}

// Строгие типы для конфигурации
export interface SliderConfig {
  readonly CARD_WIDTH: number;
  readonly GAP: number;
  readonly DRAG_THRESHOLD: number;
  readonly ANIMATION_DURATION: number;
  readonly POINTS_COUNT: number;
  readonly DEGREES_PER_POINT: number;
}

// Типы для анимаций
export interface AnimationConfig {
  readonly duration: {
    readonly fast: number;
    readonly normal: number;
    readonly slow: number;
  };
  readonly ease: {
    readonly out: string;
    readonly inOut: string;
    readonly back: string;
  };
}

// Типы для медиа-запросов
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface MediaQueryState {
  readonly isMobile: boolean;
  readonly isTablet: boolean;
  readonly isDesktop: boolean;
  readonly currentBreakpoint: Breakpoint;
}

// Типы для обработки ошибок
export interface TimelineError {
  readonly code: string;
  readonly message: string;
  readonly details?: unknown;
}

export type TimelineErrorHandler = (error: TimelineError) => void;
