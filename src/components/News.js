import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions
} from 'react-native';
const CachedImage = require('react-native-cached-image');

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
  fbIcon: {
    margin:5,
    width:30,
    height:30
  }
});

const News = ({ data }) => {
  images = [];
  index = 0;
  for (var image of data.images)
    if (image !== '')
    images.push(
      <View key={index++} style={styles.innerContainer}>
        <CachedImage resizeMode="cover" source={{uri:image}} style={styles.image} />
      </View>
    )
return (
  <View style={styles.container} elevation={5}>
    <ScrollView horizontal={true}>
      {images}
    </ScrollView>

    <Text style={[styles.text, {marginLeft: 10,marginTop:5,marginLeft:10}]} numberOfLines={5}>{data.title}</Text>
    <View style={{flexDirection:'row',alignItems:'center' }}>
      <TouchableOpacity onPress={()=>{Linking.openURL(data.fb_url).catch(err => console.error('An error occurred', err));}}>
        <CachedImage source={require('../img/fb.png')} style={styles.fbIcon} />
      </TouchableOpacity>
      <Text style={styles.text}>ກົດເພື່ອເບິ່ງລາຍລະອຽດໃນເຟສບຸກ</Text>
    </View>

  </View>
)
}

News.propTypes = {
  data: PropTypes.object.isRequired,
};

export default News
