import React from 'react';
import PropTypes from 'prop-types';
import { Button, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

import {
  MKTextField,
  MKColor,
  mdl,
  MKButton,
} from 'react-native-material-kit';

const Textfield = MKTextField.textfield()
  .withPlaceholder('ແມ່ນຫຍັງ?')
  .withStyle({height:42})
  .withTextInputStyle({flex: 1})
  .build();
  const ColoredRaisedButton = MKButton.coloredButton()
    .withText('ບອກດ່ຽວນີ້')
    .build();


var news = {
      id: 7,
      image_url: 'http://via.placeholder.com/200x200',
      title: 'testing 7',
      location: 'Fitness World @Lao-Itecc',
      valid_till: '2017/6/18',
      like: 0,
      dislike: 0
    }
const CreateScreen = ({ navigation }) => {
  var _news = Object.assign({}, news)
  return (
  <View style={{flex:1,margin:10}}>
    <Textfield multiline={true} style={{height:120}} onTextChange={(text) => {_news.title = text}}/>
    <Textfield placeholder={'ຢູ່ໃສ?'} onTextChange={(text)=>{_news.location = text}} />
    <Textfield placeholder={'ຈົນຮອດ?'} onTextChange={(text)=>{_news.valid_till = text}}/>
    <Text/>
    <ColoredRaisedButton onPress={()=>{news.id++;_news.id++;navigation.dispatch({type:'Main',value:_news});}}/>
  </View>
);
}

CreateScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

CreateScreen.navigationOptions = {
  title: 'ມີແນວຊິບອກ!',
};

export default CreateScreen;
