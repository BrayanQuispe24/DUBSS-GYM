// src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import AppRoutes from '@/routes/AppRoutes';
import { applyDocumentPreferences, useUIStore } from '@/store/uiStore';
import '@/styles/globals.css';
import '@/styles/components.css';

function App() {
  const theme = useUIStore((state) => state.theme);
  const fontScale = useUIStore((state) => state.fontScale);

  useEffect(() => {
    applyDocumentPreferences(theme, fontScale);
  }, [theme, fontScale]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
