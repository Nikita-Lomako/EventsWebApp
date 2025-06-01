import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await axios.get(`/api/events/${id}`);
      return response.data;
    }
  });

  const { data: participants } = useQuery({
    queryKey: ['event-participants', id],
    queryFn: async () => {
      const response = await axios.get(`/api/participants/event/${id}`);
      return response.data;
    }
  });

  const registerMutation = useMutation({
    mutationFn: () => axios.post('/api/participants', { eventId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries(['event', id]);
      queryClient.invalidateQueries(['event-participants', id]);
    }
  });

  const cancelRegistrationMutation = useMutation({
    mutationFn: () => axios.delete(`/api/participants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['event', id]);
      queryClient.invalidateQueries(['event-participants', id]);
    }
  });

  const isRegistered = participants?.some(p => p.userId === user?.id);
  const isFull = event?.currentParticipants >= event?.maxParticipants;

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
          {error.response?.data?.message || 'An error occurred while fetching event details'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {event.title}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={event.category}
                sx={{ mr: 1 }}
              />
              <Chip
                label={event.location}
              />
            </Box>
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Date and Time
                </Typography>
                <Typography variant="body1">
                  {format(new Date(event.date), 'PPP p')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Participants
                </Typography>
                <Typography variant="body1">
                  {event.currentParticipants}/{event.maxParticipants}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Registration
            </Typography>
            {isAuthenticated ? (
              <>
                {isRegistered ? (
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={() => cancelRegistrationMutation.mutate()}
                    disabled={cancelRegistrationMutation.isLoading}
                  >
                    Cancel Registration
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => registerMutation.mutate()}
                    disabled={registerMutation.isLoading || isFull}
                  >
                    {isFull ? 'Event is Full' : 'Register for Event'}
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/login')}
              >
                Login to Register
              </Button>
            )}
          </Paper>

          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Participants
            </Typography>
            <List>
              {participants?.map((participant) => (
                <ListItem key={participant.id}>
                  <ListItemText
                    primary={`${participant.name} ${participant.surname}`}
                    secondary={format(new Date(participant.registrationDate), 'PPP')}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventDetails; 