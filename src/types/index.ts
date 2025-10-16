export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  year: number;
  month?: string;
}

export interface TimelinePeriod {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  color: string;
  events: TimelineEvent[];
}

export interface TimelineProps {
  periods: TimelinePeriod[];
  className?: string;
}

export interface PeriodConfig {
  id: number;
  label: string;
  startYear: number;
  endYear: number;
}

export interface SliderEvent {
  id: string;
  year: number;
  description: string;
}

export interface SliderState {
  offset: number;
  maxOffset: number;
  activeIndex: number;
  totalCount: number;
}