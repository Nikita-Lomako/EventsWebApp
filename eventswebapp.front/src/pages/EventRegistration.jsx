import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .max(50, 'Name must not exceed 50 characters'),
  surname: Yup.string()
    .required('Surname is required')
    .max(50, 'Surname must not exceed 50 characters'),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 16)), 'You must be at least 16 years old'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address')
    .max(100, 'Email must not exceed 100 characters')
});

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch event details
  const { data: event, isLoading: isLoadingEvent, error: eventError } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await axios.get(`/api/events/${id}`);
      return response.data;
    }
  });

  // Registration mutation
  const registrationMutation = useMutation({
    mutationFn: async (values) => {
      const response = await axios.post(`/api/participants`, {
        ...values,
        eventId: parseInt(id)
      });
      return response.data;
    },
    onSuccess: () => {
      navigate(`/events/${id}`, { 
        state: { message: 'Registration successful!' }
      });
    }
  });

  if (isLoadingEvent) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (eventError) {
    return (
      <Container>
        <Alert severity="error">
          {eventError.response?.data?.message || 'Error loading event details'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register for {event?.title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          {event?.description}
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Formik
            initialValues={{
              name: '',
              surname: '',
              dateOfBirth: null,
              email: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              registrationMutation.mutate(values, {
                onSettled: () => setSubmitting(false)
              });
            }}
          >
            {({ errors, touched, isSubmitting, setFieldValue, values }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="name"
                      label="Name"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      inputProps={{
                        'aria-label': 'Name',
                        'aria-required': 'true'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="surname"
                      label="Surname"
                      error={touched.surname && Boolean(errors.surname)}
                      helperText={touched.surname && errors.surname}
                      inputProps={{
                        'aria-label': 'Surname',
                        'aria-required': 'true'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DatePicker
                      label="Date of Birth"
                      value={values.dateOfBirth}
                      onChange={(newValue) => setFieldValue('dateOfBirth', newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: touched.dateOfBirth && Boolean(errors.dateOfBirth),
                          helperText: touched.dateOfBirth && errors.dateOfBirth,
                          inputProps: {
                            'aria-label': 'Date of Birth',
                            'aria-required': 'true'
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="email"
                      label="Email"
                      type="email"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      inputProps={{
                        'aria-label': 'Email address',
                        'aria-required': 'true'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                      {registrationMutation.isError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {registrationMutation.error?.response?.data?.message || 'Registration failed'}
                        </Alert>
                      )}
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isSubmitting}
                        fullWidth
                      >
                        {isSubmitting ? 'Registering...' : 'Register'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </LocalizationProvider>
      </Paper>
    </Container>
  );
};

export default EventRegistration; 