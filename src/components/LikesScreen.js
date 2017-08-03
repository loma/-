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

import { connect } from 'react-redux';
import News from './News';

import Config from './Config';
const conf = new Config();


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontWeight:'100',
    lineHeight:conf.isIpad()?34:28,
    fontSize:conf.isIpad()?22:18,
    fontFamily:'Saysettha OT'
  }
});

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
    if (this.props.configs.log_activity === 'true') {
      var data = {'uId':conf.getUniqueID(),'page':'like'}
      fetch(conf.getApiEndPoint() + '/activities.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data)
      })
    }
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var posts = this.state.posts
    var likes = this.props.likes

    for (var index in posts) {
      posts[index]['like'] = likes[posts[index].id] ? true : false
    }

    var list = null
    if (posts.length === 0 && this.state.refreshing === false) {
      list = <View style={{flex:1,padding:30}}>
          <Text style={{textAlign:'center',lineHeight:28,color:'#777',fontSize:16,fontFamily:'Saysettha OT'}}>
            ເຈົ້າຍັງບໍ່ມີສິນຄ້າທີ່ມັກ, ກົດໃສ່ຮູບຫົວໃຈເພື່ອບັນທຶກ
          </Text>
          <Image resizeMode={'contain'} style={{height:'100%',width:'100%'}} source={require('../img/heart-tutorial.png')} />
        </View>
    } else {
      list = <ListView
          dataSource={ds.cloneWithRows(posts)}
          renderRow={(rowData) => <News data={rowData} lastId={Number.MAX_SAFE_INTEGER} {...this.props}/>}
          refreshing={this.state.refreshing}
          onRefresh={()=>{
          }}
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}
        />
    }

    return (
      <View style={{flex:1}}>
      <View style={{
          backgroundColor:'#e77d1f',
          alignItems:'center',
          paddingTop: (Platform.OS === 'ios') ? 23 : 0
        }}
        elevation={2}>
          <Text style={{
            fontSize:16,
            lineHeight:23,
            margin:8,
            color:'white',
            fontFamily:'Saysettha OT'
          }}>ສິນຄ້າທີ່ຂ້ອຍມັກ</Text>
        </View>
        {list}
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
  configs: state.news.configs,
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
