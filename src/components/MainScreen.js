import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  Text,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
const MK = require('react-native-material-kit');
const {
  MKButton,
  MKTouchable,
  MKColor,
} = MK;
import { connect } from 'react-redux';

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
const ColoredFlatButton = MKButton.coloredFlatButton()
  .withText('BUTTON')
  .build();

var button = <MKButton
  backgroundColor={MKColor.Teal}
  shadowRadius={2}
  shadowOffset={{width:0, height:2}}
  shadowOpacity={.7}
  shadowColor="black"
  onPress={() => {
    console.log('hi, raised button!');
  }}
  >
  <Text pointerEvents="none"
        style={{color: 'white', fontWeight: 'bold',}}>
    RAISED BUTTON
  </Text>
</MKButton>
const PlainFab = MKButton.coloredFab()
  .withStyle({borderColor:'white'})
  .build();

const MainScreen = ({news, like, dislike, myActions, createNews}) => {
  var allNews = []
  var _like = like
  var _dislike = dislike
  for(var index in news) {
    allNews.push(<News key={index} myActions={myActions} data={news[index]} dislike={_dislike} like={_like} />)
  }
  allNews.push(<View key={0} style={{height:100}}></View>)
  return (
    <View style={{flex:1}}>
    <ScrollView
    refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh.bind(this)}
          />
        }
    >
    {allNews}
    </ScrollView>
    <View style={{padding:20,justifyContent:'flex-end',flexDirection:'row',position:'absolute',bottom:0,right:0}}>
            <PlainFab onPress={()=>{createNews()}}>
            <Text style={{fontSize:24,color:'white'}}>+</Text>
            </PlainFab>
          </View>
    </View>
  )
}

var header = <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'white'}} elevation={5}>
  <Image style={{width:40,height:40}} source={require('../img/logo.png')}/>
  <Text style={{fontSize:20,color:'#4b5056',fontWeight:"500"}}> ບອກຕໍ່ </Text>
</View>

MainScreen.navigationOptions = {
  header: header,
  headerStyle: {textAlign:'center'}
};

MainScreen.propTypes = {
  news: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  dislike: PropTypes.func.isRequired,
  createNews: PropTypes.func.isRequired,
  myActions: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  news: state.news.list,
  myActions: state.news.myActions,
});
const mapDispatchToProps = dispatch => ({
  like: (id) => dispatch({ type: 'like', value:id }),
  dislike: (id) => dispatch({ type: 'dislike', value:id }),
  createNews: (id) => dispatch({ type: 'createNews' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
