import React from 'react';
import { Switch } from 'react-router-dom';
import RouteWrapper from './Route';

import SignIn from '~/pages/SignIn';
import Dashboard from '~/pages/Dashboard';
import Sector from '~/pages/Sector';
import Users from '~/pages/Users';
import City from '~/pages/City';
import Beatch from '~/pages/Beatch';
import BeatchPlace from '~/pages/BeatchPlace';
import Matrix from '~/pages/Matrix';
import ServiceOrder from '~/pages/ServiceOrder';
import AnalyzeSample from '~/pages/AnalyzeSample';
import ApproveSample from '~/pages/ApproveSample';
import MapData from '~/pages/Map';

const Routes = () => {
  return (
    <Switch>
      <RouteWrapper path="/" exact component={MapData} />
      <RouteWrapper path="/sign" exact component={SignIn} />
      <RouteWrapper path="/dashboard" isPrivate exact component={Dashboard} />
      <RouteWrapper
        path="/dashboard/sector"
        isPrivate
        exact
        component={Sector}
      />
      <RouteWrapper
        path="/dashboard/beatches"
        isPrivate
        exact
        component={Beatch}
      />
      <RouteWrapper
        path="/dashboard/beatches_places"
        isPrivate
        exact
        component={BeatchPlace}
      />
      <RouteWrapper
        path="/dashboard/matrix"
        isPrivate
        exact
        component={Matrix}
      />
      <RouteWrapper
        path="/dashboard/service_order"
        isPrivate
        exact
        component={ServiceOrder}
      />
      <RouteWrapper path="/dashboard/users" isPrivate exact component={Users} />
      <RouteWrapper path="/dashboard/cities" isPrivate exact component={City} />
      <RouteWrapper
        path="/dashboard/analyze_sample"
        isPrivate
        exact
        component={AnalyzeSample}
      />
      <RouteWrapper
        path="/dashboard/approve_sample"
        isPrivate
        exact
        component={ApproveSample}
      />
    </Switch>
  );
};

export default Routes;
