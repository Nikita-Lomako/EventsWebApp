import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showParticipants, setShowParticipants] = React.useState(false);

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
    },
    enabled: showParticipants
  });

  const registerMutation = useMutation({
    mutationFn: () => axios.post(`/api/participants`, { eventId: parseInt(id) }),
    onSuccess: () => {
      navigate(`/events/${id}/register`);
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
          {error.response?.data?.message || 'Error loading event details'}
        </Alert>
      </Container>
    );
  }

  const isFullyBooked = event.currentParticipantsCount >= event.maxParticipants;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {event.title}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Chip
                label={event.category}
                color="primary"
                sx={{ mr: 1 }}
              />
              <Chip
                label={`${event.currentParticipantsCount}/${event.maxParticipants} participants`}
                color={isFullyBooked ? 'error' : 'success'}
              />
            </Box>

            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Date and Time
                </Typography>
                <Typography variant="body1">
                  {format(new Date(event.dateTime), 'PPP p')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Venue
                </Typography>
                <Typography variant="body1">
                  {event.venue}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowParticipants(true)}
                sx={{ mr: 2 }}
              >
                View Participants
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => registerMutation.mutate()}
                disabled={isFullyBooked}
              >
                {isFullyBooked ? 'Event is Full' : 'Register Now'}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={event.imageUrl || 'https://via.placeholder.com/400x300'}
              alt={event.title}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 1
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Participants Dialog */}
      <Dialog
        open={showParticipants}
        onClose={() => setShowParticipants(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Event Participants</DialogTitle>
        <DialogContent>
          {participants?.length === 0 ? (
            <Typography>No participants yet</Typography>
          ) : (
            <List>
              {participants?.map((participant, index) => (
                <React.Fragment key={participant.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${participant.name} ${participant.surname}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {participant.email}
                          </Typography>
                          <br />
                          Registered on {format(new Date(participant.registrationDate), 'PPP')}
                        </>
                      }
                    />
                  </ListItem>
                  {index < participants.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowParticipants(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails; 