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
  Platform,
  Dimensions
} from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'react-native-admob'
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
var serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'
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
  for (var index=0; index<categories.length; index+=3) {

    var temp = []
    for (var innerIndex=index; innerIndex<Math.min(index+3, categories.length); innerIndex++) {
      temp.push(
        <View key={innerIndex} style={{justifyContent:'center',alignItems:'center'}}>
      <TouchableOpacity onPress={promotions.bind(this, categories[innerIndex].id, categories[innerIndex].name)}>
          <Image
          resizeMode="cover"
          elevation={5}
          style={{backgroundColor:'white',
            height:Dimensions.get('window').width/3,
            width:Dimensions.get('window').width/3,
            borderWidth:1,
            borderColor: '#fff'
          }}
            source={{uri:categories[innerIndex].image}} >
          </Image>
      </TouchableOpacity>
          <Text
          ellipsizeMode='tail'
          numberOfLines={1}
          style={{
            paddingTop: (Platform.OS === 'ios') ? 3 : 0,
            borderLeftWidth:10,
            borderRightWidth:10,
            borderColor: '#fff',
            width:Dimensions.get('window').width/3,
            alignItems:'center',
            justifyContent:'center',
            backgroundColor: 'rgba(255,255,255,0.8)',
            color: '#222',textAlign:'center',position:'absolute',bottom:0,
            fontSize:14,lineHeight:25,fontFamily:'Saysettha OT'}}>
              {categories[innerIndex].name}
          </Text>
        </View>
      )
    }
    all.push(
    <View key={index} style={{flexDirection:'row'}}>
      {temp}
    </View>
    )

  }

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

    <View style={{flexDirection:'column',justifyContent:'space-around'}}>
      {all}
    </View>

    </ScrollView>
    <View style={{flexDirection:'row',justifyContent:'center'}}>
      <AdMobBanner
        style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
        bannerSize="banner"
        adUnitID="ca-app-pub-5604817964718511/5290589982"
        testDeviceID="EMULATOR" />
      </View>
    </View>
  )
}

var header = <View style={{
  flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'white'}} elevation={5}>
  <Image style={{width:40,height:40,margin:(Platform.OS === 'ios') ? 2 : 5,}} source={require('../img/logo.png')}/>
  <Text style={{fontSize:18,color:'#222',fontWeight:'100',lineHeight:28,fontFamily:'Saysettha OT'}}>ບອກຕໍ່</Text>
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
