import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';

// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const secondAction = AppNavigator.router.getActionForPathAndParams('Login');
const initialNavState = AppNavigator.router.getStateForAction(
  firstAction,
);

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'Main':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;
    case 'createNews':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Create' }),
        state
      );
      break;
    case 'Login':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;
    case 'Logout':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

const initialAuthState = { isLoggedIn: false };

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'Login':
      return { ...state, isLoggedIn: true };
    case 'Logout':
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
}

const initialNewsState = {
  myActions: {},
  list: { }
};
function news(state = initialNewsState, action) {
  switch (action.type) {
    case 'Main':
      var currentList = Object.assign({}, state.list)
      currentList[action.value.id] = action.value
      return Object.assign({}, state, {
        list: currentList
      })
    case 'like':
      var currentAction = Object.assign({}, state.myActions)
      currentAction[action.value] = 1
      return Object.assign({}, state, {
        myActions: currentAction
      })
    case 'dislike':
      var currentAction = Object.assign({}, state.myActions)
      currentAction[action.value] = -1
      return Object.assign({}, state, {
        myActions: currentAction
      })
    case 'Login':
      return { ...state, isLoggedIn: true };
    case 'Logout':
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
}

const AppReducer = combineReducers({
  nav,
  auth,
  news
});

export default AppReducer;
