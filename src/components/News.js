import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

const News = ({ data, like, dislike, myActions }) => {
  var likeBGColor = myActions[data.id] === 1 ? '#7c8ec4' : 'white'
  var dislikeBGColor = myActions[data.id] === -1 ? '#c65e68' : 'white'
  var till = new Date(data.valid_till)
return (
  <View style={{flexDirection:'row',borderBottomWidth:5,borderColor:'#777',backgroundColor:'white'}} elevation={5}>
    <View style={{flex:1,flexDirection:'column',marginRight:5,marginLeft:5}}>
      <Text numberOfLines={5} ellipsizeMode={'tail'} style={{fontSize:12,marginTop:5,marginLeft:5}} testID={'title_test'}>{data.title}</Text>
      <View style={{flexDirection:'row',alignItems:'center' }}>
        <Image source={require('../img/gps.png')} style={{margin:2, width:20,height:20}} />
        <Text style={{fontSize:12}} testID={'location_test'}>{data.location}</Text>
      </View>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:-8 }}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <Image source={require('../img/calendar.png')} style={{margin:2, width:20,height:20}} />
          <Text style={{fontSize:12}} testID={'valid_till_test'}>{till.toISOString().substring(0,10)}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'flex-end',}}>
            <View elevation={2} style={{borderRadius:3,margin:5,paddingLeft:5,paddingRight:5,backgroundColor:likeBGColor,alignItems:'center'}}>
              <TouchableOpacity style={{alignItems:'center',flexDirection:'row'}} testID={'like_button_test'} onPress={()=>{like(data.id)}}>
                <Image source={require('../img/like.png')} style={{margin:5, width:20,height:20}} />
                <Text style={{fontSize:10}} testID={'like_test'}>{data.like}</Text>
              </TouchableOpacity>
            </View>
          <TouchableOpacity testID={'dislike_button_test'} onPress={()=>{dislike(data.id)}}>
            <View elevation={2} style={{borderRadius:3,margin:5,paddingLeft:5,paddingRight:5,backgroundColor:dislikeBGColor,alignItems:'center'}}>
              <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} testID={'like_button_test'} onPress={()=>{dislike(data.id)}}>
                <Image source={require('../img/dislike.png')} style={{margin:5,width:20,height:20}} />
                <Text style={{fontSize:10}} testID={'dislike_test'}>{data.dislike}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
)
}

News.propTypes = {
  data: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  dislike: PropTypes.func.isRequired,
};

export default News
