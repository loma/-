import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ListView,
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
  header: {
    fontWeight:'100',
    lineHeight:isIpad()?34:28,
    fontSize:isIpad()?22:18,
    fontFamily:'Saysettha OT'
  }
});

var serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'
class LikesScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      modalVisible:true,
      refreshing:true,
      minId:Number.MAX_SAFE_INTEGER,
    }
  }

  loadNews() {
    this.setState({ refreshing:true })
    var posts = []
    for(key in this.props.likes) {
      posts.push(this.props.likes[key])
    }
    this.setState({
      posts:posts,
      refreshing:false
    })
  }

  componentDidMount() {
    this.loadNews()
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var posts = this.state.posts
    var likes = this.props.likes
    var adv = __DEV__ ? null : <View style={{flexDirection:'row',justifyContent:'center'}}>
          <AdMobBanner
            style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
            bannerSize="banner"
            adUnitID="ca-app-pub-5604817964718511/5290589982"
            testDeviceID="EMULATOR" />
        </View>

    for (var index in posts) {
      posts[index]['like'] = likes[posts[index].id] ? true : false
    }
    return (
      <View style={{flex:1,
        paddingTop: (Platform.OS === 'ios') ? 23 : 0
      }}>
        <ListView
          dataSource={ds.cloneWithRows(posts)}
          renderRow={(rowData) => <News data={rowData} lastId={Number.MAX_SAFE_INTEGER} {...this.props}/>}
          refreshing={this.state.refreshing}
          onRefresh={()=>{
          }}
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}
        />
        <Menu page={'likes'} {...this.props} />
      </View>
    )
  }
}

LikesScreen.navigationOptions = ({ navigation }) => ({
  header:null
});

LikesScreen.propTypes = {
};

const mapStateToProps = state => ({
  likes: state.news.likes,
});
const mapDispatchToProps = dispatch => ({
  setReadVersion: (version) => dispatch({ type: 'setReadVersion', value:version }),
  navigate: (page, id, n) => dispatch({ type: page, value:id, name:n }),
  toggleLike: (post) => {
    dispatch({ type: 'toggleLike', value:post })
  },
  initLikes: (likes) => dispatch({ type: 'init-likes', value:likes }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LikesScreen);
