import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'styled-components';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import { AppProvider } from '@/context/AppContext';
import { apolloClient } from '@/services/apolloClient';
import { router } from '@/routes';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <AppProvider>
            <RouterProvider router={router} />
          </AppProvider>
        </ThemeProvider>
      </ApolloProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Made with Bob
