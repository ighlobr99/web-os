import styled from 'styled-components';

import colors from '~/styles/colors';

export const StyledContainer = styled.div`
  background: ${colors.white};
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    border: none;
    padding: 10px;
    min-width: 150px;
    max-width: 200px;
    font-size: 18px;
  }
`;
