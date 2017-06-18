import React from 'react';
import PropTypes from 'prop-types';
import {
    Keyboard,
    Button,
    StyleSheet,
    Text,
    View,
    DatePickerAndroid
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

import {
    MKTextField,
    MKColor,
    mdl,
    MKButton,
    MKRadioButton
} from 'react-native-material-kit';
import {
    connect
} from 'react-redux';

const Textfield = MKTextField.textfield()
    .withStyle({
        height: 42
    })
    .withTextInputStyle({
        flex: 1
    })
    .build();
const ColoredRaisedButton = MKButton.coloredButton()
    .withText('ບອກຕໍ່')
    .build();


var news = {
    id: 7,
    image_url: 'http://via.placeholder.com/200x200',
    title: '',
    location: '',
    valid_till: '',
    like: 0,
    dislike: 0
}

function openDate() {
    try {
        return DatePickerAndroid.open({
            date: new Date()
        })
    } catch ({
        code,
        message
    }) {
        console.warn('Cannot open date picker', message);
    }
}
var timeGroup = new MKRadioButton.Group();
const CreateScreen = ({
    navigation,
    setTempDate,
    tempNews
}) => {
    return (
      < View style = { { flex: 1, margin: 10 } } >
        <Textfield placeholder = { 'ແມ່ນຫຍັງ?' }
        multiline = { true }
        style = { { height: 120 } }
        onTextChange = { (text) => { tempNews.title = text } } />
        <Textfield placeholder = { 'ຢູ່ໃສ?' }
        onTextChange = { (text) => { tempNews.location = text } } />
        < Textfield placeholder = { 'ຈົນຮອດ?' }
        onFocus = {
            (e) => {
                openDate().then((d) => {
                    setTempDate(new Date(d.year, d.month, d.day + 1))
                    Keyboard.dismiss()
                })
            }
        } value = { tempNews.valid_till } />

        < Text / >
        < Text / >
        < ColoredRaisedButton onPress = {
            () => {
                navigation.dispatch({
                    type: 'Main'
                });
            }
        } />
      < /View>
    );
}

CreateScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
    setTempDate: PropTypes.func.isRequired,
    tempNews: PropTypes.object.isRequired,
};

CreateScreen.navigationOptions = {
    title: 'ມີແນວຊິບອກ!',
};

const mapStateToProps = state => ({
    tempNews: state.news.tempNews,
});
const mapDispatchToProps = dispatch => ({
    setTempDate: (date) => dispatch({
        type: 'setTempDate',
        value: date
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateScreen);
