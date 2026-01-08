import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SearchPage, ImportPage } from './pages';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Navigation component.
 */
function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-600">
            Comercial Comarapa
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/')
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Buscar
          </Link>
          <Link
            to="/import"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/import')
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Importar
          </Link>
        </div>
      </div>
    </nav>
  );
}

/**
 * Main application component.
 * Sets up Error Boundary, React Query provider, Router, and renders pages.
 */
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navigation />
            <main className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/import" element={<ImportPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
