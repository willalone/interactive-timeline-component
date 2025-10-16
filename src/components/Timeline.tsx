import React, { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from 'react';
import { TimelineProps } from '../types';
import { useTimeline } from '../hooks/useTimeline';
import './Timeline.scss';

// Мобильный слайдер событий
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TIMELINE_PERIODS = [
  { id: 1, label: '—', startYear: 1985, endYear: 1986 },
  { id: 2, label: 'Кино', startYear: 1987, endYear: 1991 },
  { id: 3, label: 'Литература', startYear: 1992, endYear: 1997 },
  { id: 4, label: '', startYear: 1999, endYear: 2004 },
  { id: 5, label: '—', startYear: 2005, endYear: 2010 },
  { id: 6, label: 'Наука', startYear: 2015, endYear: 2022 }
];

const PERIOD_EVENTS = {
  1: [
    { id: '1-1', year: 1984, description: 'Запуск Macintosh — персональный компьютер Apple' },
    { id: '1-2', year: 1986, description: 'Первый международный полёт «Мир» — начало эры орбитальной станции' },
    { id: '1-3', year: 1988, description: 'Открытие Всемирной паутины — Тим Бернерс-Ли публикует спецификацию' },
    { id: '1-4', year: 1990, description: 'Запуск телескопа «Хаббл» — начало новой астрономии' },
    { id: '1-5', year: 1991, description: 'Создание ядра Linux — старт открытой ОС' },
    { id: '1-6', year: 1993, description: 'Появление браузера Mosaic — популяризация интернета' },
  ],
  2: [
    { id: '2-1', year: 1987, description: '«Хищник» / Predator, США (реж. Джон Мактирнан)' },
    { id: '2-2', year: 1988, description: '«Кто подставил кролика Роджера» / Who Framed Roger Rabbit, США (реж. Роберт Земекис)' },
    { id: '2-3', year: 1989, description: '«Назад в будущее 2» / Back to the Future Part II, США (реж. Роберт Земекис)' },
    { id: '2-4', year: 1990, description: '«Крепкий орешек 2» / Die Hard 2, США (реж. Ренни Харлин)' },
    { id: '2-5', year: 1991, description: '«Семейка Аддамс» / The Addams Family, США (реж. Барри Зонненфельд)' },
  ],
  3: [
    { id: '3-1', year: 1992, description: 'Нобелевская премия по литературе — Дерек Уолкотт' },
    { id: '3-2', year: 1994, description: '«Бессоница» — роман Стивена Кинга' },
    { id: '3-3', year: 1995, description: 'Нобелевская премия по литературе — Шеймас Хини' },
    { id: '3-4', year: 1997, description: '«Гарри Поттер и философский камень» — Дж. К. Роулинг' },
  ],
  4: [
    { id: '4-1', year: 1999, description: 'Премьера балета «Золушка» — Жан-Кристоф Майо, сценография Эрнеста Пиньона' },
    { id: '4-2', year: 2000, description: 'Возобновлено издание журнала «Театр»' },
    { id: '4-3', year: 2002, description: 'Премьера трилогии Тома Стоппарда «Берег Утопии», Лондон' },
    { id: '4-4', year: 2003, description: 'В Венеции сгорел театр «Ла Фениче» (пожар)' },
  ],
  5: [
    { id: '5-1', year: 2006, description: 'Открытие карликовой планеты Хаумеа — уточнение понятия планеты' },
    { id: '5-2', year: 2008, description: 'Запуск Большого адронного коллайдера (LHC)' },
    { id: '5-3', year: 2010, description: 'Создание первого синтетического генома бактерии (Venter Institute)' },
    { id: '5-4', year: 2011, description: 'Открытие бозона Хиггса подтверждено экспериментами LHC' },
  ],
  6: [
    { id: '6-1', year: 2015, description: '13 сентября — частное солнечное затмение, Южная Африка и Антарктида' },
    { id: '6-2', year: 2016, description: 'Телескоп «Хаббл» обнаружил далёкую галактику GN-z11' },
    { id: '6-3', year: 2017, description: 'Компания Tesla представила электрический грузовик Tesla Semi' },
    { id: '6-4', year: 2018, description: 'Старт Solar Probe Plus для изучения Солнца' },
    { id: '6-5', year: 2019, description: 'Google объявил о 53‑кубитном квантовом компьютере' },
    { id: '6-6', year: 2020, description: 'Crew Dragon вернулся из первого пилотируемого полёта' },
  ],
};

const SLIDER_CONFIG = {
  CARD_WIDTH: 343,
  GAP: 32,
  DRAG_THRESHOLD: 10,
  ANIMATION_DURATION: 400,
  POINTS_COUNT: 6,
  DEGREES_PER_POINT: 60
} as const;

const Timeline: React.FC<TimelineProps> = ({ periods, className = '' }) => {
  const [sliderOffset, setSliderOffset] = useState(0);
  const [maxSliderOffset, setMaxSliderOffset] = useState(0);
  const [mobileEventIndex, setMobileEventIndex] = useState(0);
  
  const [activePeriodId, setActivePeriodId] = useState<number>(2);
  // По умолчанию активен период 2; вычисляем угол для положения на окружности
  const [rotationAngle, setRotationAngle] = useState<number>(300 - ((2 - 1) * SLIDER_CONFIG.DEGREES_PER_POINT));
  const [displayStartYear, setDisplayStartYear] = useState<number>(1987);
  const [displayEndYear, setDisplayEndYear] = useState<number>(1991);

  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const gradientOverlayRef = useRef<HTMLDivElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const yearStartRef = useRef<HTMLSpanElement>(null);
  const yearEndRef = useRef<HTMLSpanElement>(null);

  const { activePeriod, isAnimating, nextPeriod, prevPeriod, currentPeriod } = useTimeline(periods);

  const currentPeriodData = useMemo(() => 
    TIMELINE_PERIODS.find(p => p.id === activePeriodId), [activePeriodId]
  );

  const currentEvents = useMemo(() => 
    PERIOD_EVENTS[activePeriodId as keyof typeof PERIOD_EVENTS] || [], [activePeriodId]
  );

  // Плавный счетчик для смены годов
  const animateCounter = useCallback((
    from: number,
    to: number,
    duration: number,
    onUpdate: (value: number) => void,
    onComplete?: () => void
  ) => {
    const startTime = performance.now();
    
    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.round(from + (to - from) * progress);
      
      onUpdate(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else if (onComplete) {
        onComplete();
      }
    };
    
    requestAnimationFrame(updateCounter);
  }, []);

  const handlePeriodClick = useCallback((targetId: number) => {
    if (targetId === activePeriodId) return;

    const targetRotation = 300 - ((targetId - 1) * SLIDER_CONFIG.DEGREES_PER_POINT);
    
    setActivePeriodId(targetId);
    setRotationAngle(targetRotation);
    setSliderOffset(0);
    setMobileEventIndex(0);

    const selectedPeriod = TIMELINE_PERIODS.find(p => p.id === targetId);
    if (selectedPeriod) {
      animateCounter(displayStartYear, selectedPeriod.startYear, SLIDER_CONFIG.ANIMATION_DURATION, setDisplayStartYear);
      animateCounter(displayEndYear, selectedPeriod.endYear, SLIDER_CONFIG.ANIMATION_DURATION, setDisplayEndYear);
    }
  }, [activePeriodId, displayStartYear, displayEndYear, animateCounter]);

  const goToNextPeriod = useCallback(() => {
    const nextId = activePeriodId === SLIDER_CONFIG.POINTS_COUNT ? 1 : activePeriodId + 1;
    handlePeriodClick(nextId);
  }, [activePeriodId, handlePeriodClick]);

  const goToPrevPeriod = useCallback(() => {
    const prevId = activePeriodId === 1 ? SLIDER_CONFIG.POINTS_COUNT : activePeriodId - 1;
    handlePeriodClick(prevId);
  }, [activePeriodId, handlePeriodClick]);

  const handleNextMobileEvent = useCallback(() => {
    if (currentEvents.length === 0) return;
    setMobileEventIndex(prev => (prev + 1) % currentEvents.length);
  }, [currentEvents.length]);

  const handlePrevMobileEvent = useCallback(() => {
    if (currentEvents.length === 0) return;
    setMobileEventIndex(prev => (prev - 1 + currentEvents.length) % currentEvents.length);
  }, [currentEvents.length]);

  useEffect(() => {
    setSliderOffset(0);
    setMobileEventIndex(0);
  }, [activePeriod]);

  // Расчет позиций направляющих и центра круга
  useLayoutEffect(() => {
    const SIDE_ADJUST_PX = 100;
    
    const updateLayout = () => {
      if (!containerRef.current || !gradientRef.current) return;
      
      containerRef.current.style.setProperty('--title-shift-x', `${-SIDE_ADJUST_PX}px`);
      
      const measureElements = () => {
        if (!containerRef.current || !gradientRef.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const gradientRect = gradientRef.current.getBoundingClientRect();
        
        const gradientCenterX = (gradientRect.left + window.scrollX) + gradientRect.width / 2;
        const containerLeft = containerRect.left + window.scrollX;
        const offset = Math.max(0, Math.round(gradientCenterX - containerLeft));
        
        containerRef.current.style.setProperty('--side-offset', `${offset}px`);
        containerRef.current.style.setProperty('--container-width', `${Math.round(containerRect.width)}px`);

        if (gradientOverlayRef.current) {
          const top = (gradientRect.top + window.scrollY) - (containerRect.top + window.scrollY);
          const left = (gradientRect.left + window.scrollX) - (containerRect.left + window.scrollX);
          gradientOverlayRef.current.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
          gradientOverlayRef.current.style.width = `${Math.round(gradientRect.width)}px`;
          gradientOverlayRef.current.style.height = `${Math.round(gradientRect.height)}px`;
        }

        if (separatorRef.current) {
          const separatorRect = separatorRef.current.getBoundingClientRect();
          const centerX = (separatorRect.left + window.scrollX) - (containerRect.left + window.scrollX) + separatorRect.width / 2;
          const centerY = (separatorRect.top + window.scrollY) - (containerRect.top + window.scrollY) + separatorRect.height / 2;
          containerRef.current.style.setProperty('--circle-center-x', `${Math.round(centerX)}px`);
          containerRef.current.style.setProperty('--circle-center-y', `${Math.round(centerY)}px`);
        }
      };
      
      requestAnimationFrame(measureElements);
    };

    updateLayout();

    const handleResize = () => updateLayout();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const resizeObserver = new ResizeObserver(() => updateLayout());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (gradientRef.current) resizeObserver.observe(gradientRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  // Границы горизонтального слайдера
  useLayoutEffect(() => {
    const calculateSliderBounds = () => {
      const viewportEl = viewportRef.current;
      if (!viewportEl) return;
      
      const visibleWidth = viewportEl.clientWidth;
      const totalWidth = currentEvents.length > 0 
        ? (currentEvents.length * SLIDER_CONFIG.CARD_WIDTH + Math.max(0, currentEvents.length - 1) * SLIDER_CONFIG.GAP) 
        : 0;
      const minOffset = Math.min(0, visibleWidth - totalWidth);
      
      setMaxSliderOffset(minOffset);
      setSliderOffset(prev => Math.max(minOffset, Math.min(0, prev)));
    };
    
    calculateSliderBounds();
    
    const handleResize = () => calculateSliderBounds();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [currentEvents.length]);

  useEffect(() => {
    if (!eventsRef.current) return;
    eventsRef.current.style.transition = 'none';
    eventsRef.current.style.transform = `translateX(${sliderOffset}px)`;
  }, [sliderOffset]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const container = e.currentTarget as HTMLDivElement;
    const startX = e.clientX;
    let delta = 0;
    let isDragging = false;
    const startOffset = sliderOffset;
    
    container.style.transition = 'none';
    
    const handlePointerMove = (me: PointerEvent) => {
      delta = me.clientX - startX;
      const DRAG_START_THRESHOLD = SLIDER_CONFIG.DRAG_THRESHOLD;
      
      if (!isDragging && Math.abs(delta) > DRAG_START_THRESHOLD) {
        isDragging = true;
      }
      
      if (isDragging) {
        const newOffset = Math.max(maxSliderOffset, Math.min(0, startOffset + delta));
        container.style.transform = `translateX(${newOffset}px)`;
      }
    };
    
    const finishDrag = () => {
      container.releasePointerCapture(e.pointerId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', finishDrag);
      container.removeEventListener('pointercancel', finishDrag);
      container.removeEventListener('pointerleave', finishDrag);
      
      if (!isDragging) {
        container.style.transition = 'none';
        container.style.transform = '';
        return;
      }
      
      const finalOffset = Math.max(maxSliderOffset, Math.min(0, startOffset + delta));
      setSliderOffset(finalOffset);
      container.style.transition = 'none';
      container.style.transform = '';
    };
    
    container.setPointerCapture(e.pointerId);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerup', finishDrag);
    container.addEventListener('pointercancel', finishDrag);
    container.addEventListener('pointerleave', finishDrag);
  }, [sliderOffset, maxSliderOffset]);

  const currentMobileEvent = currentEvents[mobileEventIndex];
  const sliderStep = SLIDER_CONFIG.CARD_WIDTH + SLIDER_CONFIG.GAP;

  return (
    <div className={`timeline-component ${className}`} ref={containerRef}>
      <div className="vertical-lines" aria-hidden="true"></div>
      <div className="title-gradient-overlay" ref={gradientOverlayRef} aria-hidden="true"></div>

      <div className="timeline-content">
        <div className="timeline-header">
          <div className="title-section">
            <div className="title-gradient" ref={gradientRef}></div>
            <h1 className="main-title">
              <span>Исторические</span>
              <span>даты</span>
            </h1>
          </div>
        </div>

        <div className="years-section">
          <div className="year-container">
            <span className="year year-start" ref={yearStartRef}>
              {displayStartYear}
            </span>
            
            <div className="year-separator" ref={separatorRef}>
              <div 
                className="separator-circle enlarged" 
                style={{ ['--ring-rotation' as any]: `${rotationAngle}deg` }}
              >
                <div className="crosshair crosshair-v"></div>
                <div className="crosshair crosshair-h"></div>

                <div 
                  className="orbit-dots" 
                  style={{ ['--ring-rotation' as any]: `${rotationAngle}deg` }}
                >
                  {TIMELINE_PERIODS.map((period, index) => (
                    <button
                      key={period.id}
                      className={`orbit-dot ${period.id === activePeriodId ? 'active' : ''}`}
                      style={{ ['--orbit-angle' as any]: `${index * SLIDER_CONFIG.DEGREES_PER_POINT}deg` }}
                      onClick={() => handlePeriodClick(period.id)}
                      aria-label={`Выбрать период ${period.id}`}
                    >
                      <span className="dot-label">{period.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <span className="year year-end" ref={yearEndRef}>
              {displayEndYear}
            </span>
          </div>
        </div>

        <div className="horizontal-divider" aria-hidden="true"></div>

        <div className="events-slider">
          <div className="desktop-events">
            <div className="desktop-navigation-left">
              <div className="page-counter">
                {String(activePeriodId).padStart(2, '0')}/{String(SLIDER_CONFIG.POINTS_COUNT).padStart(2, '0')}
              </div>
              <div className="nav-buttons">
                <button 
                  className="nav-button prev-button" 
                  onClick={goToPrevPeriod}
                  aria-label="Предыдущий период"
                >
                  <span>&lt;</span>
                </button>
                <button 
                  className="nav-button next-button" 
                  onClick={goToNextPeriod}
                  aria-label="Следующий период"
                >
                  <span>&gt;</span>
                </button>
              </div>
            </div>

            <div className="events-viewport" ref={viewportRef}>
              <div 
                className="events-container" 
                ref={eventsRef}
                onPointerDown={handlePointerDown}
              >
                {currentEvents.map((event) => (
                  <div key={event.id} className="event-card">
                    <div className="event-year">{event.year}</div>
                    <div className="event-description">{event.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="desktop-navigation-right">
              <button 
                className="nav-button next-button" 
                onClick={() => setSliderOffset(prev => Math.max(maxSliderOffset, prev - sliderStep))}
                disabled={sliderOffset <= maxSliderOffset}
                aria-label="Прокрутить слайдер вправо"
              >
                <span>&gt;</span>
              </button>
            </div>
          </div>

          <div className="mobile-events">
            <Swiper
              modules={[Pagination]}
              spaceBetween={32}
              slidesPerView={1.2}
              centeredSlides={false}
              pagination={{
                clickable: true,
                bulletClass: 'pagination-dot',
                bulletActiveClass: 'pagination-dot active',
              }}
              onSlideChange={(swiper) => setMobileEventIndex(swiper.activeIndex)}
              className="mobile-swiper"
              breakpoints={{
                768: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                320: {
                  slidesPerView: 1.2,
                  spaceBetween: 32,
                }
              }}
            >
              {currentEvents.map((event) => (
                <SwiperSlide key={event.id}>
                  <div className="mobile-event-card active">
                    <div className="mobile-event-year">{event.year}</div>
                    <div className="mobile-event-description">{event.description}</div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mobile-navigation">
              <div className="mobile-navigation-left">
                <div className="page-counter">
                  {String(activePeriodId).padStart(2, '0')}/{String(SLIDER_CONFIG.POINTS_COUNT).padStart(2, '0')}
                </div>
                <div className="nav-buttons">
                  <button 
                    className="nav-button prev-button" 
                    onClick={goToPrevPeriod}
                    aria-label="Предыдущий период"
                  >
                    <span>&lt;</span>
                  </button>
                  <button 
                    className="nav-button next-button" 
                    onClick={goToNextPeriod}
                    aria-label="Следующий период"
                  >
                    <span>&gt;</span>
                  </button>
                </div>
              </div>
              
              <div className="mobile-period-dots">
                {TIMELINE_PERIODS.map((period) => (
                  <button
                    key={period.id}
                    className={`period-dot ${period.id === activePeriodId ? 'active' : ''}`}
                    onClick={() => handlePeriodClick(period.id)}
                    aria-label={`Выбрать период ${period.id}`}
                  >
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;