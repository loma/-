import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Modal,
  Alert,
  TouchableHighlight,
  Image,
  View,
  AsyncStorage,
  Dimensions,
  ScrollView,
  Text,
  RefreshControl,
  FlatList,
  Platform
} from 'react-native';
import {
  AdMobBanner,
} from 'react-native-admob'
import DialogBox from 'react-native-dialogbox';
import {OptimizedFlatList} from 'react-native-optimized-flatlist'

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
  header: {
    fontWeight:'100',
    lineHeight:isIpad()?34:28,
    fontSize:isIpad()?22:18,
    fontFamily:'Saysettha OT'
  }
});

var serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'
function _onRefresh(init, initCat) {
  return fetch(serverHost + '/news.json')
    .then((response) => response.json())
    .then((news) => {
      init(news)
    })
    .catch((error) => {
      init([])
  });
}
//const PromotionsScreen = ({selectedCatId, initCat, news, loaded, init}) => {
class PromotionsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      news:[],
      modalVisible:true,
      refreshing:true,
      minId:Number.MAX_SAFE_INTEGER
    }
  }

  loadNews() {
    this.setState({ refreshing:true })
    var category_id = this.props.selectedCatId
    fetch(serverHost + '/news.json?category_id=' + category_id)
      .then((response) => response.json())
      .then((news) => {
        var minId = news[news.length - 1].id
        this.setState({
          refreshing:false,
          news:news,
          minId:minId
        })
      })
      .catch((error) => {
        this.setState({ refreshing:false })
       });
  }

  componentWillMount() {
    this.loadNews()
  }

  componentDidMount() {
    //Alert.alert('title','message')
    /*
    var readVersion = parseInt(this.props.readVersion)
    const setReadVersion = this.props.setReadVersion
    if (readVersion < 1) {
      setTimeout(() => {this.dialogbox.tip({
        title: <Text style={styles.header}>ບອກຕໍ່</Text>,
  			content: <Text style={{
          fontFamily:'Saysettha OT',
          lineHeight:28,
        }}>ເຈົ້າສາມາດສະໄລ້ໄປທາງຂ້າງເພື່ອເບິ່ງຮູບຕື່ມໄດ້</Text>,
  		}).then(() => {
        AsyncStorage.setItem('@READ_VERSION:key', '1')
          .then((error)=>{
            if (error == null) {
              setReadVersion(1)
            }
          })
      });
    }, 1000);
    }
    */
  }

  componentWillUnmount() {
    const initLastReadCategories = this.props.initLastReadCategories
    var lastReadId = this.props.lastReadId
    lastReadId[this.props.selectedCatId] = this.props.maxId[this.props.selectedCatId]
    AsyncStorage.setItem('@LASTREAD_ID:key', JSON.stringify(lastReadId))
      .then((error)=>{
        if (error == null) {
          initLastReadCategories(lastReadId)
        }
      })
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  handleLoadMore() {
    if (this.state.refreshing) return
    this.setState({ refreshing:true })
    var category_id = this.props.selectedCatId
    fetch(serverHost + '/news.json?field=more&id='+this.state.minId+'&category_id=' + category_id)
      .then((response) => response.json())
      .then((news) => {
        var minId = this.state.minId
        var oldNews = this.state.news
        for(var n of news) {
          if (n.id < minId) {
            oldNews.push(n)
            minId = n.id
          }
        }
        this.setState({
          refreshing:false,
          news:oldNews,
          minId:minId
        })
      })
      .catch((error) => {
        this.setState({ refreshing:false })
      });
  }

  render() {
    var maxIdRead = this.props.maxId[this.props.selectedCatId]
    var news = this.state.news

    var adv = __DEV__ ? null : <View style={{flexDirection:'row',justifyContent:'center'}}>
          <AdMobBanner
            style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
            bannerSize="banner"
            adUnitID="ca-app-pub-5604817964718511/5290589982"
            testDeviceID="EMULATOR" />
        </View>

    var lastReadId = this.props.lastReadId
    var lastId = lastReadId[this.props.selectedCatId] | 0;
    return (
      <View style={{flex:1}}>
        <FlatList
          data={news}
          renderItem={({item}) => <News data={item} lastId={lastId}/> }
          extraData={this.state}
          keyExtractor = {(item, index) => item.id}
          refreshing={this.state.refreshing}
          showsVerticalScrollIndicator={false}
          onRefresh={()=>{
            this.setState({refreshing:true})
            _onRefresh(this.props.init, this.props.initCat)
              .then(()=>{
                this.setState({refreshing:false})
              })
          }}
          onEndReached={() => {this.handleLoadMore()}}
          onEndReachedThreshold={0.25}
        />
        {adv}
      </View>
    )
  }
}

PromotionsScreen.navigationOptions =
  ({ navigation }) => ({
    title: <Text style={styles.header}>{navigation.state.params.name}</Text>,
  });

PromotionsScreen.propTypes = {
  selectedCatId: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  selectedCatId: state.news.selectedCatId,
  maxId: state.news.maxId,
  lastReadId: state.news.lastReadId,
  readVersion: state.news.readVersion
});
const mapDispatchToProps = dispatch => ({
  initLastReadCategories: (lastRead) => dispatch({ type: 'initLastReadCategories', value:lastRead }),
  setReadVersion: (version) => dispatch({ type: 'setReadVersion', value:version }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionsScreen);
