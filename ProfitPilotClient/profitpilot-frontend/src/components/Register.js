// src/components/Register.js

import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Import Bootstrap components
import { Container, Form as BootstrapForm, Button, Alert } from 'react-bootstrap';

const Register = () => {
  const navigate = useNavigate();

  const initialValues = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object({
    firstname: Yup.string()
      .required('First name is required'),
    lastname: Yup.string()
      .required('Last name is required'),
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required')
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        firstname: values.firstname,
        lastname: values.lastname,
        username: values.username,
        email: values.email,
        password: values.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setStatus({ success: 'Registration successful! Redirecting to login...' });
      setSubmitting(false);
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setStatus({ error: err.response?.data || 'Registration failed.' });
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">Register</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status, errors, touched }) => (
          <Form as={BootstrapForm}>
            {status && status.error && <Alert variant="danger">{status.error}</Alert>}
            {status && status.success && <Alert variant="success">{status.success}</Alert>}

            <BootstrapForm.Group controlId="firstname">
              <BootstrapForm.Label>First Name</BootstrapForm.Label>
              <Field
                name="firstname"
                type="text"
                as={BootstrapForm.Control}
                isInvalid={touched.firstname && errors.firstname}
              />
              <ErrorMessage name="firstname" component={BootstrapForm.Control.Feedback} type="invalid" />
            </BootstrapForm.Group>

            <BootstrapForm.Group controlId="lastname">
              <BootstrapForm.Label>Last Name</BootstrapForm.Label>
              <Field
                name="lastname"
                type="text"
                as={BootstrapForm.Control}
                isInvalid={touched.lastname && errors.lastname}
              />
              <ErrorMessage name="lastname" component={BootstrapForm.Control.Feedback} type="invalid" />
            </BootstrapForm.Group>

            <BootstrapForm.Group controlId="username">
              <BootstrapForm.Label>Username</BootstrapForm.Label>
              <Field
                name="username"
                type="text"
                as={BootstrapForm.Control}
                isInvalid={touched.username && errors.username}
              />
              <ErrorMessage name="username" component={BootstrapForm.Control.Feedback} type="invalid" />
            </BootstrapForm.Group>

            <BootstrapForm.Group controlId="email">
              <BootstrapForm.Label>Email</BootstrapForm.Label>
              <Field
                name="email"
                type="email"
                as={BootstrapForm.Control}
                isInvalid={touched.email && errors.email}
              />
              <ErrorMessage name="email" component={BootstrapForm.Control.Feedback} type="invalid" />
            </BootstrapForm.Group>

            <BootstrapForm.Group controlId="password">
              <BootstrapForm.Label>Password</BootstrapForm.Label>
              <Field
                name="password"
                type="password"
                as={BootstrapForm.Control}
                isInvalid={touched.password && errors.password}
              />
              <ErrorMessage name="password" component={BootstrapForm.Control.Feedback} type="invalid" />
            </BootstrapForm.Group>

            <BootstrapForm.Group controlId="confirmPassword">
              <BootstrapForm.Label>Confirm Password</BootstrapForm.Label>
              <Field
                name="confirmPassword"
                type="password"
                as={BootstrapForm.Control}
                isInvalid={touched.confirmPassword && errors.confirmPassword}
              />
              <ErrorMessage name="confirmPassword" component={BootstrapForm.Control.Feedback} type="invalid" />
            </BootstrapForm.Group>

            <Button variant="primary" type="submit" disabled={isSubmitting} className="w-100 mt-3">
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </Form>
        )}
      </Formik>
      <p className="mt-3 text-center">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </Container>
  );
};

export default Register;
