import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  Text,
  RefreshControl,
} from 'react-native';

import LoginStatusMessage from './LoginStatusMessage';
import AuthButton from './AuthButton';
import News from './News';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const data = {
  image_url: 'http://via.placeholder.com/200x200',
  title: '30% discount for 3 months membership, 30% discount for 3 months membership, 30% discount for 3 months membership, 30% discount for 3 months membership',
  location: 'Fitness World @Lao-Itecc',
  valid_till: '2017/6/18',
  like: "10",
  dislike: "20"
}

var refreshing = false;
var serverHost = 'https://borktor.57bytes.com/'
var timeStamp = 0
function _onRefresh() {
  refreshing = true;
  fetch(serverHost + '/news.json?ts='+ timeStamp)
    .then((response) => response.json())
    .then((news) => {
      AsyncStorage.setItem('@NEWS:KEY', JSON.stringify(news));
      refreshing = false;
    })
    .catch((error) => {
      console.error(error);
      refreshing = false;
  });
}
const MainScreen = () => (
  <ScrollView
  refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={_onRefresh.bind(this)}
        />
      }
  >
    <News data={data} like={()=>{}} dislike={()=>{}} />
    <News data={data} like={()=>{}} dislike={()=>{}} />
    <News data={data} like={()=>{}} dislike={()=>{}} />
  </ScrollView>
);

var header = <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'white'}} elevation={5}>
  <Image style={{width:40,height:40}} source={require('../img/logo.png')}/>
  <Text style={{fontSize:18,color:'black'}}> ບອກຕໍ່ </Text>
</View>

MainScreen.navigationOptions = {
  header: header,
  headerStyle: {textAlign:'center'}
};

export default MainScreen;
