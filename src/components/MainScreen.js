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
import Menu from './Menu';

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
  newIcon: {
    position:'absolute',
    top: 5,
    right: 5,
    width:20,
    height:20
  },
});

var serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'

class MainScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing:true,
      pages:[],
      categories:[]
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
  loadShops() {
    this.setState({ refreshing:true })
    fetch(serverHost + '/pages.json')
      .then((response) => response.json())
      .then((pages) => {
        this.setState({
          refreshing:false,
          pages:pages
        })
      })
      .catch((error) => {});
  }

  loadReadVersion() {
    const initLastReadCategories = this.props.initLastReadCategories
    AsyncStorage.getItem('@LASTREADID:key')
      .then((result)=>{
        if (result) {
          initLastReadCategories(JSON.parse(result))
        }
      })
  }

  loadLikes() {
    const initLikes = this.props.initLikes
    AsyncStorage.getItem('@LIKES:key')
      .then((result)=>{
        if (result) {
          initLikes(JSON.parse(result))
        }
      })
  }

  componentWillMount() {
    this.loadCategories()
    this.loadLikes()
    this.loadShops()
    this.loadReadVersion()
  }

  render() {
    var categories = this.state.categories
    var pages = this.state.pages
    var lastReadId = this.props.lastReadId
    const promotions = this.props.promotions

    var tempCategories = {}
    for (var c of categories) {
      tempCategories[c.id] = {
        header: <View key={'h' + c.id} style={{
            backgroundColor:'white',
            alignItems:'center',
          }}
          elevation={2}>
            <Text style={{
              fontSize:18,
              margin:5,
              color:'#222',
              fontFamily:'Saysettha OT'
            }}>{c.name}</Text>
          </View>,
        pages: []
      }
    }

    for (var p of pages) {
      var cId = p.category_id
      if (tempCategories[cId]) {

        var notif = null;
        var pageId = p.id
        var name = p.name
        var currentId = lastReadId[pageId] | 0
        var lastId = p.last_id | 0
        if (currentId < lastId) {
            notif = <Image resizeMode={'contain'} source={require('../img/star.png')} style={styles.newIcon} />
        }
        tempCategories[cId].pages.push(
          <View key={p.id} style={{
            justifyContent:'center',
            alignItems:'center'
          }}>
            <TouchableOpacity onPress={promotions.bind(this, pageId, name)}>
              <FastImage
                resizeMode={ FastImage.resizeMode.cover }
                elevation={3}
                style={{backgroundColor:'white',
                  height:Dimensions.get('window').width/3,
                  width:Dimensions.get('window').width/3,
                }}
                source={{uri:p.picture}} />
            </TouchableOpacity>
            <Text
              ellipsizeMode='tail'
              numberOfLines={1}
              style={styles.title}>
              {p.name}
            </Text>
            {notif}
          </View>
        )
      }
    }

    var adv = <View style={{
      flexDirection:'row',justifyContent:'center',
      borderColor:'#CCC',backgroundColor:'rgba(0,0,0,0)',
      borderBottomWidth:5
    }}>
          <AdMobBanner
            style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
            bannerSize="banner"
            adUnitID="ca-app-pub-5604817964718511/5290589982"
            testDeviceID="EMULATOR" />
        </View>

    var all = []
    var categoryIndex = 0;
    for (var cId in tempCategories) {
      if (tempCategories[cId].pages.length === 0) continue
      all.push(tempCategories[cId].header)
      var pageCount = tempCategories[cId].pages.length
      var pages = tempCategories[cId].pages
      for (var index=0; index<pageCount; index+=3) {
        var temp = []
        for (var innerIndex=index; innerIndex<Math.min(index+3, pageCount); innerIndex++) {
          temp.push(pages[innerIndex])
        }
        all.push(
          <View key={'r' + cId + '-' + index}>
            <View key={index} style={{flexDirection:'row'}}>
              {temp}
            </View>
          </View>
        )
      }
      all.push(<View key={'e' + cId} style={{padding:2,backgroundColor:'#CCC'}}></View>)
    }



    return (
      <View style={{flex:1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={()=>{
                  this.loadShops()
                }}
              />
        }>

      <View style={{flexDirection:'column',justifyContent:'space-around'}}>
        {all}
      </View>

      </ScrollView>
      <Menu page={'search'} {...this.props}/>
      </View>
    )
  }
}


MainScreen.navigationOptions = {
  header: null,
};

MainScreen.propTypes = {
  promotions: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  lastReadId: state.news.lastReadId,
});
const mapDispatchToProps = dispatch => ({
  navigate: (page, id, n) => dispatch({ type: page, value:id, name:n }),
  promotions: (id, n) => dispatch({ type: 'promotions', value:id, name:n }),
  initLastReadCategories: (lastRead) => dispatch({ type: 'initLastReadCategories', value:lastRead }),
  initLikes: (likes) => dispatch({ type: 'init-likes', value:likes }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
