import { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  date: yup.date().required('Date is required'),
  location: yup.string().required('Location is required'),
  category: yup.string().required('Category is required'),
  maxParticipants: yup
    .number()
    .required('Maximum participants is required')
    .min(1, 'Must be at least 1')
});

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const response = await axios.get('/api/events');
      return response.data;
    },
    enabled: isAdmin
  });

  const createEventMutation = useMutation({
    mutationFn: (values) => axios.post('/api/events', values),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-events']);
      handleClose();
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, values }) => axios.put(`/api/events/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-events']);
      handleClose();
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-events']);
    }
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      date: '',
      location: '',
      category: '',
      maxParticipants: ''
    },
    validationSchema,
    onSubmit: (values) => {
      if (selectedEvent) {
        updateEventMutation.mutate({ id: selectedEvent.id, values });
      } else {
        createEventMutation.mutate(values);
      }
    }
  });

  const handleOpen = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      formik.setValues({
        title: event.title,
        description: event.description,
        date: format(new Date(event.date), 'yyyy-MM-dd'),
        location: event.location,
        category: event.category,
        maxParticipants: event.maxParticipants
      });
    } else {
      setSelectedEvent(null);
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
    formik.resetForm();
  };

  if (!isAdmin) {
    return (
      <Container>
        <Alert severity="error">You don't have permission to access this page.</Alert>
      </Container>
    );
  }

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
          {error.response?.data?.message || 'An error occurred while fetching events'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Manage Events</Typography>
        <Button
          variant="contained"
          onClick={() => handleOpen()}
        >
          Create New Event
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Participants</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events?.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{format(new Date(event.date), 'PPP')}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.category}</TableCell>
                <TableCell>
                  {event.currentParticipants}/{event.maxParticipants}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(event)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => deleteEventMutation.mutate(event.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEvent ? 'Edit Event' : 'Create New Event'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="title"
                  label="Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="date"
                  label="Date"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="location"
                  label="Location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="category"
                  label="Category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  helperText={formik.touched.category && formik.errors.category}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="maxParticipants"
                  label="Maximum Participants"
                  type="number"
                  value={formik.values.maxParticipants}
                  onChange={formik.handleChange}
                  error={formik.touched.maxParticipants && Boolean(formik.errors.maxParticipants)}
                  helperText={formik.touched.maxParticipants && formik.errors.maxParticipants}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createEventMutation.isLoading || updateEventMutation.isLoading}
            >
              {selectedEvent ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 