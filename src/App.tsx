import React from 'react';
import Timeline from './components/Timeline';
import { timelineData } from './data/timelineData';
import './App.scss';

const App: React.FC = () => {
  return (
    <div className="app">
      <Timeline periods={timelineData} />
    </div>
  );
};

export default App;
