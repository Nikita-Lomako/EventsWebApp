import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format, isValid } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const MyEvents = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['my-events'],
    queryFn: async () => {
      const response = await axios.get('/api/participants/user');
      return response.data;
    },
    enabled: !!user
  });

  const cancelRegistrationMutation = useMutation({
    mutationFn: (participantId) => axios.delete(`/api/participants/${participantId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-events']);
    }
  });

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) {
        return 'Invalid date';
      }
      return format(date, 'PPP');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

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
          {error.response?.data?.message || 'An error occurred while fetching your events'}
        </Alert>
      </Container>
    );
  }

  if (!events?.length) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            You haven't registered for any events yet
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/events')}
            sx={{ mt: 2 }}
          >
            Browse Events
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Events
      </Typography>
      <Grid container spacing={4}>
        {events.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={event.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={event.title}
                sx={{ cursor: 'pointer' }}
                onClick={() => handleEventClick(event.id)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={event.category}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={event.location}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(event.date)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {event.currentParticipants}/{event.maxParticipants} participants
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => cancelRegistrationMutation.mutate(event.id)}
                  disabled={cancelRegistrationMutation.isLoading}
                >
                  Cancel Registration
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyEvents; 