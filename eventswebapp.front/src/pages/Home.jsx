import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';

const Home = () => {
  const navigate = useNavigate();

  const { data: featuredEvents, isLoading, error } = useQuery({
    queryKey: ['featured-events'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/events?page=1&pageSize=3');
        return response.data?.items || [];
      } catch (error) {
        console.error('Error fetching featured events:', error);
        return [];
      }
    }
  });

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">
          {error.response?.data?.message || 'An error occurred while fetching featured events'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          textAlign: 'center'
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          color="text.primary"
          gutterBottom
        >
          Welcome to Events Web App
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover and join exciting events in your area. From conferences to workshops,
          find the perfect event for you.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/events')}
          sx={{ mt: 2 }}
        >
          Browse Events
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Featured Events
      </Typography>

      <Grid container spacing={4}>
        {featuredEvents?.map((event) => (
          <Grid item key={event.id} xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={event.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={event.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(event.date), 'PPP')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.location}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 