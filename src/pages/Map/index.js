/* eslint-disable react/prop-types */
import React, { useEffect, useCallback, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import api from '~/services/api';
import { useToast } from '~/hooks/Toast';

import { StyledContainer, MapItemData } from './styles';
import Button from './Components/Buttons';
import ModalItem from './Components/ModalItem';

import treeImg from '~/assets/images/tree.png';

const MapData = () => {
  const { addToast } = useToast();
  const [data, setData] = useState([]);
  const [item, setItem] = useState();
  const [open, setOpen] = useState(false);

  const getItens = useCallback(
    async value => {
      try {
        const filter = value === undefined ? '' : value;
        const response = await api.get(`beatch?${filter}`);
        // eslint-disable-next-line prefer-const
        setData(response.data);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Ocorreu um erro.',
          description: 'Tente novamente',
        });
      }
    },
    [addToast]
  );
  useEffect(() => {
    getItens();
  }, [getItens]);

  const handleModal = useCallback((type, value) => {
    if (type === 'open') {
      setOpen(true);
      setItem(value);
    } else {
      setOpen(false);
      setItem(null);
    }
  }, []);

  return (
    <StyledContainer maxWidth="sm">
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCxs0m6LclVWmc1cfrePk-dt41lqJzYrzQ' }}
          defaultCenter={{
            lat: -24.17,
            lng: 46.86,
          }}
          defaultZoom={14}
        >
          {data && data.length
            ? data.map(mapData => (
                <MapItemData>
                  <img src={treeImg} alt={`Praia ${mapData.name}`} width="30" />
                  <Button
                    lat={mapData.lat}
                    lng={mapData.long}
                    text={mapData.name}
                    item={mapData}
                    handleModal={handleModal}
                  />
                </MapItemData>
              ))
            : null}
          {/* <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" /> */}
        </GoogleMapReact>
      </div>
      <ModalItem handleCloseModal={handleModal} open={open} item={item} />
    </StyledContainer>
  );
};

export default MapData;
