// App.tsx
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { getRoutes } from './routes';

const App: React.FC = () => {
  const routes = useRoutes(getRoutes());
  return routes;
};

export default App;
