import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { Dashboard } from '../pages/Dashboard';
import { ItemsPage } from '../pages/ItemsPage';
// Place, Graph, Hooks imports kept — routes hidden for demo
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'items', element: <ItemsPage /> },
      // { path: 'place', element: <Place /> },   // hidden for demo
      // { path: 'graph', element: <Graph /> },   // hidden for demo
      // { path: 'hooks', element: <Hooks /> },   // hidden for demo
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

// Made with Bob
