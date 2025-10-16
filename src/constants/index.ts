export const SLIDER_CONFIG = {
  CARD_WIDTH: 343,
  GAP: 32,
  DRAG_THRESHOLD: 10,
  ANIMATION_DURATION: 400,
  POINTS_COUNT: 6,
  DEGREES_PER_POINT: 60,
  SCROLL_STEP: 343 + 32
} as const;

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200
} as const;

export const ANIMATION_SETTINGS = {
  FAST: 300,
  NORMAL: 800,
  SLOW: 1200,
  FADE_IN: 1000,
  PULSE: 600
} as const;

export const CSS_VARIABLES = {
  PRIMARY_COLOR: '--primary-color',
  SECONDARY_COLOR: '--secondary-color',
  BACKGROUND_COLOR: '--background-color',
  TEXT_COLOR: '--text-color',
  ACCENT_COLOR: '--accent-color'
} as const;

export const ARIA_LABELS = {
  PREV_PERIOD: 'Предыдущий период',
  NEXT_PERIOD: 'Следующий период',
  PREV_EVENT: 'Предыдущее событие',
  NEXT_EVENT: 'Следующее событие',
  SELECT_PERIOD: 'Выбрать период',
  GO_TO_EVENT: 'Перейти к событию',
  SCROLL_SLIDER: 'Прокрутить слайдер'
} as const;