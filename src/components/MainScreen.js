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
const MainScreen = ({news, like, dislike, myActions}) => {
  var allNews = []
  var _like = like
  var _dislike = dislike
  for(var index in news) {
    allNews.push(<News key={index} myActions={myActions} data={news[index]} dislike={_dislike} like={_like} />)
  }
  return (
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
  )
}

var header = <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'white'}} elevation={5}>
  <Image style={{width:40,height:40}} source={require('../img/logo.png')}/>
  <Text style={{fontSize:24,color:'#4b5056',fontWeight:"500"}}> ບອກຕໍ່ </Text>
</View>

MainScreen.navigationOptions = {
  header: header,
  headerStyle: {textAlign:'center'}
};

MainScreen.propTypes = {
  news: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  dislike: PropTypes.func.isRequired,
  myActions: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  news: state.news.list,
  myActions: state.news.myActions,
});
const mapDispatchToProps = dispatch => ({
  like: (id) => dispatch({ type: 'like', value:id }),
  dislike: (id) => dispatch({ type: 'dislike', value:id }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
