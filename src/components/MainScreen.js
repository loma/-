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
  Platform
} from 'react-native';
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
var serverHost = __DEV__ ? 'http://10.0.2.2:3000' : 'https://borktor.57bytes.com/'
const uniqueId = require('react-native-device-info').getUniqueID();
function _onRefresh(init, initCategories) {
  fetch(serverHost + '/categories.json')
    .then((response) => response.json())
    .then((categories) => {
      refreshing = false;
      initCategories(categories)
    })
    .catch((error) => {});

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

const MainScreen = ({promotions, categories, loaded, init, initCategories}) => {
  if (!loaded.status) {
    refreshing = true
    _onRefresh(init, initCategories)
  }

  var all = []
  for(var index in categories)
    all.push(
      <TouchableOpacity key={index} onPress={promotions.bind(this, categories[index].id, categories[index].name)}>
        <View style={{justifyContent:'center',alignItems:'center'}}>
          <Image elevation={5} style={{backgroundColor:'white',width:100,height:100}} source={{uri:categories[index].image}} />
          <Text style={{marginTop: 5,fontSize:18}}>{categories[index].name}</Text>
        </View>
      </TouchableOpacity>
    )

  return (
    <View style={{flex:1}}>
    <ScrollView
    refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={()=>{_onRefresh(init, initCategories)}}
          />
        }
    >

    <View style={{marginTop:30,marginLeft:30,marginRight:30,flexDirection:'row',justifyContent:'space-around'}}>
      {all}
    </View>

    </ScrollView>
    </View>
  )
}

var header = <View style={{
  marginTop:(Platform.OS === 'ios') ? 20 : 0,
  flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'white'}} elevation={5}>
  <Image style={{width:40,height:40}} source={require('../img/logo.png')}/>
  <Text style={{fontFamily:'Saysettha ot',fontSize:20,color:'#4b5056',fontWeight:"500",padding:5}}> ບອກຕໍ່ </Text>
</View>

MainScreen.navigationOptions = {
  header: header,
  headerStyle: {textAlign:'center'}
};

MainScreen.propTypes = {
  categories: PropTypes.array.isRequired,
  promotions: PropTypes.func.isRequired,
  loaded: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  categories: state.news.categories,
  loaded: state.news.loaded,
});
const mapDispatchToProps = dispatch => ({
  init: (news) => dispatch({ type: 'init', value:news }),
  initCategories: (cats) => dispatch({ type: 'initCategories', value:cats }),
  promotions: (id, n) => dispatch({ type: 'promotions', value:id, name:n }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
