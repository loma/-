import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet
} from 'react-native';

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
    width:150,
    borderWidth:1,
    borderColor:'white'
  },
  image: {
    flex:1,
    height:150
  },
  text: {
    fontSize:12,
    lineHeight:20,
    fontFamily:'Saysettha ot'
  },
  fbIcon: {
    margin:2,
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
        <Image resizeMode="cover" source={{uri:image}} style={styles.image} />
      </View>
    )
return (
  <View style={styles.container} elevation={5}>
    <ScrollView horizontal={true}>
      {images}
    </ScrollView>

    <View style={{flexDirection:'row',alignItems:'center' }}>
      <TouchableOpacity onPress={()=>{Linking.openURL(data.fb_url).catch(err => console.error('An error occurred', err));}}>
        <Image source={require('../img/fb.png')} style={styles.fbIcon} />
      </TouchableOpacity>
      <Text style={styles.text}>{data.title}</Text>
    </View>

  </View>
)
}

News.propTypes = {
  data: PropTypes.object.isRequired,
};

export default News
