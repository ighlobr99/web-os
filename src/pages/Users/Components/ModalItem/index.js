/* eslint-disable react/jsx-boolean-value */
import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import InputMask from 'react-input-mask';
import {
  Typography,
  Grid,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
} from '@material-ui/core';

import api from '~/services/api';
import { useAuth } from '~/hooks/Auth';
import { useToast } from '~/hooks/Toast';
import LoadingPage from '~/components/Loader';

import { TextFieldStyled, ErrorMessageText } from './styles';

const ModalItem = ({ handleCloseModal, open, item = null, getItens }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { language } = useAuth();
  const [sectors, setSectors] = useState([]);

  const schema = Yup.object().shape({
    name: Yup.string().required(
      language ? 'Enter the name of the user.' : 'Informe o nome da Matriz'
    ),
    email: Yup.string().required(
      language ? 'Enter the name of the user.' : 'Informe o email do Usuário'
    ),
    
    password: Yup.string().required(
      language
        ? 'Enter the password of the user.'
        : 'Informe a senha do Usuário'
    ),
    level: Yup.string().required(
      language
        ? 'Enter the permission of the user.'
        : 'Informe a permissão do Usuário'
    ),
  });

  const levels = [
    {
      value: 'manager',
      label: language ? 'Manager' : 'Gerente',
    },
    {
      value: 'collector',
      label: language ? 'Collector' : 'Coletor',
    },
    {
      value: 'recipient',
      label: language ? 'Recipient' : 'Beneficiário',
    },
    {
      value: 'laboratory_analyst',
      label: language ? 'Laboratory analyst' : 'Analista laboratório',
    },
    {
      value: 'cetesb_analyst',
      label: language ? 'Cetesb analyst' : 'Analista da Cetesb',
    },
  ];

  const handleSaveClasse = useCallback(
    async data => {
      setLoading(true);
      if (item && item.id) {
        api
          .put(`users/${item.id}`, {
            ...data,
          })
          .then(() => {
            addToast({
              type: 'success',
              title: language ? 'Registered successfully' : 'Salvo com sucesso',
            });
            handleCloseModal();
            getItens();
            setLoading(false);
          })
          .catch(() => {
            addToast({
              type: 'error',
              title: language ? 'An error has occurred.' : 'Ocorreu um erro.',
            });
            setLoading(false);
          });
      } else {
        api
          .post(`users`, {
            ...data,
          })
          .then(() => {
            addToast({
              type: 'success',
              title: language ? 'Registered successfully' : 'Salvo com sucesso',
            });
            handleCloseModal();
            getItens();
            setLoading(false);
          })
          .catch(() => {
            addToast({
              type: 'error',
              title: language ? 'An error has occurred.' : 'Ocorreu um erro.',
            });
            setLoading(false);
          });
      }
    },
    [addToast, getItens, handleCloseModal, item, language]
  );

  const getSectors = useCallback(
    async value => {
      try {
        const filter = value === undefined ? '' : value;
        const response = await api.get(`sector?${filter}`);
        // eslint-disable-next-line prefer-const
        setSectors(response.data);
      } catch (err) {
        addToast({
          type: 'error',
          title: language ? 'An error has occurred.' : 'Ocorreu um erro.',
        });
      }
    },
    [addToast, language]
  );

  useEffect(() => {
    getSectors();
  }, [getSectors]);

  return (
    <Dialog
      // onClose={this.props.handleModalItem}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle onClose={() => handleCloseModal()}>
        <div>
          <Typography variant="h6">{language ? 'User' : 'Usuário'} </Typography>
        </div>
      </DialogTitle>
      <DialogContent style={{ overflowX: 'hidden' }}>
        <Formik
          enableReinitialize
          validationSchema={schema}
          initialValues={{
            name: item && item.name ? item.name : '',
          
            phone: item && item.phone ? item.phone : '',
            email: item && item.email ? item.email : '',
            password: '',
            status: item ? item.status : true,
            birth_date: item && item.birth_date ? item.birth_date : '',
            address: item && item.address ? item.address : '',
            level: item && item.level ? item.level : '',
            sectors_id: item && item.sectors_id ? item.sectors_id : '',
          }}
          onSubmit={handleSaveClasse}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
            <Form>
              <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                  <TextFieldStyled
                    value={values.name}
                    fullWidth
                    id="name"
                    name="name"
                    required
                    onChange={handleChange}
                    label={language ? 'Name' : 'Nome'}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  {errors.name && touched.name ? (
                    <ErrorMessageText>{errors.name}</ErrorMessageText>
                  ) : null}
                </Grid>
                
                <Grid item xs={12} sm={12} md={12}>
                  <TextFieldStyled
                    value={values.sectors_id}
                    fullWidth
                    id="sectors_id"
                    name="sectors_id"
                    required
                    select
                    onChange={handleChange}
                    label={language ? 'Sector' : 'Setor do usuário'}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    {sectors && sectors.length
                      ? sectors.map(sector => (
                          <MenuItem key={sector.id} value={sector.id}>
                            {sector.name}
                          </MenuItem>
                        ))
                      : null}
                  </TextFieldStyled>
                  {errors.sectors_id && touched.sectors_id ? (
                    <ErrorMessageText>{errors.sectors_id}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextFieldStyled
                    value={values.email}
                    fullWidth
                    id="email"
                    name="email"
                    required
                    onChange={handleChange}
                    label="E-mail"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  {errors.email && touched.email ? (
                    <ErrorMessageText>{errors.email}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextFieldStyled
                    value={values.password}
                    type="password"
                    fullWidth
                    id="password"
                    name="password"
                    required
                    onChange={handleChange}
                    label={language ? 'Password' : 'Senha'}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  {errors.password && touched.password ? (
                    <ErrorMessageText>{errors.password}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <InputMask
                    mask="(99) 99999-9999"
                    fullWidth
                    value={values.phone}
                    name="phone"
                    label={language ? 'Phone' : 'Telefone'}
                    onChange={handleChange}
                  >
                    {inputProps => (
                      <TextFieldStyled
                        {...inputProps}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  </InputMask>
                  {errors.phone && touched.phone ? (
                    <ErrorMessageText>{errors.phone}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextFieldStyled
                    value={values.birth_date}
                    fullWidth
                    id="birth_date"
                    name="birth_date"
                    onChange={handleChange}
                    type="date"
                    label={language ? 'Birth date' : 'Data de nascimento'}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  {errors.birth_date && touched.birth_date ? (
                    <ErrorMessageText>{errors.birth_date}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextFieldStyled
                    value={values.address}
                    fullWidth
                    id="address"
                    name="address"
                    onChange={handleChange}
                    label={language ? 'Address' : 'Endereço'}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  {errors.address && touched.address ? (
                    <ErrorMessageText>{errors.address}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextFieldStyled
                    value={values.level}
                    fullWidth
                    id="level"
                    name="level"
                    required
                    select
                    onChange={handleChange}
                    label={language ? 'Level user' : 'Nível de permissão'}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    {levels && levels.length
                      ? levels.map(level => (
                          <MenuItem key={level.value} value={level.value}>
                            {level.label}
                          </MenuItem>
                        ))
                      : null}
                  </TextFieldStyled>
                  {errors.level && touched.level ? (
                    <ErrorMessageText>{errors.level}</ErrorMessageText>
                  ) : null}
                </Grid>
              </Grid>
              {item && (
                <Grid item xs={12}>
                  <TextFieldStyled
                    value={values.status}
                    fullWidth
                    id="status"
                    name="status"
                    required
                    onChange={handleChange}
                    label="Status"
                    select
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option key={true} value={true}>
                      {language ? 'Active' : 'Ativo'}
                    </option>
                    <option key={false} value={false}>
                      {language ? 'Inactive' : 'Inativo'}
                    </option>
                  </TextFieldStyled>
                </Grid>
              )}
              <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                  <Grid container justify="flex-end">
                    <DialogActions>
                      <Button
                        onClick={() => handleSubmit()}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                      >
                        {language ? 'Save' : 'Salvar'}
                      </Button>
                    </DialogActions>
                    <DialogActions>
                      <Button
                        variant="outlined"
                        onClick={() => handleCloseModal()}
                        color="primary"
                      >
                        {language ? 'Cancel' : 'Cancelar'}
                      </Button>
                    </DialogActions>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        {loading && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LoadingPage size={30} loading={loading} type="ThreeDots" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

ModalItem.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  getItens: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  item: PropTypes.node.isRequired,
};

export default ModalItem;
