import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Alert
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';

const EventList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['events', page, searchTerm, category, location, dateFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        search: searchTerm,
        category,
        location,
        date: dateFilter
      });
      const response = await axios.get(`/api/events?${params}`);
      return response.data;
    }
  });

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (isLoading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">
          {error.response?.data?.message || 'An error occurred while fetching events'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Events"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Conference">Conference</MenuItem>
                <MenuItem value="Workshop">Workshop</MenuItem>
                <MenuItem value="Seminar">Seminar</MenuItem>
                <MenuItem value="Networking">Networking</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={location}
                label="Location"
                onChange={(e) => setLocation(e.target.value)}
              >
                <MenuItem value="">All Locations</MenuItem>
                <MenuItem value="Online">Online</MenuItem>
                <MenuItem value="New York">New York</MenuItem>
                <MenuItem value="London">London</MenuItem>
                <MenuItem value="Paris">Paris</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {data?.items.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
              onClick={() => handleEventClick(event.id)}
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
                  {format(new Date(event.date), 'PPP')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.currentParticipants}/{event.maxParticipants} participants
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {data?.totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={data.totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default EventList; 