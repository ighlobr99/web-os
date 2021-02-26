/* eslint-disable no-async-promise-executor */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, IconButton, InputBase, Paper } from '@material-ui/core';
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

const Table = ({ onChangeSearch, search, data }) => {
  const classes = useStyles();
  const { language } = useAuth();

  const columns = [
    {
      field: 'beatch.name',
      title: language ? 'Place' : 'Local',
      filtering: false,
      sort: true,
      cellStyle: {
        width: '30%',
        minWidth: '30%',
      },
    },
    {
      field: 'description',
      title: language ? 'Description' : 'Descrição',
      cellStyle: {
        width: '5%',
        minWidth: '5%',
      },
      filtering: false,
      sort: true,
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
  data: PropTypes.shape().isRequired,
};

export default Table;
