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
  ActivityIndicator
} from 'react-native';
const MK = require('react-native-material-kit');
const {
  MKButton,
  MKColor,
} = MK;
import { connect } from 'react-redux';

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
const uniqueId = require('react-native-device-info').getUniqueID();
function _onRefresh(init, initLikes) {
  refreshing = true;
  fetch(serverHost + '/likes.json?uid='+ uniqueId)
    .then((response) => response.json())
    .then((likes) => {
      initLikes(likes)
    })
    .catch((error) => { });

  fetch(serverHost + '/news.json')
    .then((response) => response.json())
    .then((news) => {
      refreshing = false;
      init(news)
    })
    .catch((error) => {
      refreshing = false;
      init([])
  });
}

const ColoredFlatButton = MKButton.coloredFlatButton()
  .withText('BUTTON')
  .build();

const PlainFab = MKButton.coloredFab()
  .withStyle({borderColor:'white'})
  .build();

const MainScreen = ({news, initLikes, like, dislike, myActions, createNews, loaded, init}) => {
  if (!loaded.status) {
    refreshing = true
    _onRefresh(init, initLikes)
  }

  var allNews = []
  var _like = like
  var _dislike = dislike
  var keys = Object.keys(news);
  var values = keys.map(function(v) { return news[v]; });
  values.sort((a,b) => {
    if (a.like===b.like) return a.dislike-b.dislike
    return b.like-a.like
  })

  for(var index in values) {
    var date = new Date(values[index].valid_till)
    var now = new Date()
    if (date - now > 0)
      allNews.push(<News key={values[index].id} myActions={myActions} data={values[index]} dislike={_dislike} like={_like} />)
  }
  allNews.push(<View key={0} style={{height:100}}></View>)
  return (
    <View style={{flex:1}}>
    <ScrollView
    refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={()=>{_onRefresh(init, initLikes)}}
          />
        }
    >
    {allNews}
    </ScrollView>
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
  loaded: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  news: state.news.list,
  loaded: state.news.loaded,
  myActions: state.news.myActions,
});
const mapDispatchToProps = dispatch => ({
  like: (id) => dispatch({ type: 'like', value:id }),
  dislike: (id) => dispatch({ type: 'dislike', value:id }),
  createNews: (id) => dispatch({ type: 'createNews' }),
  init: (news) => dispatch({ type: 'init', value:news }),
  initLikes: (likes) => dispatch({ type: 'initLikes', value:likes }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
