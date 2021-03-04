/* eslint-disable react/jsx-boolean-value */
import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
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
import { useToast } from '~/hooks/Toast';
import { useAuth } from '~/hooks/Auth';
import LoadingPage from '~/components/Loader';

import { TextFieldStyled, ErrorMessageText } from './styles';

const ModalItem = ({ handleCloseModal, open, item = null, getItens }) => {
  const { addToast } = useToast();
  const { language } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  const schema = Yup.object().shape({
    name: Yup.string().required(
      language ? 'Enter the name of the beach.' : 'Informe o nome da Praia'
    ),
    lat: Yup.string().required(
      language ? 'Enter the lat of Praia.' : 'Informe a latitude da Praia'
    ),
    long: Yup.string().required(
      language ? 'Enter the long of Praia.' : 'Informe a longitude da Praia'
    ),
    city_id: Yup.string().required(
      language ? 'Inform the city of Praia.' : 'Informe a cidade da Praia'
    ),
  });

  const handleSaveClasse = useCallback(
    async data => {
      setLoading(true);
      if (item && item.id) {
        api
          .put(`beatch/${item.id}`, {
            ...data,
          })
          .then(() => {
            addToast({
              type: 'success',
              title: language
                ? 'Registered successfully'
                : 'Cadastrado com sucesso',
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
          .post(`beatch`, {
            ...data,
            status: true,
          })
          .then(() => {
            addToast({
              type: 'success',
              title: language
                ? 'Registered successfully'
                : 'Cadastrado com sucesso',
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

  useEffect(() => {
    async function getCities() {
      try {
        const response = await api.get(`city`);
        setCities(response.data);
      } catch (err) {
        addToast({
          type: 'error',
          title: language ? 'An error has occurred.' : 'Ocorreu um erro.',
        });
      }
    }
    getCities();
  }, [addToast, language]);

  return (
    <Dialog
      // onClose={this.props.handleModalItem}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle onClose={() => handleCloseModal()}>
        <div>
          <Typography variant="h6">{language ? 'Beatch' : 'Praia'}</Typography>
        </div>
      </DialogTitle>
      <DialogContent style={{ overflowX: 'hidden' }}>
        <Formik
          enableReinitialize
          validationSchema={schema}
          initialValues={{
            name: item && item.name ? item.name : '',
            lat: item && item.lat ? item.lat : '',
            status: item ? item.status : true,
            long: item && item.long ? item.long : '',
            city_id: item && item.city_id ? item.city_id : '',
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
                    value={values.city_id}
                    fullWidth
                    id="city_id"
                    name="city_id"
                    required
                    select
                    onChange={handleChange}
                    label={language ? 'City' : 'Cidade'}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    {cities && cities.length
                      ? cities.map(city =>
                          city.status ? (
                            <MenuItem key={city.id} value={city.id}>
                              {city.name}
                            </MenuItem>
                          ) : null
                        )
                      : null}
                  </TextFieldStyled>
                  {errors.city_id && touched.city_id ? (
                    <ErrorMessageText>{errors.city_id}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextFieldStyled
                    value={values.lat}
                    fullWidth
                    id="lat"
                    type="number"
                    name="lat"
                    required
                    onChange={handleChange}
                    label="Lat"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  {errors.lat && touched.lat ? (
                    <ErrorMessageText>{errors.lat}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextFieldStyled
                    value={values.long}
                    fullWidth
                    id="long"
                    type="number"
                    name="long"
                    required
                    onChange={handleChange}
                    label="Long"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  {errors.long && touched.long ? (
                    <ErrorMessageText>{errors.long}</ErrorMessageText>
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
