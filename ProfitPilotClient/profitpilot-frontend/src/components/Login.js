// src/components/Login.js

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Import Bootstrap components
import { Container, Form as BootstrapForm, Button, Alert } from 'react-bootstrap';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/authenticate', {
        email: values.email,
        password: values.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token } = response.data;
      login(token);
      setError('');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Authentication Failed. Please check your credentials.');
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form as={BootstrapForm}>
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

            <Button variant="primary" type="submit" disabled={isSubmitting} className="w-100 mt-3">
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        )}
      </Formik>
      <p className="mt-3 text-center">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </Container>
  );
};

export default Login;
