import { TimelinePeriod } from '../types';

export const timelineData: TimelinePeriod[] = [
  {
    id: 'period-1',
    name: 'Наука',
    startYear: 2015,
    endYear: 2022,
    color: '#4285F4',
    events: [
      {
        id: 'event-1-1',
        title: 'Частное солнечное затмение',
        description: '13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды',
        year: 2015,
        month: 'сентябрь'
      },
      {
        id: 'event-1-2',
        title: 'Открытие галактики GN-z11',
        description: 'Телескоп «Хаббл» обнаружил самую удалённую из всех обнаруженных галактик, получившую обозначение GN-z11',
        year: 2016,
        month: 'март'
      },
      {
        id: 'event-1-3',
        title: 'Презентация Tesla Semi',
        description: 'Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi',
        year: 2017,
        month: 'ноябрь'
      },
      {
        id: 'event-1-4',
        title: 'Запуск Falcon Heavy',
        description: 'SpaceX успешно запустила ракету Falcon Heavy с автомобилем Tesla в качестве груза',
        year: 2018,
        month: 'февраль'
      },
      {
        id: 'event-1-5',
        title: 'Первое изображение черной дыры',
        description: 'Международная коллаборация Event Horizon Telescope получила первое изображение черной дыры',
        year: 2019,
        month: 'апрель'
      },
      {
        id: 'event-1-6',
        title: 'Запуск миссии Perseverance',
        description: 'NASA запустила марсоход Perseverance для поиска признаков древней жизни на Марсе',
        year: 2020,
        month: 'июль'
      }
    ]
  },
  {
    id: 'period-2',
    name: 'Технологии',
    startYear: 2010,
    endYear: 2017,
    color: '#34A853',
    events: [
      {
        id: 'event-2-1',
        title: 'Запуск iPad',
        description: 'Apple представила первый планшет iPad, изменивший рынок мобильных устройств',
        year: 2010,
        month: 'январь'
      },
      {
        id: 'event-2-2',
        title: 'Релиз Instagram',
        description: 'Запуск социальной сети Instagram для обмена фотографиями',
        year: 2012,
        month: 'октябрь'
      },
      {
        id: 'event-2-3',
        title: 'Презентация iPhone 5',
        description: 'Apple представила iPhone 5 с новым дизайном и увеличенным экраном',
        year: 2012,
        month: 'сентябрь'
      },
      {
        id: 'event-2-4',
        title: 'Запуск Google Glass',
        description: 'Google представила очки дополненной реальности Google Glass',
        year: 2013,
        month: 'апрель'
      },
      {
        id: 'event-2-5',
        title: 'Релиз Oculus Rift',
        description: 'Запуск первой версии шлема виртуальной реальности Oculus Rift',
        year: 2016,
        month: 'март'
      }
    ]
  },
  {
    id: 'period-3',
    name: 'Медицина',
    startYear: 2018,
    endYear: 2023,
    color: '#EA4335',
    events: [
      {
        id: 'event-3-1',
        title: 'Первый CRISPR-редактированный ребенок',
        description: 'Первый случай редактирования генов эмбриона человека с помощью CRISPR',
        year: 2018,
        month: 'ноябрь'
      },
      {
        id: 'event-3-2',
        title: 'Пандемия COVID-19',
        description: 'Начало глобальной пандемии коронавируса COVID-19',
        year: 2020,
        month: 'январь'
      },
      {
        id: 'event-3-3',
        title: 'Разработка вакцин',
        description: 'Быстрая разработка и одобрение вакцин против COVID-19',
        year: 2020,
        month: 'декабрь'
      },
      {
        id: 'event-3-4',
        title: 'Искусственное сердце',
        description: 'Успешная трансплантация полностью искусственного сердца',
        year: 2021,
        month: 'сентябрь'
      }
    ]
  }
];
