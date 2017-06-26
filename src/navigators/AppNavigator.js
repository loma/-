import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import MainScreen from '../components/MainScreen';
import CreateScreen from '../components/CreateScreen';
import PromotionsScreen from '../components/PromotionsScreen';

export const AppNavigator = StackNavigator({
  Main: { screen: MainScreen },
  Create: { screen: CreateScreen },
  Promotions: { screen: PromotionsScreen },
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
