import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || '';
    });

    const [user, setUser] = useState(() => {
        if (token) {
            try {
                return jwtDecode(token);
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
        try {
            setUser(jwtDecode(newToken));
        } catch (e) {
            setUser(null);
        }
    };

    const logout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        if (token) {
            try {
                setUser(jwtDecode(token));
            } catch (e) {
                setUser(null);
            }
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
