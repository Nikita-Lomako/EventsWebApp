import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          py: 4,
          backgroundColor: (theme) => theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout; 