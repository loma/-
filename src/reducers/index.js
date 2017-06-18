import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';

// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
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
  list: { },
  tempNews: {      like: 0,
      dislike: 0
 }
};
var _id = 1;
function news(state = initialNewsState, action) {
  switch (action.type) {
    case 'Main':
      var news = Object.assign({}, state.tempNews)
      if (news.title === undefined) return state
      if (news.location === undefined) return state
      if (news.valid_till === undefined) return state
      var currentList = Object.assign({}, state.list)
      news.id = _id++;
      currentList[news.id] = news
      return Object.assign({}, state, {
        list: currentList,
        tempNews: {
      like: 0,
      dislike: 0
        }
      })
    case 'like':
      var currentNews = Object.assign({}, state.list)
      var currentAction = Object.assign({}, state.myActions)
      if (currentAction[action.value] === 1) {
        currentAction[action.value] = 0
        currentNews[action.value].like -= 1;
      } else {
        if (currentAction[action.value] === -1)
          currentNews[action.value].dislike -= 1;
        currentAction[action.value] = 1
        currentNews[action.value].like += 1;
      }
      return Object.assign({}, state, {
        myActions: currentAction,
        list: currentNews
      })
    case 'dislike':
      var currentNews = Object.assign({}, state.list)
      var currentAction = Object.assign({}, state.myActions)
      if (currentAction[action.value] === -1) {
        currentNews[action.value].dislike -= 1;
        currentAction[action.value] = 0
      } else {
        if (currentAction[action.value] === 1)
          currentNews[action.value].like -= 1;
        currentNews[action.value].dislike += 1;
        currentAction[action.value] = -1
      }
      return Object.assign({}, state, {
        myActions: currentAction,
        list: currentNews
      })
    case 'Login':
      return { ...state, isLoggedIn: true };
    case 'Logout':
      return { ...state, isLoggedIn: false };
    case 'setTempDate':
      var news = Object.assign({}, state.tempNews, {
        valid_till: action.value.toISOString().substring(0, 10)
      })
      return Object.assign({}, state, {
        tempNews: news
      })
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
