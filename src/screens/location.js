import {StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as TaskManager from 'expo-task-manager';
import { getDistance, getPreciseDistance } from 'geolib';
import locationApi from '../api/location';
import Spinner from 'react-native-loading-spinner-overlay';

const {height, width} = Dimensions.get("window");
const MyMap = props => {
  const loc = null;
  // const TASK_NAME = 'check-location-task';
  const [spinner, setSpinner] = useState(false);
  const [location, setLocation] = useState(loc);
  const [errorMessage, setErrorMessage] = useState(null);
  // const [shouldMapLoad, setShouldMapLoad] = useState(false)
  const [targetLocation, setTargetLocation] = useState({
    latitude: 0,
    longitude: 0,
    radius: 100

  })
  const onLoginPressed = async () => {
    setSpinner(true)
    const targetlocation = await setTarget();
    setSpinner(false)
    if(targetlocation === 0) {
      alert("You're out of the work zone!\n Get in the work area and try again");
    }
    else {
      props.navigation.navigate('Login')
    }
  }
  const setTarget = async () => {
    try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        const response = await locationApi().post('/check', {
            "latitude": location.coords.latitude,
            "longitude": location.coords.longitude,
            "radius": 100
        })
        if(response.data.length === 0){
          return 0
        }
        console.log(response.data)
        const data = response.data[0]
        await AsyncStorage.setItem('kiosk', JSON.stringify(response.data[0]))
        setTargetLocation({latitude: data.location.coordinates[1], longitude: data.location.coordinates[0], radius: data.radius})
        return {latitude: data.location.coordinates[1], longitude: data.location.coordinates[0], radius: data.radius}
    } catch (error) {
        console.log("Error: ", error)
        return 0
    }
  }

  // TaskManager.defineTask(TASK_NAME, async ({ data: { eventType }, error }) => {
  //   if (error) {
  //     console.log(error);
  //     return;
  //   }

  //   if (eventType === Location.GeofencingEventType.Exit) {
  //     console.log("User left the target location");
  //     //logout user or make any other action
  //   }
  // });

  useEffect(() => {
    (async () => {
      // setShouldMapLoad(false)
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied. Enable Location Permissions in your App Settigs');
        return
      }
      let location = await Location.getCurrentPositionAsync({});
      setErrorMessage(null);
      setLocation(location);
      
      // await Location.startGeofencingAsync(TASK_NAME, [targetlocation]);
      
    })();

  }, []);

  if (errorMessage) {
    return (
    <View style={{justifyContent:'center', alignItems: 'center', flex:1}}>
      <Text >Error: {errorMessage}</Text>
    </View>);
  }

  if (!location) {
    return (
      <View style={{justifyContent:'center', alignItems: 'center', flex:1}}>
        <ActivityIndicator style={{alignSelf: 'center', justifyContent:'center'}} size={64} color='#000F4D'/>
      </View>
    )
  }
  if (location) {
    return (
      <>
        <Spinner
          visible={spinner}
          textContent={'Loading...'}
          overlayColor='rgba(0, 0, 0, 0.75)'
          textStyle={styles.spinnerTextStyle}
        />
        <MapView
          coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
          style={{ flex: 1, zIndex: -1}}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.005,
          }}
        >
        <Marker
          coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
          title="You are here!"
          description={`Your location: ${location.coords.latitude}, ${location.coords.longitude}`}
        />
        
        </MapView>
        <Callout style={styles.loginsection}>
          <TouchableOpacity style={styles.loginButton} onPress={()=>{onLoginPressed()}}>
            <Text style={styles.logintext}>Proceed</Text>
          </TouchableOpacity>
        </Callout>
        
      </>
      
    );
  }
  
}
const styles = StyleSheet.create({
  loginButton: {
    justifyContent: 'center', 
    alignSelf: 'center', 
    alignItems: 'center',
    backgroundColor: '#000F4D', 
    width: width*0.8,
    height: 64,
    borderRadius: 36
  },
  loginsection:{
    justifyContent: 'flex-end',
    alignSelf: 'center', 
    alignItems: 'center', 
    bottom: 48,
    elevation: 10,
    zIndex: 2
  },
  logintext: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600'
  },
  spinnerTextStyle: {
    color: '#fff'
  },
})
export default MyMap;
