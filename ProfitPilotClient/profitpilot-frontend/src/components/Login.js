// src/components/Login.js

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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
        <div style={styles.container}>
            <h2>Login</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form style={styles.form}>
                        {error && <p style={styles.error}>{error}</p>}
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

                        <button type="submit" disabled={isSubmitting} style={styles.button}>
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </Form>
                )}
            </Formik>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '400px',
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
    }
};

export default Login;
