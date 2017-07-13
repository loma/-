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
    case 'promotions':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Promotions', params: {name: action.name}}),
        state
      );
      break;
    case 'Main':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
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

const uniqueId = require('react-native-device-info').getUniqueID();
const initialNewsState = {
  userId: uniqueId,
  list: { },
  maxId: { },
  lastReadId: { },
  loaded: {status:false},
  visible: false,
  initialPage: 0,
  images: [],
  categories: [],
  selectedCatId: 0
};
function news(state = initialNewsState, action) {
  switch (action.type) {
    case 'promotions':
      return Object.assign({}, state, {
        selectedCatId: action.value
      })
    case 'Main':
      var currentList = Object.assign({}, state.list)
      currentList[action.value.id] = action.value
      currentList[action.value.id]['images'] = []
      return Object.assign({}, state, {
        list: currentList,
        tempNews: { like: 0, dislike: 0 }
      })
    case 'setImage':
      return Object.assign({}, state, {
        initialPage: action.initialPage,
        images: action.images
      })
    case 'setModalVisible':
      return Object.assign({}, state, {
        visible: action.value,
      })
    case 'initCategories':
      return Object.assign({}, state, {
        categories: action.value,
      })
    case 'initLastReadCategories':
      return Object.assign({}, state, {
        lastReadId: Object.assign({}, state.lastReadId, action.value),
      })
    case 'init':
      var newList = {}
      var maxIdByCateogry = {}
      for (var index in action.value) {
        var each = action.value[index]
        newList[each.id] = each
        if (!maxIdByCateogry[each.category_id]) maxIdByCateogry[each.category_id] = 0
        maxIdByCateogry[each.category_id] = Math.max(maxIdByCateogry[each.category_id], each.id)
        if (each.images) newList[each.id]['images'] = each.images.split(',')
        else newList[each.id]['images'] = []
      }
      return Object.assign({}, state, {
        list: newList,
        maxId: maxIdByCateogry,
        loaded: {status:true}
      })
    default:
      return state;
  }
}



const AppReducer = combineReducers({
  nav,
  news,
});

export default AppReducer;
