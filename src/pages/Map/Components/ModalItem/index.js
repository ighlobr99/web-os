import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';

import { Content, Title, Row, ResultBeatch } from './styles';
import Modal from './Components/ModalItem';
import { useAuth } from '~/hooks/Auth';

import greenImg from '~/assets/images/flaggreen.png';
import redImg from '~/assets/images/flagred.png';

const ModalItem = ({ handleCloseModal, open, item }) => {
  const { language, updateLanguage } = useAuth();
  const [modalComplaint, setModalComplaint] = useState(false);

  const handleCloseModalComplaint = () => {
    setModalComplaint(false);
  };

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
    <Dialog
      // onClose={this.props.handleModalItem}
      aria-labelledby="customized-dialog-title"
      open={open}
      style={{ minWidth: 600 }}
    >
      <DialogTitle onClose={() => handleCloseModal()}>
        <div>
          <Typography variant="h5">
            {language
              ? `Details of ${item && item.name ? item.name : ''}`
              : `Detalhes dos locais de ${item && item.name ? item.name : ''}`}
          </Typography>
        </div>
        <Row>
          <Typography variant="h6" style={{ color: 'red', marginRight: 8 }}>
            {language ? 'Red' : 'Vermelho'}
          </Typography>
          <Typography variant="h6">
            - {language ? 'improper' : 'imprópria'}
          </Typography>
        </Row>
        <Row style={{ marginTop: 0, marginBottom: 12 }}>
          <Typography variant="h6" style={{ color: 'green', marginRight: 8 }}>
            {language ? 'Green' : 'Verde'}
          </Typography>
          <Typography variant="h6">
            - {language ? 'proper' : 'própria'}
          </Typography>
        </Row>
      </DialogTitle>
      <DialogContent style={{ overflowX: 'hidden' }}>
        <Content>
          {item && item.places && item.places.length
            ? item.places.map(place => (
                <ResultBeatch>
                  <img
                    src={place.situation === 'proper' ? greenImg : redImg}
                    alt="Praia"
                    width="30"
                    height="30"
                  />
                  <Title situation={place.situation === 'proper'}>
                    {place.name}
                  </Title>
                </ResultBeatch>
              ))
            : null}
        </Content>
        <DialogActions style={{ marginTop: 24 }}>
          <Button
            variant="outlined"
            onClick={() => setModalComplaint(true)}
            color="primary"
          >
            {language ? 'Report' : 'Formalizar denúncia'}
          </Button>
        </DialogActions>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleChangeLanguage}
            color="primary"
          >
            {language ? 'PT-BR' : 'EN-US'}
          </Button>
        </DialogActions>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => handleCloseModal('close')}
            color="primary"
          >
            {language ? 'Back' : 'Voltar'}
          </Button>
        </DialogActions>
      </DialogContent>
      <Modal
        handleCloseModal={handleCloseModalComplaint}
        open={modalComplaint}
      />
    </Dialog>
  );
};

ModalItem.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  item: PropTypes.node.isRequired,
};

export default ModalItem;
