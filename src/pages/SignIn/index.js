import React, { useState, useCallback } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Grid, TextField, InputAdornment, IconButton } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import {
  StyledContainer,
  StyledGridItem,
  StyledSubmitButton,
  StyledForm,
  IconStyled,
  Error,
} from './styles';

import colors from '~/styles/colors';
import { useAuth } from '~/hooks/Auth';
import { useToast } from '~/hooks/Toast';

import logoImg from '~/assets/images/log.png';

const SignIn = () => {
  const { signIn, loading, setLoading, language, updateLanguage } = useAuth();
  const { addToast } = useToast();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [error, setError] = useState('');

  const schema = Yup.object().shape({
    email: Yup.string().required(
      language ? 'Enter email.' : 'Informe o e-mail'
    ),
    password: Yup.string().required(
      language ? 'Enter password' : 'Informe a senha'
    ),
  });

  const handleLogin = useCallback(
    async data => {
      try {
        await signIn(data, setError);
      } catch (err) {
        addToast({
          type: 'error',
          title: language ? 'An error has occurred.' : 'Ocorreu um erro.',
          description: language
            ? 'Check your email and password and try again'
            : 'Verifique seu email e senha e tente novamente',
        });
        setLoading(false);
      }
    },
    [signIn, addToast, setLoading, language]
  );

  const handleChangeLanguage = useCallback(() => {
    const languageS = localStorage.getItem('@osService:language');
    if (languageS) {
      localStorage.removeItem('@osService:language');
    } else {
      localStorage.setItem('@osService:language', JSON.stringify(true));
    }
    updateLanguage();
  }, [updateLanguage]);

  return (
    <StyledContainer maxWidth="sm">
      <Formik
        validationSchema={schema}
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleSubmit }) => (
          <StyledForm>
            <img alt="Coupons" width="200" src={logoImg} />
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <StyledGridItem item sm marginTop={30}>
                <TextField
                  id="email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  autoFocus
                  disabled={false}
                  type="email"
                  label={language ? 'Email' : 'E-mail'}
                  InputProps={{
                    'aria-label': 'Weight',
                    // required: true,
                    startAdornment: (
                      <IconStyled fontSize="small" color="primary">
                        person
                      </IconStyled>
                    ),
                  }}
                  // error={error}
                  onChange={handleChange}
                />
              </StyledGridItem>

              <StyledGridItem item sm>
                <TextField
                  id="password"
                  name="password"
                  variant="outlined"
                  fullWidth
                  disabled={false}
                  type={visiblePassword ? 'text' : 'password'}
                  label={language ? 'Password' : 'Senha'}
                  // error={error}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setVisiblePassword(!visiblePassword)}
                          aria-label="toggle password visibility"
                          edge="end"
                        >
                          {visiblePassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    'aria-label': 'Weight',
                    required: true,
                    startAdornment: (
                      <IconStyled fontSize="small" color="primary">
                        vpn_key
                      </IconStyled>
                    ),
                  }}
                />
              </StyledGridItem>
              {error && <Error>{error}</Error>}

              <center>
                <StyledGridItem item marginTop={70}>
                  <StyledSubmitButton
                    variant="contained"
                    background={colors.blueButton}
                    color={colors.white}
                    type="submit"
                    onClick={handleSubmit}
                  >
                    {loading
                      ? `${language ? 'Loading...' : 'Entrando...'}`
                      : `${language ? 'SignIn' : 'Entrar'}`}
                  </StyledSubmitButton>
                </StyledGridItem>

                <StyledGridItem item marginTop={70}>
                  <StyledSubmitButton
                    variant="contained"
                    background={colors.blueButton}
                    color={colors.white}
                    type="button"
                    onClick={handleChangeLanguage}
                  >
                    {language ? 'PT-BR' : 'EN-US'}
                  </StyledSubmitButton>
                </StyledGridItem>
                {/* <StyledGridItem item>
                  <StyledSubmitButton
                    variant="outlined"
                    color="primary"
                    type="button"
                  >
                    Recuperar a senha
                  </StyledSubmitButton>
                </StyledGridItem> */}
              </center>
            </Grid>
          </StyledForm>
        )}
      </Formik>
    </StyledContainer>
  );
};

export default SignIn;
