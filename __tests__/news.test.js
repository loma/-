
import 'react-native';
import React from 'react';
import { createStore } from 'redux';
import Index from '../index.android.js';
import { Provider } from 'react-redux';

import AppReducer from '../src/reducers';
import AppWithNavigationState from '../src/navigators/AppNavigator';

import renderer from 'react-test-renderer';

import News from '../src/components/News';
store = createStore(AppReducer);

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

const data = {
  id: 1,
  image_url: 'this is image url',
  title: 'title',
  location: 'location',
  valid_till: '2017/6/18',
  like: '1',
  dislike: '10',
}

it('render news correctly', () => {
  const tree = renderer.create(
    <Provider store={store}>
      <News data={data}/>
    </Provider>,
  ).toJSON();

  expect(findById(tree, 'image_url_test').props.source.uri).toBe(data.image_url)
  expect(findById(tree, 'title_test').children[0]).toBe(data.title)
  expect(findById(tree, 'location_test').children[0]).toBe(data.location)
  expect(findById(tree, 'valid_till_test').children[0]).toBe(data.valid_till)
  expect(findById(tree, 'like_test').children[0]).toBe(data.like)
  expect(findById(tree, 'dislike_test').children[0]).toBe(data.dislike)
});

const mockPressable = (name) => {
  const RealComponent = require.requireActual(name);
  class Component extends RealComponent {
    render() {
      return React.createElement(
        RealComponent.displayName || RealComponent.name,
        { ...this.props, onClick: this.props.onPress },
        this.props.children
      );
    }
  }
  return Component;
};
jest.mock('TouchableOpacity', () => mockPressable('TouchableOpacity'));

it('dispatch like button', () => {
  const like = jest.fn()
  const dislike = jest.fn()
  const tree = renderer.create(
    <Provider store={store}>
      <News data={data} like={like} dislike={dislike}/>
    </Provider>,
  ).toJSON()
  findById(tree, 'like_button_test').props.onClick()
  findById(tree, 'dislike_button_test').props.onClick()
  expect(like).toBeCalledWith(data.id)
  expect(dislike).toBeCalledWith(data.id)
});
