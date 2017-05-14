/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Animated,
  Picker,
  Button,
  Text,
  View
} from 'react-native';
import Dimensions from 'Dimensions';
import Camera from 'react-native-camera';

export default class timelapse extends Component {
  state = {
    duration: 30,
    photoTakenOpacity: 0,
    showPreview: true,
    frontCamera: false,
    settingFrequency: false,
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.photoTakenOpacity !== prevState.photoTakenOpacity) {
      Animated.timing(
      this.state.photoTakenOpacity,
      {
        toValue: 0,
        duration: 1000,
      }
    ).start();
    }
  }

  animateMessage = () => {
    this.setState({ photoTakenOpacity: new Animated.Value(1) });
  }

  takePicture = () => {
    this.camera.capture()
     .then((data) => console.log(data))
     .catch(err => console.error(err));

     this.animateMessage();
  }

  toggleTimelapse = () => {
    if (this.state.interval) {
      clearInterval(this.state.interval);
      this.setState({ interval: null });
    } else {
      const interval = setInterval(this.takePicture, this.state.duration * 1000);
      this.setState({ interval });
    }
  }

  setDuration = (value) => {
    this.setState({ duration: value });
  }

  togglePreview = () => (this.setState({ showPreview: !this.state.showPreview }));
  toggleCamera = () => (this.setState({ frontCamera: !this.state.frontCamera }));
  toggleEditFrequency = () => (this.setState({ settingFrequency: !this.state.settingFrequency }));

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonGroup}>
          <Button
            onPress={this.togglePreview}
            title="Toggle Preview"
            color="#841584"
          />
          <Button
            onPress={this.toggleCamera}
            title="Switch Camera"
            color="#841584"
          />
        </View>
        <Camera
          style={this.state.showPreview ? styles.preview : styles.hiddenCamera}
          aspect={Camera.constants.Aspect.fill}
          type={this.state.frontCamera ? Camera.constants.Type.front : Camera.constants.Type.back}
          ref={(cam) => (this.camera = cam)}
        >
          <Animated.View
            style={{opacity: this.state.photoTakenOpacity }}
          >
            <Text style={styles.photoMessage}>Taken</Text>
          </Animated.View>
        </Camera>
        <View style={styles.settings}>
          <View style={styles.setting}>
            <Text style={styles.settingLabel}>
              Frequency: {`${this.state.settingFrequency ? '' : this.state.duration + 's'}`}
            </Text>
            {this.state.settingFrequency &&
              <Picker
                style={styles.picker}
                selectedValue={this.state.duration}
                onValueChange={this.setDuration}
              >
                <Picker.Item label="1s" value={1} />
                <Picker.Item label="3s" value={3} />
                <Picker.Item label="5s" value={5} />
                <Picker.Item label="10s" value={10} />
                <Picker.Item label="20s" value={20} />
                <Picker.Item label="30s" value={30} />
                <Picker.Item label="1min" value={60} />
                <Picker.Item label="2min" value={120} />
                <Picker.Item label="5min" value={300} />
                <Picker.Item label="10min" value={600} />
                <Picker.Item label="20min" value={1200} />
                <Picker.Item label="30min" value={1800} />
                <Picker.Item label="45min" value={2700} />
                <Picker.Item label="1hr" value={3600} />
              </Picker>
            }
            {!this.state.interval &&
              <Button
                onPress={this.toggleEditFrequency}
                title={`${this.state.settingFrequency ? 'Accept' : 'Set'}`}
                color="#841584"
              />
            }
          </View>
          {!this.state.settingFrequency &&
            <View style={styles.buttonGroup}>
              <Button
                onPress={this.toggleTimelapse}
                title={`${this.state.interval ? 'Stop' : 'Start'}`}
                color="#841584"
              />
              <Button
                onPress={this.takePicture}
                title="Manual Photo"
                color="#841584"
              />
            </View>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'black',
    height: Dimensions.get('window').height / 2,
    width: Dimensions.get('window').width
  },
  hiddenCamera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    opacity: 'black',
    height: Dimensions.get('window').height / 2,
    width: Dimensions.get('window').width,
    opacity: 0
  },
  photoMessage: {
    fontSize: 36,
    paddingBottom: 20,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'transparent',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  picker: {
    width: Dimensions.get('window').width / 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
  },
  settings: {
    backgroundColor: 'white',
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    width: Dimensions.get('window').width,
  },
  settingLabel: {
    fontSize: 20,
    paddingTop: 7,
    paddingBottom: 7,
  }
});

AppRegistry.registerComponent('timelapse', () => timelapse);
