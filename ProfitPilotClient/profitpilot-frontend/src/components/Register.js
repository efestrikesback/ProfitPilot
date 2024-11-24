// src/components/Register.js

import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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

            setStatus({ success: response.data.registerMessage });
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
        <div style={styles.container}>
            <h2>Register</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, status }) => (
                    <Form style={styles.form}>
                        {status && status.error && <p style={styles.error}>{status.error}</p>}
                        {status && status.success && <p style={styles.success}>{status.success}</p>}
                        <Field 
                            type="text" 
                            name="firstname" 
                            placeholder="First Name" 
                            style={styles.input}
                        />
                        <ErrorMessage name="firstname" component="div" style={styles.error} />

                        <Field 
                            type="text" 
                            name="lastname" 
                            placeholder="Last Name" 
                            style={styles.input}
                        />
                        <ErrorMessage name="lastname" component="div" style={styles.error} />

                        <Field 
                            type="text" 
                            name="username" 
                            placeholder="Username" 
                            style={styles.input}
                        />
                        <ErrorMessage name="username" component="div" style={styles.error} />

                        <Field 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            style={styles.input}
                        />
                        <ErrorMessage name="email" component="div" style={styles.error} />

                        <Field 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            style={styles.input}
                        />
                        <ErrorMessage name="password" component="div" style={styles.error} />

                        <Field 
                            type="password" 
                            name="confirmPassword" 
                            placeholder="Confirm Password" 
                            style={styles.input}
                        />
                        <ErrorMessage name="confirmPassword" component="div" style={styles.error} />

                        <button type="submit" disabled={isSubmitting} style={styles.button}>
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                    </Form>
                )}
            </Formik>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '500px',
        margin: 'auto',
        padding: '20px',
        textAlign: 'center',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginTop: '50px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        boxSizing: 'border-box'
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    error: {
        color: 'red',
        fontSize: '0.9em',
        marginTop: '-10px',
        marginBottom: '10px'
    },
    success: {
        color: 'green',
        fontSize: '0.9em',
        marginBottom: '10px'
    }
};

export default Register;
