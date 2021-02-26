/* eslint-disable no-async-promise-executor */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Icon, Grid, IconButton, InputBase, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import MaterialTable from 'material-table';
import { useAuth } from '~/hooks/Auth';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const Table = ({
  onChangeSearch,
  search,
  alteredStatus,
  data,
  handleGetItem,
}) => {
  const classes = useStyles();
  const { language } = useAuth();

  const handleChangeStatus = useCallback(
    async (secureId, type, beatch, status, os) => {
      alteredStatus(secureId, type, beatch, status, os);
    },
    [alteredStatus]
  );

  const columns = [
    {
      field: 'osSub.place.name',
      title: language ? 'Place' : 'Local',
      filtering: false,
      sort: true,
      cellStyle: {
        width: '30%',
        minWidth: '30%',
      },
    },
    {
      field: 'status_os_sub',
      title: language ? 'Status place' : 'Status do ponto',
      filtering: false,
      sort: true,
      cellStyle: {
        width: '30%',
        minWidth: '30%',
      },
      render: rowData => (
        <div>
          {rowData.status === 'improper'
            ? 'Impŕoprio para banho'
            : 'Próprio para banho'}
        </div>
      ),
    },
    {
      field: 'status',
      title: 'Status',
      cellStyle: {
        width: '5%',
        minWidth: '5%',
      },
      filtering: false,
      sort: true,
      render: rowData => (
        <div>{rowData.status === true ? 'Aprovado' : 'Pendente'}</div>
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
                handleGetItem(rowData.osSub);
              }}
            >
              <Icon>more</Icon>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              color="primary"
              variant="contained"
              size="small"
              onClick={() => {
                handleChangeStatus(
                  rowData.id,
                  true,
                  rowData.osSub.beatch_place_id,
                  rowData.status_os_sub,
                  rowData.osSub.serviceOrder.id
                );
              }}
            >
              <Icon>check</Icon>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              color="primary"
              variant="contained"
              size="small"
              onClick={() => {
                handleChangeStatus(rowData.id, 'delete');
              }}
            >
              <Icon>delete</Icon>
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

  const handleSearch = useCallback(
    type => {
      if (type === 'Enter') {
        search();
      }
    },
    [search]
  );

  const handleSubmit = useCallback(e => {
    e.preventDefault();
  }, []);

  return (
    <div>
      <Grid
        container
        justify="flex-end"
        alignItems="center"
        style={{ marginBottom: 10 }}
        spacing={16}
      >
        <Paper
          component="form"
          onSubmit={handleSubmit}
          className={classes.root}
        >
          <InputBase
            className={classes.input}
            placeholder={language ? 'Search' : 'Pesquisar'}
            onChange={e => onChangeSearch(e.target.value)}
            onKeyPress={e => handleSearch(e.key)}
            inputProps={{ 'aria-label': 'pesquisar' }}
          />
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Grid>
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
  onChangeSearch: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  alteredStatus: PropTypes.func.isRequired,
  data: PropTypes.shape().isRequired,
  handleGetItem: PropTypes.func.isRequired,
};

export default Table;
