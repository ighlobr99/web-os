/* eslint-disable array-callback-return */
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
  AppBar,
  Tabs,
  Tab,
  Box,
} from '@material-ui/core';
import Select from 'react-select';
import { format } from 'date-fns';

import api from '~/services/api';
import { useToast } from '~/hooks/Toast';
import LoadingPage from '~/components/Loader';
import { useAuth } from '~/hooks/Auth';

import { TextFieldStyled, ErrorMessageText } from './styles';
import Table from './Components/Table';
import Modal from './Components/ModalItem';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ModalItem = ({ handleCloseModal, open, item = null, getItens }) => {
  const { addToast } = useToast();
  const { language } = useAuth();
  const [loading, setLoading] = useState(false);
  const [beatchId, setBeatchId] = useState('');
  const [beatches, setBeatches] = useState([]);
  const [selecteds, setSelecteds] = useState([]);
  const [users, setUsers] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [places, setPlaces] = useState([]);
  const [value, setValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [itemModal, setItemModal] = useState();
  const [serviceOrderSubs, setServiceOrderSubs] = useState([]);

  const schema = Yup.object().shape({
    name: Yup.string().required(
      language ? 'Enter the name of the OS' : 'Informe o nome da OS'
    ),
    beatch_id: Yup.string().required(
      language ? 'Inform the OS beach' : 'Informe a praia da OS'
    ),
    matrix_id: Yup.string().required(
      language ? 'Inform the matrix' : 'Informe a matriz'
    ),
    tech_id: Yup.string().required(
      language ? 'Select technician' : 'Selecione o técnico'
    ),
    type: Yup.string().required(
      language ? 'Select the type of OS' : 'Selecione o tipo da OS'
    ),
    thermometer_id: Yup.string().required(
      language
        ? 'Inform the thermometer identification'
        : 'Informe a identificação do termômetro'
    ),
  });

  const handleChangeValue = (event, newValue) => {
    setValue(newValue);
  };

  const handleSaveClasse = useCallback(
    async data => {
      if (selecteds.length <= 0) {
        addToast({
          type: 'error',
          title: language ? 'Select a place' : 'Selecione um ponto da praia',
        });
        return;
      }
      setLoading(true);
      if (item && item.id) {
        api
          .put(`service_order/${item.id}`, {
            ...data,
            sub_orders: selecteds,
          })
          .then(() => {
            addToast({
              type: 'success',
              title: language ? 'Saved successfully' : 'Salvo com sucesso',
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
          .post(`service_order`, {
            ...data,
            sub_orders: selecteds,
            status: 'open',
            hour: format(new Date(), 'HH:mm'),
            date: format(new Date(), 'dd/MM/yyyy'),
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
      setLoading(false);
    },
    [addToast, getItens, handleCloseModal, item, selecteds, language]
  );

  useEffect(() => {
    async function getCities() {
      try {
        setLoading(true);
        const response = await api.get(`beatch`);
        setBeatches(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        addToast({
          type: 'error',
          title: language ? 'An error has occurred.' : 'Ocorreu um erro.',
        });
      }
    }
    getCities();
  }, [addToast, language]);

  useEffect(() => {
    async function getUsers() {
      setLoading(true);
      const response = await api.get(`users`);
      setUsers(response.data);
      setLoading(false);
    }
    getUsers();
  }, []);

  useEffect(() => {
    async function getMatrix() {
      setLoading(true);
      const response = await api.get(`matrix`);
      setMatrix(response.data);
      setLoading(false);
    }
    getMatrix();
  }, []);

  const getPlaces = useCallback(() => {
    if (beatches && beatches.length && beatchId && beatchId !== '') {
      const findBeatch = beatches.find(beat => beat.id === beatchId);
      if (findBeatch && findBeatch.places && findBeatch.places.length) {
        const arr = [];
        findBeatch.places.map(placB => {
          const objData = {
            value: placB.id,
            label: placB.name,
          };
          arr.push(objData);
        });
        setPlaces(arr);
      }
    }
  }, [beatchId, beatches]);

  const getItem = useCallback(() => {
    if (item) {
      setBeatchId(item.beatch_id);
      if (item.serviceOrderSub && item.serviceOrderSub.length) {
        const arr = [];
        item.serviceOrderSub.map(placB => {
          const objData = {
            value: placB.place.id,
            label: placB.place.name,
          };
          arr.push(objData);
        });
        setSelecteds(arr);
      }
    }
  }, [item]);

  useEffect(() => {
    getItem();
  }, [getItem]);

  const updateItem = useCallback(async () => {
    if (item && item.id) {
      setLoading(true);
      const resp = await api.get(`service_order/${item.id}`);
      const arrData = [];
      if (resp.data.serviceOrderSub && resp.data.serviceOrderSub.length) {
        resp.data.serviceOrderSub.map(dat => {
          if (dat.sample_sent && dat.status_question !== 'open')
            arrData.push(dat);
        });
      }
      setServiceOrderSubs(arrData);
      setLoading(false);
    }
  }, [item]);

  useEffect(() => {
    updateItem();
  }, [updateItem]);

  useEffect(() => {
    getPlaces();
  }, [getPlaces, beatchId]);

  const handleGetItem = useCallback(e => {
    if (e) setItemModal(e);
    setOpenModal(true);
  }, []);

  const handleCloseModalSub = useCallback(() => {
    setOpenModal(false);
    setItemModal(null);
  }, []);

  return (
    <Dialog
      // onClose={this.props.handleModalItem}
      aria-labelledby="customized-dialog-title"
      open={open}
      style={{ minWidth: '100%', width: '100%' }}
    >
      <div style={{ minWidth: '100%', width: '100%' }}>
        <DialogTitle onClose={() => handleCloseModal()}>
          <div>
            <Typography variant="h6">
              {item
                ? `${language ? 'Analyze SO' : 'Analisar OS'}: ${item.id}`
                : `${language ? 'Add SO' : 'Adicionar OS'}`}
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent style={{ overflowX: 'hidden' }}>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChangeValue}
              aria-label="simple tabs example"
            >
              <Tab
                label={language ? 'Informations' : 'Informações'}
                {...a11yProps(0)}
              />
              {item ? (
                <Tab
                  label={language ? 'SO details' : 'Detalhes da OS'}
                  {...a11yProps(1)}
                />
              ) : null}
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <Formik
              enableReinitialize
              validationSchema={schema}
              initialValues={{
                name: item && item.name ? item.name : '',
                beatch_id: item && item.beatch_id ? item.beatch_id : '',
                matrix_id: item && item.matrix_id ? item.matrix_id : '',
                tech_id: item && item.tech_id ? item.tech_id : '',
                type: item && item.type ? item.type : '',
                thermometer_id:
                  item && item.thermometer_id ? item.thermometer_id : '',
                status: item && item.status ? item.status : '',
              }}
              onSubmit={handleSaveClasse}
            >
              {({ values, handleChange, errors, touched, setFieldValue }) => (
                <Form>
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextFieldStyled
                        value={values.name}
                        fullWidth
                        disabled
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
                        value={values.matrix_id}
                        fullWidth
                        disabled
                        id="matrix_id"
                        name="matrix_id"
                        required
                        select
                        style={{ zIndex: 1 }}
                        onChange={handleChange}
                        label={language ? 'Matrix' : 'Matriz'}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      >
                        {matrix && matrix.length
                          ? matrix.map(mtx =>
                              mtx.status ? (
                                <MenuItem key={mtx.id} value={mtx.id}>
                                  {mtx.name}
                                </MenuItem>
                              ) : null
                            )
                          : null}
                      </TextFieldStyled>
                      {errors.matrix_id && touched.matrix_id ? (
                        <ErrorMessageText>{errors.matrix_id}</ErrorMessageText>
                      ) : null}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextFieldStyled
                        value={values.beatch_id}
                        fullWidth
                        disabled
                        id="beatch_id"
                        name="beatch_id"
                        required
                        select
                        onChange={e => {
                          setFieldValue('beatch_id', e.target.value);
                          setBeatchId(e.target.value);
                        }}
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
                      {errors.beatch_id && touched.beatch_id ? (
                        <ErrorMessageText>{errors.beatch_id}</ErrorMessageText>
                      ) : null}
                    </Grid>
                    {beatchId ? (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        style={{ padding: 8, zIndex: 999 }}
                      >
                        <p>{language ? 'Beach spots' : 'Pontos da praia'}</p>
                        <Select
                          options={places}
                          value={selecteds}
                          isMulti
                          style={{ background: 'white', zIndex: 999 }}
                          label={language ? 'Beach spots' : 'Pontos da praia'}
                          // onChange={handleSelectedItens}
                        />
                      </Grid>
                    ) : null}
                    <Grid item xs={12} sm={12} md={12}>
                      <TextFieldStyled
                        value={values.tech_id}
                        fullWidth
                        id="tech_id"
                        name="tech_id"
                        required
                        disabled
                        select
                        style={{ zIndex: 1 }}
                        onChange={handleChange}
                        label={language ? 'Technician' : 'Técnico'}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      >
                        {users && users.length
                          ? users.map(usr =>
                              usr.status && usr.level === 'collector' ? (
                                <MenuItem key={usr.id} value={usr.id}>
                                  {usr.name}
                                </MenuItem>
                              ) : null
                            )
                          : null}
                      </TextFieldStyled>
                      {errors.tech_id && touched.tech_id ? (
                        <ErrorMessageText>{errors.tech_id}</ErrorMessageText>
                      ) : null}
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <TextFieldStyled
                      value={values.type}
                      fullWidth
                      id="type"
                      disabled
                      name="type"
                      required
                      onChange={handleChange}
                      label={language ? 'Type' : 'Tipo'}
                      select
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option key="simple" value="simple">
                        {language ? 'Simple' : 'Simples'}
                      </option>
                      <option key="complete" value="complete">
                        {language ? 'Full' : 'Completa'}
                      </option>
                    </TextFieldStyled>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextFieldStyled
                      value={values.thermometer_id}
                      fullWidth
                      disabled
                      id="thermometer_id"
                      name="thermometer_id"
                      required
                      onChange={handleChange}
                      label={language ? 'Thermometer Id' : 'Id do termômetro'}
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    {errors.thermometer_id && touched.thermometer_id ? (
                      <ErrorMessageText>
                        {errors.thermometer_id}
                      </ErrorMessageText>
                    ) : null}
                  </Grid>
                  {item && (
                    <Grid item xs={12}>
                      <TextFieldStyled
                        value={values.status}
                        fullWidth
                        id="status"
                        name="status"
                        disabled
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
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Table
              data={
                serviceOrderSubs && serviceOrderSubs.length
                  ? serviceOrderSubs
                  : []
              }
              handleGetItem={handleGetItem}
            />
            <Grid container>
              <Grid item xs={12} sm={12} md={12}>
                <Grid container justify="flex-end">
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
          </TabPanel>
          <Modal
            handleCloseModal={handleCloseModalSub}
            open={openModal}
            getItens={getItens}
            updateItem={updateItem}
            item={itemModal}
          />
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
      </div>
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
