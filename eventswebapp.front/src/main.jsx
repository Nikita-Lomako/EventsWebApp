import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import App from './App';
import './index.css';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5159';
axios.defaults.baseURL = 'https://localhost:7154'; // Äëÿ HTTPS
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
