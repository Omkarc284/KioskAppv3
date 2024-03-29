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
  const [result, setResult] = useState([])
  const [spinner, setSpinner] = useState(false);
  const [location, setLocation] = useState(loc);
  const [latitude, setLatitude] = useState(Number(0.0))
  const [longitude, setLongitude] = useState(Number(0.0))
  const [errorMessage, setErrorMessage] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  // const [shouldMapLoad, setShouldMapLoad] = useState(false)
  // const [targetLocation, setTargetLocation] = useState({
  //   latitude: 0,
  //   longitude: 0,
  //   radius: 100

  // })
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
  const getkiosks = async() => {
    const response = await locationApi().get('/all');
    if(response.status === 200 ||201){
      setResult(response.data)
    }
  }
  const onAdminLogin = async () => {
    props.navigation.navigate('LoginAdmin')
  }
  const setTarget = async () => {
    
    console.log("before location fetch")
    // let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 100});
    
    // setLocation(location);
    console.log("before kiosk fetch: ",location)
    const response = await locationApi().post('/check', {
      "latitude": latitude,
      "longitude": longitude,
      "radius": 100
    })
    console.log("after kiosk fetch")
    if(response.data.length === 0){
      return 0
    }
    console.log(response.data)
    const data = response.data[0]
    await AsyncStorage.setItem('kiosk', JSON.stringify(data))
    
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
      getkiosks();
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
          loadingEnabled={true}
          loadingIndicatorColor='#000F4D'
          onUserLocationChange={val => {
            //console.log(val.nativeEvent.coordinate);
            setLatitude(val.nativeEvent.coordinate.latitude)
            setLongitude(val.nativeEvent.coordinate.longitude)
          }}
          style={{ flex: 1, zIndex: -1}}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.005,
          }}
        >
        {
          (result.length > 0) ? 
          
          result.map((item, index) => {
            // console.log(item.name ,' : ', item.operational)
            var lat = item.location.coordinates[1];
            var long = item.location.coordinates[0];
            return(
              <Marker
                pinColor={(item.operational === false) ? 'navy': 'red'}
                key={item._id}
                coordinate={{latitude: lat, longitude: long}}
                title={item.name}
                description={(item.operational === false) ? 'Inactive': 'Active'}
              />
            )
          })
          
          :

          <View></View>
        }
        
        
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
