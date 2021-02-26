import styled from 'styled-components';

import colors from '~/styles/colors';

export const StyledContainer = styled.div`
  background: ${colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 100vh;
  width: 100%;
`;

export const MapItemData = styled.div`
  display: flex;
  flex-direction: row;
  background: white;
  border-radius: 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  min-width: 150px;
  max-width: 200px;
  img {
    padding: 8px 0;
  }
`;
