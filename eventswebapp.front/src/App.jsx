import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { GlobalStyles } from '@mui/material';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import EventRegistration from './pages/EventRegistration';
import MyEvents from './pages/MyEvents';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AuthWarning from './components/common/AuthWarning';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Container, CircularProgress } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          width: '100%',
          WebkitTextSizeAdjust: '100%',
          MozTextSizeAdjust: '100%',
          msTextSizeAdjust: '100%',
          textSizeAdjust: '100%',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        },
        '#root': {
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
  },
});

const globalStyles = {
  html: {
    textSizeAdjust: '100%',
    WebkitTextSizeAdjust: '100%',
    MozTextSizeAdjust: '100%',
    msTextSizeAdjust: '100%'
  },
  '@media print': {
    '*': {
      printColorAdjust: 'exact',
      WebkitPrintColorAdjust: 'exact'
    }
  }
};

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <AuthWarning />;
  }

  if (requireAdmin && !isAdmin) {
    return <AuthWarning message="You need administrator privileges to access this page" />;
  }

  return children;
};

// Redirect to login if not authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <AuthProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route 
                path="/events/:id/register" 
                element={
                  <ProtectedRoute>
                    <EventRegistration />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-events" 
                element={
                  <ProtectedRoute>
                    <MyEvents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
