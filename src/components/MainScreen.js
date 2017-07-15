import React, {Component} from 'react';
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
  Dimensions,
  AsyncStorage
} from 'react-native';
import {
  AdMobBanner,
} from 'react-native-admob'
import FastImage from 'react-native-fast-image'
const CachedImage = require('react-native-cached-image');
import { connect } from 'react-redux';
import News from './News';

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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    flex:1,
    paddingTop: (Platform.OS === 'ios') ? 3 : 0,
    paddingBottom: (Platform.OS === 'ios') ? 0 : 3,
    borderColor: '#fff',
    width:Dimensions.get('window').width/3,
    backgroundColor: 'rgba(255,255,255,0.8)',
    color: '#222',textAlign:'center',position:'absolute',bottom:0,
    fontSize:isIpad()?18:14,
    lineHeight:isIpad()?28:25,
    fontFamily:'Saysettha OT'
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

var serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'

class MainScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing:true,
      categories:[],
      maxId:{},
    }
  }

  loadCategories() {
    this.setState({ refreshing:true })
    fetch(serverHost + '/categories.json')
      .then((response) => response.json())
      .then((categories) => {
        this.setState({
          refreshing:false,
          categories:categories
        })
      })
      .catch((error) => {});
  }

  loadReadVersion() {
    const initLastReadCategories = this.props.initLastReadCategories
    AsyncStorage.getItem('@LASTREAD_ID:key')
      .then((result)=>{
        if (result) {
          initLastReadCategories(JSON.parse(result))
        }
      })
  }

  loadMaxId() {
    fetch(serverHost + '/news.json?field=maxId')
      .then((response) => response.json())
      .then((maxId) => {
        this.setState({
          maxId:maxId
        })
      })
      .catch((error) => {});
  }

  componentWillMount() {
    this.loadCategories()
    this.loadMaxId()
    this.loadReadVersion()
  }

  render() {
    var categories = this.state.categories
    var maxId = this.state.maxId
    var lastReadId = this.props.lastReadId
    const promotions = this.props.promotions
    var all = []
    for (var index=0; index<categories.length; index+=3) {

      var temp = []
      for (var innerIndex=index; innerIndex<Math.min(index+3, categories.length); innerIndex++) {
        var notif = null;
        var currentId = lastReadId[categories[innerIndex].id] | 0
        if (currentId < maxId[categories[innerIndex].id]) {
            notif = <View style={{
              marginLeft:5,
              marginTop:2,
              borderRadius:6,
              width:12,height:12,
              backgroundColor:'red',
              top:5,right:7,
              position:'absolute'
            }}>
            </View>
        }
        temp.push(
          <View key={innerIndex} style={{justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity onPress={promotions.bind(this, categories[innerIndex].id, categories[innerIndex].name)}>
                <FastImage
                  resizeMode={ FastImage.resizeMode.cover }
                  elevation={5}
                  style={{backgroundColor:'white',
                    height:Dimensions.get('window').width/3,
                    width:Dimensions.get('window').width/3,
                    borderWidth:1,
                    borderColor: '#fff'
                  }}
                    source={{uri:categories[innerIndex].image}} />
            </TouchableOpacity>
            <Text
            ellipsizeMode='tail'
            numberOfLines={1}
            style={[styles.title, ]} >
              {categories[innerIndex].name}
            </Text>
            {notif}
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
        showsVerticalScrollIndicator={false}
        refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={()=>{
                  this.loadCategories()
                  this.loadMaxId()
                }}
              />
        }>

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
}

var header = <View style={{
  flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'white'}} elevation={5}>
  <Image style={styles.headerImage} source={require('../img/logo.png')}/>
  <Text style={styles.header}>ບອກຕໍ່</Text>
</View>

MainScreen.navigationOptions = {
  header: header,
  headerStyle: {textAlign:'center'}
};

MainScreen.propTypes = {
  promotions: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  lastReadId: state.news.lastReadId,
});
const mapDispatchToProps = dispatch => ({
  promotions: (id, n) => dispatch({ type: 'promotions', value:id, name:n }),
  initLastReadCategories: (lastRead) => dispatch({ type: 'initLastReadCategories', value:lastRead }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
