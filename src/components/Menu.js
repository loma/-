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

isIpad = () => {
  var width = Dimensions.get('window').width;
  var height = Dimensions.get('window').height;

  if (width == 768 && height == 1024) return true
  if (width == 834 && height == 1112) return true
  if (width == 1024 && height == 1366) return true

  return false;
}
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
    width:isIpad() ? 350 : 150,
    borderWidth:1,
    borderColor:'white'
  },
  image: {
    flex:1,
    height:isIpad() ? 350 : 150,
  },
  text: {
    fontSize: isIpad() ? 16 : 12,
    lineHeight: isIpad() ? 28 : 20,
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
    fontSize:isIpad()?22:18,
    color:'#222',fontWeight:'100',
    lineHeight:isIpad?34:28,
    fontFamily:'Saysettha OT'
  },
  headerImage: {
    width:isIpad()?60:40,
    height:isIpad()?60:40,
    margin:(Platform.OS === 'ios') ? 2 : 5,
  }
});

class Menu extends React.Component {

  render() {

    var searchOpacity = this.props.page == 'search' ? 1 : 0.4
    var starOpacity = this.props.page == 'likes' ? 1 : 0.4
    var settingsOpacity = this.props.page == 'settings' ? 1 : 0.4


    const navigate = this.props.navigate
    return (
    <View style={{
      flexDirection:'row',justifyContent:'space-around',
      alignItems:'center',backgroundColor:'white',
      padding: (Platform.OS === 'ios') ? 5 : 0,
    }} elevation={5}>
      <TouchableOpacity onPress={() => {if (this.props.page !== 'search') navigate('search')} }>
        <Image style={[styles.headerImage, {opacity:searchOpacity}]} source={require('../img/search.png')}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {if (this.props.page !== 'likes') navigate('likes')} }>
        <Image style={[styles.headerImage, {opacity:starOpacity}]} source={require('../img/heart.png')}/>
      </TouchableOpacity>
    </View>
    )
  }
}
      //<Image style={[styles.headerImage, {opacity:settingsOpacity}]} source={require('../img/settings.png')}/>

Menu.propTypes = {
  page: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default Menu
