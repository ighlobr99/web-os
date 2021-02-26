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

const schema = Yup.object().shape({
  description: Yup.string().required('Informe a descrição do Local'),
  beatch_place_id: Yup.string().required('Informe a praia do Local'),
});

const ModalItem = ({ handleCloseModal, open, item = null, getItens }) => {
  const { addToast } = useToast();
  const { language } = useAuth();
  const [loading, setLoading] = useState(false);
  const [beatches, setBeatches] = useState([]);

  const handleSaveClasse = useCallback(
    async data => {
      setLoading(true);
      if (item && item.id) {
        api
          .put(`complaint/${item.id}`, {
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
          .post(`complaint`, {
            ...data,
          })
          .then(() => {
            addToast({
              type: 'success',
              title: language ? 'Registered successfully' : 'Salvo com sucesso',
            });
            handleCloseModal();
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
    async function getBeatches() {
      try {
        const response = await api.get(`beatch_place`);
        setBeatches(response.data);
      } catch (err) {
        addToast({
          type: 'error',
          title: language ? 'An error has occurred.' : 'Ocorreu um erro.',
        });
      }
    }
    getBeatches();
  }, [addToast, language]);

  return (
    <Dialog
      // onClose={this.props.handleModalItem}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle onClose={() => handleCloseModal()}>
        <div>
          <Typography variant="h6">
            {language ? 'Report beach' : 'Denunciar praia'}
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent style={{ overflowX: 'hidden' }}>
        <Formik
          enableReinitialize
          validationSchema={schema}
          initialValues={{
            description: item && item.description ? item.description : '',
            beatch_place_id:
              item && item.beatch_place_id ? item.beatch_place_id : '',
          }}
          onSubmit={handleSaveClasse}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
            <Form>
              <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                  <TextFieldStyled
                    value={values.description}
                    fullWidth
                    id="description"
                    name="description"
                    required
                    onChange={handleChange}
                    label={language ? 'Description' : 'Descrição'}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  {errors.description && touched.description ? (
                    <ErrorMessageText>{errors.description}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextFieldStyled
                    value={values.beatch_place_id}
                    fullWidth
                    id="beatch_place_id"
                    name="beatch_place_id"
                    required
                    select
                    onChange={handleChange}
                    label={language ? 'Beatch' : 'Praia'}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    {beatches && beatches.length
                      ? beatches.map(beatch =>
                          beatch.status ? (
                            <MenuItem key={beatch.id} value={beatch.id}>
                              {beatch.name}
                            </MenuItem>
                          ) : null
                        )
                      : null}
                  </TextFieldStyled>
                  {errors.beatch_place_id && touched.beatch_place_id ? (
                    <ErrorMessageText>
                      {errors.beatch_place_id}
                    </ErrorMessageText>
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
