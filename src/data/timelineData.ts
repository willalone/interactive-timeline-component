import { TimelinePeriod } from '../types';

// Данные для демонстрации компонента (не используются в основной логике)
// Основные данные находятся непосредственно в компоненте Timeline.tsx
export const timelineData: TimelinePeriod[] = [
  {
    id: 'demo-period',
    name: 'Демо период',
    startYear: 2020,
    endYear: 2023,
    color: '#4285F4',
    events: [
      {
        id: 'demo-event',
        title: 'Демо событие',
        description: 'Это демонстрационное событие для тестирования компонента',
        year: 2021,
        month: 'январь',
      },
    ],
  },
];
