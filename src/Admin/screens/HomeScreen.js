import React, { useContext, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Dimensions} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Context as AuthContext } from "../../Keeper/context/AuthContext";
import Spinner from 'react-native-loading-spinner-overlay';
import HeaderBar from "../Components/Headerbar";


const {height, width} = Dimensions.get('window');
const HomeScreen = (props) => {
  const [spinner, setSpinner] = useState(false);
  const token = props.navigation.state.params.token;
  // const LogoutApi = async () =>{
  //   const response = await logout(keeper.token).post('/logout')
  //   if(response.status === 200){
  //     props.navigation.navigate('Login')
  //   }else{
  //     setErrorMessage('Something went wrong!')
  //     console.log("Error: ", response)
  //   }
    
  // }
  

  return (
    <>
    <HeaderBar navigation={props.navigation}/>
      <ScrollView contentContainerStyle={styles.container} >
        <Spinner
          visible={spinner}
          textContent={'Loading...'}
          overlayColor='rgba(0, 0, 0, 0.75)'
          textStyle={styles.spinnerTextStyle}
        />
        
        <View style={{ flex: 1}}>
          {/* <View style={{ flexDirection: 'row', marginBottom: 18, alignContent:'space-around'}}>
            <View style={{flex: 0.8}}>
              <Text style={{fontSize: 18, color: '#000F4D'}}>Kiosk Name: </Text>
              <Text style={{fontSize: 24, fontWeight: 'bold', color: '#000F4D'}}>Home</Text>
            </View>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={async ()=>{
                setSpinner(true)
                // await logout();
                props.navigation.navigate('Login')
              }}
            >
              <Text style={{fontSize: 18, color: '#fff', fontWeight:'bold'}}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          /> */}
          <View style={{ marginBottom: 18}}>
            <Text style={styles.text}>Choose your task</Text>
          </View>
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.dashboard}
              onPress={()=> props.navigation.navigate('DashboardAdmin',{
                token
              })}
            >
              <View >
                <MaterialIcons name="dashboard-customize" size={54} color="white" />
              </View>
              <View style={{flex:1, marginVertical: 15, justifyContent:'center'}}>
                <Text style={styles.headingText}>Dashboard</Text>
                <Text style={styles.subHeadingText}>Daily stats of your Business.</Text>
              </View>
              
            </TouchableOpacity>
          </View>
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.sales}
              onPress={()=> props.navigation.navigate('Sales',{
                token
              })}  
            >
              <View >
              <FontAwesome5 name="rupee-sign" size={54} color="white" />
              </View>
              <View style={{flex:1, marginVertical: 15, justifyContent:'center'}}>
                <Text style={styles.headingText}>Sales</Text>
                <Text style={styles.subHeadingText}>You can add or edit your sales.</Text>
              </View>
              
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={[styles.dashboard,{backgroundColor: '#EB455F'}]}
              onPress={()=> props.navigation.navigate('Kiosk',{
                token
              })}
            >
              <View >
              <Entypo name="shop" size={54} color="white" />
              </View>
              <View style={{flex:1, marginVertical: 15, justifyContent:'center'}}>
                <Text style={styles.headingText}>Kiosks</Text>
                <Text style={styles.subHeadingText}>Setup or manage your kiosks.</Text>
              </View>
              
            </TouchableOpacity>
          </View>
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.inventory}
              onPress={()=> props.navigation.navigate('Product',{
                token
              })}
            >
              <View >
                <MaterialIcons name="inventory" size={54} color="white" />
              </View>
              <View style={{flex:1, marginVertical: 15, justifyContent:'center'}}>
                <Text style={styles.headingText}>Products</Text>
                <Text style={styles.subHeadingText}>You can add and update your Products here.</Text>
              </View>
              
            </TouchableOpacity>
          </View>
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={[styles.dashboard,{backgroundColor: '#181823'}]}
              // onPress={()=> props.navigation.navigate('Dashboard',{
              //   token
              // })}
            >
              <View >
              <Ionicons name="people-sharp" size={54} color="white" />
              </View>
              <View style={{flex:1, marginVertical: 15, justifyContent:'center'}}>
                <Text style={styles.headingText}>Store Keepers</Text>
                <Text style={styles.subHeadingText}>Setup or manage your staff/keepers.</Text>
              </View>
              
            </TouchableOpacity>
          </View>
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.ratings}
              // onPress={()=> props.navigation.navigate('Ratings',{
              //   token
              // })}  
            >
              <View >
                <MaterialIcons name="rate-review" size={54} color="white" />
              </View>
              <View style={{flex:1, marginVertical: 15, justifyContent:'center'}}>
                <Text style={styles.headingText}>Ratings</Text>
                <Text style={styles.subHeadingText}>Check out how custumers have rated your service!</Text>
              </View>
              
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
    </>
  );
};

const styles = StyleSheet.create({
  container:{
    overflow: 'scroll',
    padding: 30
  },
  
  cardContainer:{
    height: height*0.25,
    justifyContent: 'center',
    elevation: 15
  },
  text: {
    fontSize: 24,
    color: '#000F4D',
  },
  logoutButton: {
    marginTop: 8,
    paddingBottom: 5,
    flex: 0.3,
    height: 48,
    borderRadius: 32,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#000F4D',
    elevation: 15
  },
  inventory: {
    padding:20,
    flex: 0.9,
    backgroundColor: '#1182AE',
    borderRadius: 20,
    elevation: 15
  },
  sales: {
    padding:20,
    flex: 0.9,
    borderRadius: 20,
    backgroundColor: '#6C971F',
    elevation: 15
  },
  dashboard:{
    padding:20,
    flex: 0.9,
    borderRadius: 20,
    backgroundColor: '#E2AC62',
    elevation: 15
  },
  headingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24
  },
  subHeadingText: {
    color: '#fff',
    fontSize: 16
  },
  ratings:{
    backgroundColor:'#443C68',
    padding:20,
    flex: 0.9,
    borderRadius: 20,
    elevation: 15
  },
  spinnerTextStyle: {
    color: '#fff'
  },
});

export default HomeScreen;
