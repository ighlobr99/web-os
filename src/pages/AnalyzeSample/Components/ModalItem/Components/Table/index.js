/* eslint-disable no-async-promise-executor */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Grid, IconButton } from '@material-ui/core';

import MaterialTable from 'material-table';
import { useAuth } from '~/hooks/Auth';

const Table = ({ data, handleGetItem }) => {
  const { language } = useAuth();
  const columns = [
    {
      field: 'place.name',
      title: language ? 'Place' : 'Local',
      filtering: false,
      sort: true,
      cellStyle: {
        width: '30%',
        minWidth: '30%',
      },
    },
    {
      field: 'result',
      title: language ? 'Result' : 'Resultado',
      filtering: false,
      sort: true,
      cellStyle: {
        width: '30%',
        minWidth: '30%',
      },
    },
    {
      field: 'sample_sent',
      title: language ? 'Sample sent' : 'Amostra enviada',
      filtering: false,
      sort: true,
      cellStyle: {
        width: '30%',
        minWidth: '30%',
      },
      render: rowData => (
        <Grid container>
          <Grid item>
            {rowData.sample_sent !== false ? (
              <IconButton
                aria-label="delete"
                style={{ color: 'green' }}
                size="small"
              >
                <Icon>check</Icon>
              </IconButton>
            ) : (
              <IconButton
                style={{ color: 'red' }}
                variant="contained"
                size="small"
              >
                <Icon>close</Icon>
              </IconButton>
            )}
          </Grid>
        </Grid>
      ),
    },
    {
      field: 'actions',
      title: language ? 'Actions' : 'Ações',
      filtering: false,
      sort: false,
      cellStyle: {
        width: '15%',
        minWidth: '15%',
      },
      render: rowData => (
        <Grid container>
          <Grid item>
            <IconButton
              color="primary"
              variant="contained"
              size="small"
              onClick={() => {
                handleGetItem(rowData);
              }}
            >
              <Icon>edit</Icon>
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ];

  const options = {
    print: false,
    download: false,
    viewColumns: false,
    search: false,
    filtering: false,
    actionsColumnIndex: -1,
    filterType: 'checkbox',
    responsive: 'scroll',
    pageSize: 5,
    page: 0,
  };

  return (
    <div>
      <MaterialTable
        title=""
        data={data}
        columns={columns}
        options={options}
        localization={{
          pagination: {
            labelDisplayedRows: '{from}-{to} de {count}',
            labelRowsSelect: '',
            labelRowsPerPage: '',
            firstTooltip: '',
            previousTooltip: '',
            nextTooltip: '',
            lastTooltip: '',
          },
        }}
      />
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.shape().isRequired,
  handleGetItem: PropTypes.func.isRequired,
};

export default Table;
