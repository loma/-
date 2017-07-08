import React, { Component }  from 'react';
import {
  BackHandler
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import MainScreen from '../components/MainScreen';
import PromotionsScreen from '../components/PromotionsScreen';

export const AppNavigator = StackNavigator({
  Main: { screen: MainScreen },
  Promotions: { screen: PromotionsScreen },
});

class AppWithNavigationState extends Component {
    shouldCloseApp(nav) {
      return nav.index === 0;
    }
    componentDidMount() {
      BackHandler.addEventListener('backPress', () => {
        const {dispatch, nav} = this.props
        if (this.shouldCloseApp(nav)) return false
        dispatch({
          type: 'Navigation/BACK'
        })
        return true
      })
    }

    componentWillUnmount() {
      BackHandler.removeEventListener('backPress')
    }
    render() {
      return (
        <AppNavigator navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })} />
        );
    }
  }

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
