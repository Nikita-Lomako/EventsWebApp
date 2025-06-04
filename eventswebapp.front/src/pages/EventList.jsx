import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import axios from 'axios';

const EventList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['events', page, pageSize, searchTerm, selectedDate, selectedCategory, selectedVenue],
    queryFn: async () => {
      let url = '/api/events/search';
      const params = new URLSearchParams();
      
      if (selectedDate) params.append('date', format(selectedDate, 'yyyy-MM-dd'));
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedVenue) params.append('location', selectedVenue);
      
      const response = await axios.get(`${url}?${params.toString()}`);
      return {
        items: response.data,
        totalCount: response.data.length
      };
    }
  });

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handleVenueChange = (event) => {
    setSelectedVenue(event.target.value);
    setPage(1);
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
          {error.response?.data?.message || 'Error loading events'}
        </Alert>
      </Container>
    );
  }

  if (!data?.items) {
    return (
      <Container>
        <Alert severity="info">No events found</Alert>
      </Container>
    );
  }

  const categories = [...new Set(data.items.map(event => event.category))];
  const venues = [...new Set(data.items.map(event => event.venue))];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Events
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search Events"
              value={searchTerm}
              onChange={handleSearch}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Filter by Date"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{
                textField: { fullWidth: true }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Venue</InputLabel>
              <Select
                value={selectedVenue}
                label="Venue"
                onChange={handleVenueChange}
              >
                <MenuItem value="">All Venues</MenuItem>
                {venues.map(venue => (
                  <MenuItem key={venue} value={venue}>
                    {venue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Events Grid */}
        <Grid container spacing={4}>
          {data.items.map((event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
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
                  image={event.imageUrl || 'https://placehold.co/300x200'}
                  alt={event.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      label={event.category}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`${event.currentParticipantsCount}/${event.maxParticipants} participants`}
                      size="small"
                      color={event.currentParticipantsCount >= event.maxParticipants ? 'error' : 'success'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(event.dateTime), 'PPP')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.venue}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(data.totalCount / pageSize)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default EventList; 