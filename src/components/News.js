import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Platform,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  FlatList,
  AsyncStorage,
  Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';

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
    borderBottomWidth:15,
    borderColor:'#CCC',
    backgroundColor:'white'
  },
  infoContainer: {
    paddingLeft:10,
    marginTop:5,
    borderBottomWidth:1,
    borderColor:'#CCC',
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'flex-start'
  },
  description: {
    fontSize: isIpad() ? 16 : 12,
    lineHeight: isIpad() ? 28 : 20,
    fontFamily:'Saysettha ot',
    color:'#222',marginLeft: 10,
    marginTop:5,
    marginRight:10,
    marginBottom:5
  },
  newIcon: {
    width: 20,
    height: 20,
    marginRight:5
  },
  fbIcon: {
    margin:5,
    width:30,
    height:30
  },
  singleImage: {
    width:200,
    height:200
  },
  multipleImages: {
    width:200,
    height:200,
    marginLeft:0.5,
    marginRight:0.5
  },
  info: {
    fontFamily:'Saysettha OT',
    color:'#999',
    fontSize:10,
    textAlign: "center",
    paddingTop:5
  },
  actionContainer: {
    flexDirection:'row',
    justifyContent:'space-around',
    borderTopWidth:1,
    borderColor:'#CCC'
  }
});

const serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'
const uniqueId = require('react-native-device-info').getUniqueID();

class News extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      like:false
    }
  }
  timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " ປີ\n";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " ເດືອນ\n";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " ມື້\n";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " ຊົ່ວໂມງ\n";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " ນາທີ\n";
    }
    return Math.floor(seconds) + " ວິນາທີ";
  }

  componentDidMount() {
    this.setState({like:this.props.data.like})
  }

  like(post) {
    const toggleLike = this.props.toggleLike
    toggleLike(post)
    this.setState({like:!this.state.like})
  }

  fbLink(link) {
    if (this.props.configs.log_activity === 'true') {
      var log = {'uId':uniqueId,'page':'fb_link','value':link}
      fetch(serverHost + '/activities.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(log)
      })
    }
    Linking.openURL(link).catch(err => console.error('An error occurred', err));
  }

  renderImages() {
    var data = this.props.data
    imagesData = data.images.split(',').filter((a) => a!=='')
    if (imagesData.length === 1) {
      return (<View style={{alignItems:'center'}}>
        <Image resizeMode={'contain'} source={{uri:imagesData[0]}} style={styles.singleImage} />
      </View>)
    } else {
      return (<FlatList
          initialNumToRender={3}
          style={{height:200,backgroundColor:'white',flex:1}}
          data={imagesData}
          keyExtractor = {(item, index) => index}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item,index}) =>
            <FastImage
              resizeMode={ FastImage.resizeMode.cover }
              source={{ uri:item, priority: FastImage.priority.normal, }}
              style={styles.multipleImages} />
        }/>)
    }
  }

  render() {
    var data = this.props.data
    var lastId = this.props.lastId

    var newIcon = data.id > lastId ? <Image resizeMode={'contain'} source={require('../img/fire.png')} style={styles.newIcon} /> : null
    var heartImg = this.state.like ? require('../img/heart.png') : require('../img/heart_unselected.png')
    var fbIcon = require('../img/fb-icon.png')
    var timeIcon = require('../img/time.png')

    var info = this.timeSince(new Date(data.created_time))

    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          {newIcon}
          <Image resizeMode={'contain'} source={timeIcon} style={styles.newIcon} />
          <Text style={styles.info}>{info}</Text>
        </View>
        <View>
          {this.renderImages()}
        </View>
        <Text style={styles.description} numberOfLines={9}>
          {data.description}
        </Text>
        <View style={styles.actionContainer}>
            <TouchableOpacity onPress={ () => {this.like(this.props.data) }}>
              <Image resizeMode={'contain'} source={heartImg} style={[styles.fbIcon]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{ this.fbLink(data.link) }}>
              <Image resizeMode={'contain'} source={fbIcon} style={styles.fbIcon} />
            </TouchableOpacity>
        </View>
      </View>
    )
  }
}

News.propTypes = {
  data: PropTypes.object.isRequired,
  lastId: PropTypes.number.isRequired,
};
const mapStateToProps = state => ({
  configs: state.news.configs
});
const mapDispatchToProps = dispatch => ({
  toggleLike: (post) => { return dispatch({ type: 'toggleLike', value:post }) },
});
export default connect(mapStateToProps, mapDispatchToProps)(News);
