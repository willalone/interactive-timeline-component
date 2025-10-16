import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { TimelineProps, SliderEvent } from '../types';
import { useTimeline } from '../hooks/useTimeline';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useErrorHandler } from '../hooks/useErrorHandler';
import {
  SLIDER_CONFIG,
  TIMELINE_PERIODS,
  PERIOD_EVENTS,
  ERROR_CODES,
  NAVIGATION_KEYS,
} from '../constants/timeline';
import './Timeline.scss';

// Мобильный слайдер событий
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Timeline: React.FC<TimelineProps> = ({ periods, className = '' }) => {
  const [sliderOffset, setSliderOffset] = useState<number>(0);
  const [maxSliderOffset, setMaxSliderOffset] = useState<number>(0);
  const [mobileEventIndex, setMobileEventIndex] = useState<number>(0);

  const [activePeriodId, setActivePeriodId] = useState<number>(2);
  // По умолчанию активен период 2; вычисляем угол для положения на окружности
  const [rotationAngle, setRotationAngle] = useState<number>(
    300 - (2 - 1) * SLIDER_CONFIG.DEGREES_PER_POINT
  );
  const [displayStartYear, setDisplayStartYear] = useState<number>(1987);
  const [displayEndYear, setDisplayEndYear] = useState<number>(1991);

  // Хуки
  const { isMobile } = useMediaQuery();
  const { error, handleError, clearError } = useErrorHandler();

  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const gradientOverlayRef = useRef<HTMLDivElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const yearStartRef = useRef<HTMLSpanElement>(null);
  const yearEndRef = useRef<HTMLSpanElement>(null);

  const { activePeriod } = useTimeline(periods);

  const currentPeriodData = useMemo(
    () => TIMELINE_PERIODS.find(p => p.id === activePeriodId),
    [activePeriodId]
  );

  const currentEvents = useMemo(
    (): readonly SliderEvent[] =>
      PERIOD_EVENTS[activePeriodId as keyof typeof PERIOD_EVENTS] || [],
    [activePeriodId]
  );

  // Плавный счетчик для смены годов
  const animateCounter = useCallback(
    (
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
    },
    []
  );

  const handlePeriodClick = useCallback(
    (targetId: number): void => {
      try {
        if (targetId === activePeriodId) return;

        if (targetId < 1 || targetId > SLIDER_CONFIG.POINTS_COUNT) {
          handleError({
            code: ERROR_CODES.INVALID_PERIOD_ID,
            message: `Invalid period ID: ${targetId}`,
            details: { targetId, validRange: [1, SLIDER_CONFIG.POINTS_COUNT] },
          });
          return;
        }

        const targetRotation =
          300 - (targetId - 1) * SLIDER_CONFIG.DEGREES_PER_POINT;

        setActivePeriodId(targetId);
        setRotationAngle(targetRotation);
        setSliderOffset(0);
        setMobileEventIndex(0);
        clearError();

        const selectedPeriod = TIMELINE_PERIODS.find(p => p.id === targetId);
        if (selectedPeriod) {
          animateCounter(
            displayStartYear,
            selectedPeriod.startYear,
            SLIDER_CONFIG.ANIMATION_DURATION,
            setDisplayStartYear
          );
          animateCounter(
            displayEndYear,
            selectedPeriod.endYear,
            SLIDER_CONFIG.ANIMATION_DURATION,
            setDisplayEndYear
          );
        }
      } catch (err) {
        handleError({
          code: ERROR_CODES.PERIOD_CLICK_ERROR,
          message: 'Error during period click',
          details: err,
        });
      }
    },
    [
      activePeriodId,
      displayStartYear,
      displayEndYear,
      animateCounter,
      handleError,
      clearError,
    ]
  );

  const goToNextPeriod = useCallback(() => {
    const nextId =
      activePeriodId === SLIDER_CONFIG.POINTS_COUNT ? 1 : activePeriodId + 1;
    handlePeriodClick(nextId);
  }, [activePeriodId, handlePeriodClick]);

  const goToPrevPeriod = useCallback(() => {
    const prevId =
      activePeriodId === 1 ? SLIDER_CONFIG.POINTS_COUNT : activePeriodId - 1;
    handlePeriodClick(prevId);
  }, [activePeriodId, handlePeriodClick]);

  useEffect(() => {
    setSliderOffset(0);
    setMobileEventIndex(0);
  }, [activePeriod]);

  // Расчет позиций направляющих и центра круга
  useLayoutEffect(() => {
    const SIDE_ADJUST_PX = 100;

    const updateLayout = (): void => {
      try {
        if (!containerRef.current || !gradientRef.current) return;

        containerRef.current.style.setProperty(
          '--title-shift-x',
          `${-SIDE_ADJUST_PX}px`
        );

        const measureElements = () => {
          if (!containerRef.current || !gradientRef.current) return;

          const containerRect = containerRef.current.getBoundingClientRect();
          const gradientRect = gradientRef.current.getBoundingClientRect();

          const gradientCenterX =
            gradientRect.left + window.scrollX + gradientRect.width / 2;
          const containerLeft = containerRect.left + window.scrollX;
          const offset = Math.max(
            0,
            Math.round(gradientCenterX - containerLeft)
          );

          containerRef.current.style.setProperty(
            '--side-offset',
            `${offset}px`
          );
          containerRef.current.style.setProperty(
            '--container-width',
            `${Math.round(containerRect.width)}px`
          );

          if (gradientOverlayRef.current) {
            const top =
              gradientRect.top +
              window.scrollY -
              (containerRect.top + window.scrollY);
            const left =
              gradientRect.left +
              window.scrollX -
              (containerRect.left + window.scrollX);
            gradientOverlayRef.current.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
            gradientOverlayRef.current.style.width = `${Math.round(gradientRect.width)}px`;
            gradientOverlayRef.current.style.height = `${Math.round(gradientRect.height)}px`;
          }

          if (separatorRef.current) {
            const separatorRect = separatorRef.current.getBoundingClientRect();
            const centerX =
              separatorRect.left +
              window.scrollX -
              (containerRect.left + window.scrollX) +
              separatorRect.width / 2;
            const centerY =
              separatorRect.top +
              window.scrollY -
              (containerRect.top + window.scrollY) +
              separatorRect.height / 2;
            containerRef.current.style.setProperty(
              '--circle-center-x',
              `${Math.round(centerX)}px`
            );
            containerRef.current.style.setProperty(
              '--circle-center-y',
              `${Math.round(centerY)}px`
            );
          }
        };

        requestAnimationFrame(measureElements);
      } catch (err) {
        handleError({
          code: ERROR_CODES.LAYOUT_UPDATE_ERROR,
          message: 'Error during layout update',
          details: err,
        });
      }
    };

    updateLayout();

    const handleResize = (): void => updateLayout();
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
      const totalWidth =
        currentEvents.length > 0
          ? currentEvents.length * SLIDER_CONFIG.CARD_WIDTH +
            Math.max(0, currentEvents.length - 1) * SLIDER_CONFIG.GAP
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

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
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
          const newOffset = Math.max(
            maxSliderOffset,
            Math.min(0, startOffset + delta)
          );
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

        const finalOffset = Math.max(
          maxSliderOffset,
          Math.min(0, startOffset + delta)
        );
        setSliderOffset(finalOffset);
        container.style.transition = 'none';
        container.style.transform = '';
      };

      container.setPointerCapture(e.pointerId);
      container.addEventListener('pointermove', handlePointerMove);
      container.addEventListener('pointerup', finishDrag);
      container.addEventListener('pointercancel', finishDrag);
      container.addEventListener('pointerleave', finishDrag);
    },
    [sliderOffset, maxSliderOffset]
  );

  const sliderStep = SLIDER_CONFIG.CARD_WIDTH + SLIDER_CONFIG.GAP;

  // Обработка клавиатурной навигации
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      switch (event.key) {
        case NAVIGATION_KEYS.ARROW_LEFT:
          event.preventDefault();
          goToPrevPeriod();
          break;
        case NAVIGATION_KEYS.ARROW_RIGHT:
          event.preventDefault();
          goToNextPeriod();
          break;
        case NAVIGATION_KEYS.HOME:
          event.preventDefault();
          handlePeriodClick(1);
          break;
        case NAVIGATION_KEYS.END:
          event.preventDefault();
          handlePeriodClick(SLIDER_CONFIG.POINTS_COUNT);
          break;
      }
    },
    [goToPrevPeriod, goToNextPeriod, handlePeriodClick]
  );

  return (
    <div
      className={`timeline-component ${className}`}
      ref={containerRef}
      role="region"
      aria-label="Интерактивная временная шкала"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="vertical-lines" aria-hidden="true"></div>
      <div
        className="title-gradient-overlay"
        ref={gradientOverlayRef}
        aria-hidden="true"
      ></div>

      {error && (
        <div className="error-message" role="alert" aria-live="polite">
          <p>Произошла ошибка: {error.message}</p>
          <button onClick={clearError} aria-label="Закрыть сообщение об ошибке">
            ×
          </button>
        </div>
      )}

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
                style={
                  {
                    '--ring-rotation': `${rotationAngle}deg`,
                  } as React.CSSProperties
                }
              >
                <div className="crosshair crosshair-v"></div>
                <div className="crosshair crosshair-h"></div>

                <div
                  className="orbit-dots"
                  style={
                    {
                      '--ring-rotation': `${rotationAngle}deg`,
                    } as React.CSSProperties
                  }
                >
                  {TIMELINE_PERIODS.map((period, index) => (
                    <button
                      key={period.id}
                      className={`orbit-dot ${period.id === activePeriodId ? 'active' : ''}`}
                      style={
                        {
                          '--orbit-angle': `${index * SLIDER_CONFIG.DEGREES_PER_POINT}deg`,
                        } as React.CSSProperties
                      }
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

        {/* Мобильная подпись категории под датами */}
        {isMobile &&
          currentPeriodData?.label &&
          currentPeriodData.label.trim() !== '' &&
          currentPeriodData.label.trim() !== '—' && (
            <div className="period-label" aria-hidden="false">
              {currentPeriodData.label}
            </div>
          )}

        <div className="horizontal-divider" aria-hidden="true"></div>

        <div className="events-slider">
          <div className="desktop-events">
            <div className="desktop-navigation-left">
              <div className="page-counter">
                {String(activePeriodId).padStart(2, '0')}/
                {String(SLIDER_CONFIG.POINTS_COUNT).padStart(2, '0')}
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
                {currentEvents.map(event => (
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
                onClick={() =>
                  setSliderOffset(prev =>
                    Math.max(maxSliderOffset, prev - sliderStep)
                  )
                }
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
              spaceBetween={16}
              slidesPerView={1}
              centeredSlides={false}
              pagination={{
                clickable: true,
                bulletClass: 'pagination-dot',
                bulletActiveClass: 'pagination-dot active',
              }}
              onSlideChange={swiper => setMobileEventIndex(swiper.activeIndex)}
              className="mobile-swiper"
              breakpoints={{
                768: {
                  slidesPerView: 1,
                  spaceBetween: 16,
                },
                320: {
                  slidesPerView: 1,
                  spaceBetween: 16,
                },
              }}
            >
              {currentEvents.map(event => (
                <SwiperSlide key={event.id}>
                  <div className="mobile-event-card active">
                    <div className="mobile-event-year">{event.year}</div>
                    <div className="mobile-event-description">
                      {event.description}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mobile-navigation">
              <div className="mobile-navigation-left">
                <div className="page-counter">
                  {String(activePeriodId).padStart(2, '0')}/
                  {String(SLIDER_CONFIG.POINTS_COUNT).padStart(2, '0')}
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
                {TIMELINE_PERIODS.map(period => (
                  <button
                    key={period.id}
                    className={`period-dot ${period.id === activePeriodId ? 'active' : ''}`}
                    onClick={() => handlePeriodClick(period.id)}
                    aria-label={`Выбрать период ${period.id}`}
                  ></button>
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
