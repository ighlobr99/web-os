/* eslint-disable array-callback-return */
import React, { useEffect, useCallback, useState } from 'react';

import api from '~/services/api';
import { useToast } from '~/hooks/Toast';
import Table from './Components/Table';
import ModalItem from './Components/ModalItem';
import { useAuth } from '~/hooks/Auth';

import { Container, PaperStyled, IconStyled, ButtonStyled } from './styles';

const Item = () => {
  const { addToast } = useToast();
  const { user, language } = useAuth();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState();

  const getItens = useCallback(
    async value => {
      try {
        const filter = value === undefined ? '' : value;
        const response = await api.get(`service_order?${filter}`);
        // eslint-disable-next-line prefer-const
        if (response.data && response.data.length) {
          if (user.level === 'collector') {
            const dataArr = [];
            response.data.map(resp => {
              if (resp.tech_id === user.id) {
                dataArr.push(resp);
              }
            });
            setData(dataArr);
          } else {
            setData(response.data);
          }
        }
      } catch (err) {
        addToast({
          type: 'error',
          title: language ? 'An error has occurred.' : 'Ocorreu um erro.',
        });
      }
    },
    [addToast, user, language]
  );

  const handleChangeSearch = useCallback(value => {
    setSearch(value);
  }, []);

  const handleSearch = useCallback(() => {
    if (search !== '') {
      const filter = `name=${search}`;
      getItens(filter);
    } else {
      const filter = '';
      getItens(filter);
    }
  }, [search, getItens]);

  const handleStatus = useCallback(
    async (secure_id, value) => {
      const obj = {
        status: value,
      };
      try {
        await api.put(`service_order/${secure_id}`, { ...obj });
        addToast({
          type: 'success',
          title: language ? 'Registered successfully' : 'Salvo com sucesso',
        });
        getItens();
      } catch (err) {
        addToast({
          type: 'error',
          title: language ? 'An error has occurred.' : 'Ocorreu um erro.',
        });
      }
    },
    [addToast, getItens, language]
  );

  useEffect(() => {
    getItens();
  }, [getItens]);

  const handleGetItem = useCallback(e => {
    if (e) setItem(e);
    setOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpen(false);
    setItem(null);
  }, []);

  return (
    <Container>
      <PaperStyled>
        <ButtonStyled
          variant="contained"
          color="primary"
          // className={Item.addTutor}
          onClick={() => {
            setItem(null);
            setOpen(!open);
          }}
        >
          <IconStyled>add</IconStyled>
          {language ? 'Add SO' : 'Nova OS'}
        </ButtonStyled>
        <Table
          data={data}
          // getItens={this.getItens.bind(this)}
          onChangeSearch={handleChangeSearch}
          search={handleSearch}
          // courseInfo={courseInfo}
          alteredStatus={handleStatus}
          handleGetItem={handleGetItem}
        />
        {/* <AddCourse
              open={openAddCourse}
              loading={loading}
              courseInfo={courseInfo}
              error={error}
              handleModalAddCourse={this.handleModalAddCourse.bind(this)}
              onChangeCourseInfo={this.onChangeCourseInfo.bind(this)}
              addCourse={this.addCourse}
            />
            <SnackbarCustomized
              variant={this.state.type}
              visible={this.state.visible}
              handleClose={this.handleCloseAlert.bind(this)}
              message={this.state.message}
            /> */}
      </PaperStyled>
      <ModalItem
        handleCloseModal={handleCloseModal}
        open={open}
        getItens={getItens}
        item={item}
      />
    </Container>
  );
};

export default Item;
