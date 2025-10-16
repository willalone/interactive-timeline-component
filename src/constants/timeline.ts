import type { SliderConfig, PeriodConfig } from '../types';

// Конфигурация слайдера
export const SLIDER_CONFIG: SliderConfig = {
  CARD_WIDTH: 343,
  GAP: 32,
  DRAG_THRESHOLD: 10,
  ANIMATION_DURATION: 400,
  POINTS_COUNT: 6,
  DEGREES_PER_POINT: 60,
} as const;

// Конфигурация периодов временной шкалы
export const TIMELINE_PERIODS: readonly PeriodConfig[] = [
  { id: 1, label: '—', startYear: 1985, endYear: 1986 },
  { id: 2, label: 'Кино', startYear: 1987, endYear: 1991 },
  { id: 3, label: 'Литература', startYear: 1992, endYear: 1997 },
  { id: 4, label: '', startYear: 1999, endYear: 2004 },
  { id: 5, label: '—', startYear: 2005, endYear: 2010 },
  { id: 6, label: 'Наука', startYear: 2015, endYear: 2022 },
] as const;

// События для каждого периода
export const PERIOD_EVENTS = {
  1: [
    {
      id: '1-1',
      year: 1984,
      description: 'Запуск Macintosh — персональный компьютер Apple',
    },
    {
      id: '1-2',
      year: 1986,
      description:
        'Первый международный полёт «Мир» — начало эры орбитальной станции',
    },
    {
      id: '1-3',
      year: 1988,
      description:
        'Открытие Всемирной паутины — Тим Бернерс-Ли публикует спецификацию',
    },
    {
      id: '1-4',
      year: 1990,
      description: 'Запуск телескопа «Хаббл» — начало новой астрономии',
    },
    {
      id: '1-5',
      year: 1991,
      description: 'Создание ядра Linux — старт открытой ОС',
    },
    {
      id: '1-6',
      year: 1993,
      description: 'Появление браузера Mosaic — популяризация интернета',
    },
  ],
  2: [
    {
      id: '2-1',
      year: 1987,
      description: '«Хищник» / Predator, США (реж. Джон Мактирнан)',
    },
    {
      id: '2-2',
      year: 1988,
      description:
        '«Кто подставил кролика Роджера» / Who Framed Roger Rabbit, США (реж. Роберт Земекис)',
    },
    {
      id: '2-3',
      year: 1989,
      description:
        '«Назад в будущее 2» / Back to the Future Part II, США (реж. Роберт Земекис)',
    },
    {
      id: '2-4',
      year: 1990,
      description: '«Крепкий орешек 2» / Die Hard 2, США (реж. Ренни Харлин)',
    },
    {
      id: '2-5',
      year: 1991,
      description:
        '«Семейка Аддамс» / The Addams Family, США (реж. Барри Зонненфельд)',
    },
  ],
  3: [
    {
      id: '3-1',
      year: 1992,
      description: 'Нобелевская премия по литературе — Дерек Уолкотт',
    },
    { id: '3-2', year: 1994, description: '«Бессоница» — роман Стивена Кинга' },
    {
      id: '3-3',
      year: 1995,
      description: 'Нобелевская премия по литературе — Шеймас Хини',
    },
    {
      id: '3-4',
      year: 1997,
      description: '«Гарри Поттер и философский камень» — Дж. К. Роулинг',
    },
  ],
  4: [
    {
      id: '4-1',
      year: 1999,
      description:
        'Премьера балета «Золушка» — Жан-Кристоф Майо, сценография Эрнеста Пиньона',
    },
    {
      id: '4-2',
      year: 2000,
      description: 'Возобновлено издание журнала «Театр»',
    },
    {
      id: '4-3',
      year: 2002,
      description: 'Премьера трилогии Тома Стоппарда «Берег Утопии», Лондон',
    },
    {
      id: '4-4',
      year: 2003,
      description: 'В Венеции сгорел театр «Ла Фениче» (пожар)',
    },
  ],
  5: [
    {
      id: '5-1',
      year: 2006,
      description:
        'Открытие карликовой планеты Хаумеа — уточнение понятия планеты',
    },
    {
      id: '5-2',
      year: 2008,
      description: 'Запуск Большого адронного коллайдера (LHC)',
    },
    {
      id: '5-3',
      year: 2010,
      description:
        'Создание первого синтетического генома бактерии (Venter Institute)',
    },
    {
      id: '5-4',
      year: 2011,
      description: 'Открытие бозона Хиггса подтверждено экспериментами LHC',
    },
  ],
  6: [
    {
      id: '6-1',
      year: 2015,
      description:
        '13 сентября — частное солнечное затмение, Южная Африка и Антарктида',
    },
    {
      id: '6-2',
      year: 2016,
      description: 'Телескоп «Хаббл» обнаружил далёкую галактику GN-z11',
    },
    {
      id: '6-3',
      year: 2017,
      description:
        'Компания Tesla представила электрический грузовик Tesla Semi',
    },
    {
      id: '6-4',
      year: 2018,
      description: 'Старт Solar Probe Plus для изучения Солнца',
    },
    {
      id: '6-5',
      year: 2019,
      description: 'Google объявил о 53‑кубитном квантовом компьютере',
    },
    {
      id: '6-6',
      year: 2020,
      description: 'Crew Dragon вернулся из первого пилотируемого полёта',
    },
  ],
} as const;

// Коды ошибок
export const ERROR_CODES = {
  INVALID_PERIOD_ID: 'INVALID_PERIOD_ID',
  PERIOD_CLICK_ERROR: 'PERIOD_CLICK_ERROR',
  LAYOUT_UPDATE_ERROR: 'LAYOUT_UPDATE_ERROR',
  ANIMATION_ERROR: 'ANIMATION_ERROR',
  RESIZE_ERROR: 'RESIZE_ERROR',
} as const;

// Клавиши для навигации
export const NAVIGATION_KEYS = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

// Медиа-запросы
export const MEDIA_QUERIES = {
  MOBILE: '(max-width: 768px)',
  TABLET: '(min-width: 769px) and (max-width: 1199px)',
  DESKTOP: '(min-width: 1200px)',
} as const;
