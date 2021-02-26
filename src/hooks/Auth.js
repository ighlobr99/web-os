import React, { createContext, useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import api from '~/services/api';

require('dotenv/config');

const AuthContext = createContext({});

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used whitin an AuthProvider');
  }

  return context;
}

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(() => {
    const token = localStorage.getItem('@osService:token');
    const user = localStorage.getItem('@osService:user');
    const language = localStorage.getItem('@osService:language');
    if (token && user && language) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user), language: JSON.parse(language) };
    }
    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }
    if (language) {
      return { language: JSON.parse(language) };
    }
    return {};
  });

  const signOut = useCallback(() => {
    localStorage.removeItem('@osService:token');
    localStorage.removeItem('@osService:user');
    localStorage.removeItem('@osService:language');
    setData({});
  }, []);

  const updateLanguage = useCallback(() => {
    setData(() => {
      const token = localStorage.getItem('@osService:token');
      const user = localStorage.getItem('@osService:user');
      const language = localStorage.getItem('@osService:language');
      if (token && user && language) {
        api.defaults.headers.authorization = `Bearer ${token}`;
        return {
          token,
          user: JSON.parse(user),
          language: JSON.parse(language),
        };
      }
      if (token && user) {
        api.defaults.headers.authorization = `Bearer ${token}`;
        return { token, user: JSON.parse(user) };
      }
      if (language) {
        return { language: JSON.parse(language) };
      }
      return {};
    });
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    setLoading(true);
    const response = await api.post('/sessions', {
      email,
      password,
    });

    const { token, user } = response.data;
    localStorage.setItem('@osService:token', token.token);
    localStorage.setItem('@osService:user', JSON.stringify(user));
    api.defaults.headers.authorization = `Bearer ${token.token}`;
    setData({ token: token.token, user });
    setLoading(false);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        token: data.token,
        language: data.language,
        signIn,
        signOut,
        loading,
        setLoading,
        updateLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.shape().isRequired,
};
