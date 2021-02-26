import styled, { css } from 'styled-components';
import NumberFormat from 'react-number-format';

import { TextField } from '@material-ui/core';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 24px;
  justify-content: flex-end;
`;

export const TextFieldStyled = styled(TextField)`
  margin: 8px 0;
  padding: 0 8px;
`;

export const NumberFormatStyled = styled(NumberFormat)`
  margin: 8px 0;
  padding: 0 8px;
`;

export const ErrorMessageText = styled.p`
  color: red;
  padding-bottom: 16px;
  padding-left: 8px;
`;

export const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 600px;
`;

export const Title = styled.h2`
  flex-basis: 50%;
  color: #ff001b;
  ${props =>
    props.situation &&
    css`
      color: #008219;
    `};
`;

export const ResultBeatch = styled.h2`
  flex-basis: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;

  img {
    margin-right: 8px;
  }
`;
