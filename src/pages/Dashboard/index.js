/* eslint-disable array-callback-return */
import React, { useEffect, useCallback, useState } from 'react';

import api from '~/services/api';
import { useToast } from '~/hooks/Toast';
import Table from './Components/Table';
import TableOs from './Components/TableOs';
import { useAuth } from '~/hooks/Auth';

import { Container, PaperStyled, TypographyStyled } from './styles';

const Dashboard = () => {
  const { user, language } = useAuth();
  const { addToast } = useToast();
  const [data, setData] = useState([]);
  const [os, setOs] = useState([]);
  const [search, setSearch] = useState([]);

  const getOs = useCallback(
    async value => {
      try {
        const filter = value === undefined ? '' : value;
        const response = await api.get(`service_order?${filter}`);
        // eslint-disable-next-line prefer-const
        if (response.data && response.data.length) {
          if (user.level === 'collector') {
            const dataArr = [];
            response.data.map(resp => {
              if (resp.tech_id === user.id && resp.status === 'open') {
                dataArr.push(resp);
              }
            });
            setOs(dataArr);
          } else {
            const dataArr = [];
            response.data.map(resp => {
              if (resp.status === 'open') {
                dataArr.push(resp);
              }
            });
            setOs(dataArr);
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

  const getItens = useCallback(
    async value => {
      try {
        const filter = value === undefined ? '' : value;
        const response = await api.get(`complaint?${filter}`);
        // eslint-disable-next-line prefer-const
        setData(response.data);
      } catch (err) {
        addToast({
          type: 'error',
          title: language ? 'An error has occurred.' : 'Ocorreu um erro.',
        });
      }
    },
    [addToast, language]
  );

  const handleChangeSearch = useCallback(value => {
    setSearch(value);
  }, []);

  const handleSearch = useCallback(() => {
    if (search !== '') {
      const filter = `description=${search}`;
      getItens(filter);
    } else {
      const filter = '';
      getItens(filter);
    }
  }, [search, getItens]);

  useEffect(() => {
    getItens();
    getOs();
  }, [getItens, getOs]);

  return (
    <Container>
      <PaperStyled>
        <TypographyStyled>
          {language ? 'Complaints:' : 'Denúncias:'}
        </TypographyStyled>
        <Table
          data={data}
          // getItens={this.getItens.bind(this)}
          onChangeSearch={handleChangeSearch}
          search={handleSearch}
          // courseInfo={courseInfo}
        />

        <TypographyStyled style={{ marginTop: 60 }}>
          {language ? 'SO opened:' : 'OS Abertas:'}
        </TypographyStyled>
        <TableOs
          data={os}
          // getItens={this.getItens.bind(this)}
          onChangeSearch={handleChangeSearch}
          search={handleSearch}
          // courseInfo={courseInfo}
        />
      </PaperStyled>
    </Container>
  );
};

export default Dashboard;
