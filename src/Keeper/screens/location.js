import {StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as TaskManager from 'expo-task-manager';
import locationApi from '../api/location';
import Spinner from 'react-native-loading-spinner-overlay';
import colors from '../utils/colors';

const {height, width} = Dimensions.get("window");
const MyMap = props => {
  const loc = null;
  // const TASK_NAME = 'check-location-task';
  const [spinner, setSpinner] = useState(false);
  const [location, setLocation] = useState(loc);
  const [errorMessage, setErrorMessage] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
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
  const onAdminLogin = async () => {
    props.navigation.navigate('LoginAdmin')
  }
  const setTarget = async () => {
    
    console.log("before location fetch")
    let location = await Location.getCurrentPositionAsync();
    let response1;
    setLocation(location);
    console.log("before kiosk fetch: ",location)
    await fetch('http://192.168.0.106:3000/location/check', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "latitude": location.coords.latitude,
        "longitude": location.coords.longitude,
        "radius": 100
      }),
    }).then(response => response.json())
    .then(json => {
      console.log(json)
      response1 = json
    })
    .catch(error => {
      console.log("Error: ", error)
      return 0
    });;
    // await locationApi().post('/check', {
    //   "latitude": location.coords.latitude,
    //   "longitude": location.coords.longitude,
    //   "radius": 100
    // }).then((response1) => {
    //   response = response1
    // })
    console.log("after kiosk fetch")
    if(response1.length === 0){
      return 0
    }
    console.log(response1)
    const data = response1[0]
    await AsyncStorage.setItem('kiosk', JSON.stringify(response1[0]))
    setTargetLocation({latitude: data.location.coordinates[1], longitude: data.location.coordinates[0], radius: data.radius})
    return {latitude: data.location.coordinates[1], longitude: data.location.coordinates[0], radius: data.radius}
  }
  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   setTimeout(() => {
  //     setRefreshing(false);
  //   }, 1000);
  // }, []);
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
      await AsyncStorage.clear();
      console.log('Async cleared');
      let {status} = await Location.requestForegroundPermissionsAsync();
      console.log('location aquired:'+status);
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied. Enable Location Permissions in your App Settigs');
        setLocation(null)
      }
      let location = await Location.getLastKnownPositionAsync()
      console.log(location)
      setLocation(location);
      // await Location.startGeofencingAsync(TASK_NAME, [targetlocation]);
      location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 100});
      console.log(location)
      setLocation(location);
    })();

  }, []);

  while (errorMessage) {
    return (
    <View style={{justifyContent:'center', alignItems: 'center', flex:1}}>
      <Text >Error: {errorMessage}</Text>
    </View>);
  }

  while (!location) {
    return (
      <View style={{justifyContent:'center', alignItems: 'center', flex:1}}>
        <ActivityIndicator style={{alignSelf: 'center', justifyContent:'center'}} size={64} color='#000F4D'/>
      </View>
    )
  }
  while (location) {
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
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
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
          <View style={{flexDirection:'row', marginTop: 15, alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Are you an Admin?  </Text>
            <TouchableOpacity style={{}} onPress={()=>{onAdminLogin()}}>
              <Text style={{color: colors.blue, fontSize:16, fontWeight:'bold'}}>Tap here!</Text>
            </TouchableOpacity>
          </View>
          
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
    bottom: height*0.048,
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
