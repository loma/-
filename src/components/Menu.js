import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  StyleSheet,
  FlatList,
  Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image'

import Config from './Config';
const conf = new Config();

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'column',
    borderBottomWidth:5,
    borderColor:'#777',
    backgroundColor:'white'
  },
  innerContainer: {
    flex:0.25,
    width:conf.isIpad() ? 350 : 150,
    borderWidth:1,
    borderColor:'white'
  },
  image: {
    flex:1,
    height:conf.isIpad() ? 350 : 150,
  },
  text: {
    fontSize: conf.isIpad() ? 16 : 12,
    lineHeight: conf.isIpad() ? 28 : 20,
    fontFamily:'Saysettha ot',
    color:'#222'
  },
  newIcon: {
    marginLeft:5,
    width:25,
    height:25
  },
  fbIcon: {
    margin:5,
    width:20,
    height:20
  },
  header: {
    fontSize:conf.isIpad()?22:18,
    color:'#222',fontWeight:'100',
    lineHeight:conf.isIpad?34:28,
    fontFamily:'Saysettha OT'
  },
  headerImage: {
    width:conf.isIpad()?60:40,
    height:conf.isIpad()?60:40,
    margin:(Platform.OS === 'ios') ? 2 : 5,
  }
});

class Menu extends React.Component {

  render() {

    const state = this.props.state
    var routeName = state.routes[state.index].routeName

    var mainImg = routeName === 'Main' || routeName === 'Promotions' ? require('../img/logo.png') : require('../img/logo_unselected.png')
    var searchImg = routeName === 'Search' ? require('../img/search.png') : require('../img/search_unselected.png')
    var hotImg = routeName === 'Hot' ? require('../img/fire.png') : require('../img/fire_unselected.png')
    var likeImg = routeName === 'Likes' ? require('../img/heart.png') : require('../img/heart_unselected.png')

    const dispatch = this.props.dispatch
    return (
    <View style={{
      flexDirection:'row',justifyContent:'space-around',
      alignItems:'center',backgroundColor:'white',
      padding: (Platform.OS === 'ios') ? 5 : 0,
    }} elevation={5}>
      <TouchableOpacity onPress={() => {dispatch({type:'main'})} }>
        <Image style={styles.headerImage} source={mainImg}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {dispatch({type:'search'})} }>
        <Image style={styles.headerImage} source={searchImg}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {dispatch({type:'hot'})} }>
        <Image style={styles.headerImage} source={hotImg}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {dispatch({type:'likes'})} }>
        <Image style={styles.headerImage} source={likeImg}/>
      </TouchableOpacity>
    </View>
    )
  }
}
      //<Image style={[styles.headerImage, {opacity:settingsOpacity}]} source={require('../img/settings.png')}/>

Menu.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default Menu
