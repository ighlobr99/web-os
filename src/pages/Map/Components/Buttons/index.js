import React from 'react';
import PropTypes from 'prop-types';

import { StyledContainer } from './styles';

const Buttons = ({ item, handleModal }) => {
  return (
    <StyledContainer>
      <button type="button" onClick={() => handleModal('open', item)}>
        {item.name}
      </button>
    </StyledContainer>
  );
};

Buttons.propTypes = {
  item: PropTypes.shape().isRequired,
  handleModal: PropTypes.func.isRequired,
};

export default Buttons;
