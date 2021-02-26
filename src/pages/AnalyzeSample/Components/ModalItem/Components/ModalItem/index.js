/* eslint-disable no-useless-escape */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-boolean-value */
import React, { useCallback, useState } from 'react';
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
} from '@material-ui/core';

import api from '~/services/api';
import { useToast } from '~/hooks/Toast';
import { useAuth } from '~/hooks/Auth';
import LoadingPage from '~/components/Loader';

import { TextFieldStyled, ErrorMessageText } from './styles';

const ModalItem = ({
  handleCloseModal,
  open,
  item = null,
  getItens,
  updateItem,
}) => {
  const { addToast } = useToast();
  const { language } = useAuth();
  const [loading, setLoading] = useState(false);
  const schema = Yup.object().shape({
    hour: Yup.string().required(
      language ? 'Inform the collection time' : 'Informe o horário da coleta'
    ),
    hangover: Yup.string().required(
      language ? 'Enter the air temperature' : 'Informe a temperatura do ar'
    ),
    air_temp: Yup.string().required(
      language ? 'Enter the water temperature' : 'Informe a temperatura da água'
    ),
  });

  const handleSaveClasse = useCallback(
    async data => {
      setLoading(true);
      if (item && item.id) {
        api
          .put(`service_order_sub/${item.id}`, {
            ...data,
            beatch_place_id: item.beatch_place_id,
            air_temp: data.air_temp.replace(
              /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
              ''
            ),
            water_temp: data.water_temp.replace(
              /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
              ''
            ),
            status_question: 'answered',
          })
          .then(() => {
            addToast({
              type: 'success',
              title: language ? 'Registered successfully' : 'Salvo com sucesso',
            });
            handleCloseModal();
            getItens();
            updateItem();
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
          .post(`service_order_sub`, {
            ...data,
            beatch_place_id: item.beatch_place_id,
            air_temp: data.air_temp.replace(
              /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
              ''
            ),
            water_temp: data.water_temp.replace(
              /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
              ''
            ),
            status_question: 'answered',
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
            updateItem();
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
    [addToast, getItens, handleCloseModal, item, updateItem, language]
  );

  return (
    <Dialog
      // onClose={this.props.handleModalItem}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle onClose={() => handleCloseModal()}>
        <div>
          <Typography variant="h6">
            {item && item.place
              ? `${language ? 'Place' : 'Local'}: ${item.place.name}`
              : ''}
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent style={{ overflowX: 'hidden' }}>
        <Formik
          enableReinitialize
          validationSchema={schema}
          initialValues={{
            hour: item && item.hour ? item.hour : '',
            hangover: item && item.hangover ? item.hangover : false,
            air_temp: item && item.air_temp ? item.air_temp : false,
            water_temp: item && item.water_temp ? item.water_temp : false,
            rain: item && item.rain ? item.rain : false,
            small_visibility:
              item && item.small_visibility ? item.small_visibility : false,
            beatch_waste: item && item.beatch_waste ? item.beatch_waste : false,
            dirty_water: item && item.dirty_water ? item.dirty_water : false,
            beatch_debris:
              item && item.beatch_debris ? item.beatch_debris : false,
            oils_and_greases_water:
              item && item.oils_and_greases_water
                ? item.oils_and_greases_water
                : false,
            oils_and_greases_sand:
              item && item.oils_and_greases_sand
                ? item.oils_and_greases_sand
                : false,
            death_fishes: item && item.death_fishes ? item.death_fishes : false,
            sewer: item && item.sewer ? item.sewer : false,
            flag: item && item.flag ? item.flag : 'own',
            sample_sent: item && item.sample_sent ? item.sample_sent : false,
            result: item && item.result ? item.result : 0,
            sample_received:
              item && item.sample_received ? item.sample_received : true,
          }}
          onSubmit={handleSaveClasse}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
            <Form>
              <Grid container>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.sample_received}
                    fullWidth
                    id="sample_received"
                    name="sample_received"
                    required
                    onChange={handleChange}
                    label={language ? 'Sample Received' : 'Amostra recebida'}
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
                      {language ? 'Yes' : 'Sim'}
                    </option>
                    <option key={false} value={false}>
                      {language ? 'No' : 'Não'}
                    </option>
                  </TextFieldStyled>
                  {errors.sample_received && touched.sample_received ? (
                    <ErrorMessageText>
                      {errors.sample_received}
                    </ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.result}
                    fullWidth
                    id="result"
                    name="result"
                    required
                    onChange={handleChange}
                    label={language ? 'Sample result' : 'Resultado da amostra'}
                    type="number"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    SelectProps={{
                      native: true,
                    }}
                  />
                  {errors.result && touched.result ? (
                    <ErrorMessageText>{errors.result}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                  <InputMask
                    mask="99:99"
                    fullWidth
                    value={values.hour}
                    name="hour"
                    label={language ? 'Time' : 'Horário'}
                    disabled
                    // onChange={handleChange}
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
                  {errors.hour && touched.hour ? (
                    <ErrorMessageText>{errors.hour}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                  <InputMask
                    mask="999"
                    fullWidth
                    value={values.air_temp}
                    name="air_temp"
                    label={language ? 'Air temperature' : 'Temp. do ar'}
                    disabled
                    // onChange={handleChange}
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
                  {errors.air_temp && touched.air_temp ? (
                    <ErrorMessageText>{errors.air_temp}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={4} sm={6} md={4}>
                  <InputMask
                    mask="999"
                    fullWidth
                    value={values.water_temp}
                    name="water_temp"
                    label={language ? 'Water temperature' : 'Temp. da água'}
                    // onChange={handleChange}
                    disabled
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
                  {errors.water_temp && touched.water_temp ? (
                    <ErrorMessageText>{errors.water_temp}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.rain}
                    fullWidth
                    id="rain"
                    name="rain"
                    disabled
                    required
                    onChange={handleChange}
                    label={language ? 'Rain' : 'Chuva'}
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
                      {language ? 'Yes' : 'Sim'}
                    </option>
                    <option key={false} value={false}>
                      {language ? 'No' : 'Não'}
                    </option>
                  </TextFieldStyled>
                  {errors.rain && touched.rain ? (
                    <ErrorMessageText>{errors.rain}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.small_visibility}
                    fullWidth
                    id="small_visibility"
                    name="small_visibility"
                    required
                    disabled
                    onChange={handleChange}
                    label={language ? 'Small visibility' : 'Baixa visibilidade'}
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
                      {language ? 'Yes' : 'Sim'}
                    </option>
                    <option key={false} value={false}>
                      {language ? 'No' : 'Não'}
                    </option>
                  </TextFieldStyled>
                  {errors.small_visibility && touched.small_visibility ? (
                    <ErrorMessageText>
                      {errors.small_visibility}
                    </ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.hangover}
                    fullWidth
                    id="hangover"
                    name="hangover"
                    required
                    disabled
                    onChange={handleChange}
                    label={language ? 'Hangover' : 'Ressaca'}
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
                      {language ? 'Yes' : 'Sim'}
                    </option>
                    <option key={false} value={false}>
                      {language ? 'No' : 'Não'}
                    </option>
                  </TextFieldStyled>
                  {errors.hangover && touched.hangover ? (
                    <ErrorMessageText>{errors.hangover}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.dirty_water}
                    fullWidth
                    disabled
                    id="dirty_water"
                    name="dirty_water"
                    required
                    onChange={handleChange}
                    label={language ? 'Dirty Water' : 'Água suja'}
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
                      {language ? 'Yes' : 'Sim'}
                    </option>
                    <option key={false} value={false}>
                      {language ? 'No' : 'Não'}
                    </option>
                  </TextFieldStyled>
                  {errors.dirty_water && touched.dirty_water ? (
                    <ErrorMessageText>{errors.dirty_water}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.beatch_debris}
                    fullWidth
                    disabled
                    id="beatch_debris"
                    name="beatch_debris"
                    required
                    onChange={handleChange}
                    label={language ? 'Beatch debris' : 'Destritos'}
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
                      {language ? 'Yes' : 'Sim'}
                    </option>
                    <option key={false} value={false}>
                      {language ? 'No' : 'Não'}
                    </option>
                  </TextFieldStyled>
                  {errors.beatch_debris && touched.beatch_debris ? (
                    <ErrorMessageText>{errors.beatch_debris}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.beatch_waste}
                    fullWidth
                    disabled
                    id="beatch_waste"
                    name="beatch_waste"
                    required
                    onChange={handleChange}
                    label={language ? 'Beatch waste' : 'Dejetos'}
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
                      {language ? 'Yes' : 'Sim'}
                    </option>
                    <option key={false} value={false}>
                      {language ? 'No' : 'Não'}
                    </option>
                  </TextFieldStyled>
                  {errors.beatch_waste && touched.beatch_waste ? (
                    <ErrorMessageText>{errors.beatch_waste}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.oils_and_greases_water}
                    fullWidth
                    disabled
                    id="oils_and_greases_water"
                    name="oils_and_greases_water"
                    required
                    onChange={handleChange}
                    label={
                      language
                        ? 'Oils and greases in water'
                        : 'Óleos e graxas na água'
                    }
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
                      {language ? 'Yes' : 'Sim'}
                    </option>
                    <option key={false} value={false}>
                      {language ? 'No' : 'Não'}
                    </option>
                  </TextFieldStyled>
                  {errors.oils_and_greases_water &&
                  touched.oils_and_greases_water ? (
                    <ErrorMessageText>
                      {errors.oils_and_greases_water}
                    </ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.oils_and_greases_sand}
                    fullWidth
                    disabled
                    id="oils_and_greases_sand"
                    name="oils_and_greases_sand"
                    required
                    onChange={handleChange}
                    label={
                      language
                        ? 'Oils and greases in sand'
                        : 'Óleos e graxas na areia'
                    }
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
                      {language ? 'Yes' : 'Sim'}
                    </option>
                    <option key={false} value={false}>
                      {language ? 'No' : 'Não'}
                    </option>
                  </TextFieldStyled>
                  {errors.oils_and_greases_sand &&
                  touched.oils_and_greases_sand ? (
                    <ErrorMessageText>
                      {errors.oils_and_greases_sand}
                    </ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.death_fishes}
                    fullWidth
                    id="death_fishes"
                    name="death_fishes"
                    required
                    disabled
                    onChange={handleChange}
                    label={language ? 'Death fishes' : 'Peixes mortos'}
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
                      {language ? 'Yes' : 'Sim'}
                    </option>
                    <option key={false} value={false}>
                      {language ? 'No' : 'Não'}
                    </option>
                  </TextFieldStyled>
                  {errors.death_fishes && touched.death_fishes ? (
                    <ErrorMessageText>{errors.death_fishes}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.sewer}
                    fullWidth
                    disabled
                    id="sewer"
                    name="sewer"
                    required
                    onChange={handleChange}
                    label={language ? 'Sewer' : 'Esgoto'}
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
                      {language ? 'Yes' : 'Sim'}
                    </option>
                    <option key={false} value={false}>
                      {language ? 'No' : 'Não'}
                    </option>
                  </TextFieldStyled>
                  {errors.sewer && touched.sewer ? (
                    <ErrorMessageText>{errors.sewer}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.flag}
                    fullWidth
                    disabled
                    id="flag"
                    name="flag"
                    required
                    onChange={handleChange}
                    label={language ? 'Flag' : 'Bandeira'}
                    select
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option key="proper" value="proper">
                      {language ? 'Own' : 'Própria'}
                    </option>
                    <option key="improper" value="improper">
                      {language ? 'Not own' : 'Terceirizada'}
                    </option>
                  </TextFieldStyled>
                  {errors.flag && touched.flag ? (
                    <ErrorMessageText>{errors.flag}</ErrorMessageText>
                  ) : null}
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <TextFieldStyled
                    value={values.sample_sent}
                    fullWidth
                    disabled
                    id="sample_sent"
                    name="sample_sent"
                    required
                    onChange={handleChange}
                    label={language ? 'Sample sent' : 'Amostra enviada'}
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
                      {language ? 'Yes' : 'Sim'}
                    </option>
                    <option key={false} value={false}>
                      {language ? 'No' : 'Não'}
                    </option>
                  </TextFieldStyled>
                  {errors.sample_sent && touched.sample_sent ? (
                    <ErrorMessageText>{errors.sample_sent}</ErrorMessageText>
                  ) : null}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                  <Grid container justify="flex-end">
                    <DialogActions>
                      <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                        // disabled={loading}
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
  updateItem: PropTypes.func.isRequired,
};

export default ModalItem;
