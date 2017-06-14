import 'react-native';
import React from 'react';
import { createStore } from 'redux';
import Index from '../index.android.js';
import { Provider } from 'react-redux';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import MainScreen from '../src/components/MainScreen';
import AppReducer from '../src/reducers';
import AppWithNavigationState from '../src/navigators/AppNavigator';

store = createStore(AppReducer);
it('renders correctly', () => {
  const tree = renderer.create(
    <Index />
  );
});

let findById = function(tree, testID) {
    if(tree.props && tree.props.testID === testID) {
        return tree
    }
    if(tree.children && tree.children.length > 0)
    {
        let childs = tree.children
        for(let i = 0; i < childs.length; i++)
        {
            let item = findById(childs[i], testID)
            if(typeof(item) !== 'undefined') {
                return item
            }
        }
    }
}

it('render main screen correctly', () => {
  const tree = renderer.create(
    <Provider store={store}>
      <MainScreen/>
    </Provider>,
  ).toJSON();
});
