import React, { useContext, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Dimensions} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Context as AuthContext } from "../context/AuthContext";


const {height, width} = Dimensions.get('window');
const HomeScreen = (props) => {
  const {logout} = useContext(AuthContext);
  const tempkeeper = props.navigation.state.params.data.keeper
  const tempkiosk = props.navigation.state.params.data.kiosk
  const [keeper, setKeeper] = useState({
    username: tempkeeper.username,
    token: props.navigation.state.params.data.token
  });
  const [kiosk, setKiosk] = useState({
    name: tempkiosk.name,
    id: tempkiosk._id,
    products: tempkiosk.products
  });

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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ flex: 1}}>
          <View style={{ flexDirection: 'row', marginBottom: 18, alignContent:'space-around'}}>
            <View style={{flex: 0.8}}>
              <Text style={{fontSize: 18, color: '#000F4D'}}>Kiosk Name: </Text>
              <Text style={{fontSize: 24, fontWeight: 'bold', color: '#000F4D'}}>{kiosk.name}</Text>
            </View>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={logout}
            >
              <Text style={{fontSize: 18, color: '#fff', fontWeight:'bold'}}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View style={{marginTop: 18, marginBottom: 18}}>
            <Text style={styles.text}>Choose your task</Text>
          </View>
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.inventory}
              onPress={()=> props.navigation.navigate('Inventory',{
                keeper: keeper,
                kiosk: kiosk
              })}
            >
              <View >
                <MaterialIcons name="inventory" size={54} color="white" />
              </View>
              <View style={{flex:1, marginVertical: 15, justifyContent:'center'}}>
                <Text style={styles.headingText}>Inventory</Text>
                <Text style={styles.subHeadingText}>You can check and update the quantity of products here.</Text>
              </View>
              
            </TouchableOpacity>
          </View>
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.sales}
              onPress={()=> props.navigation.navigate('Sale',{
                keeper: keeper,
                kiosk: kiosk
              })}  
            >
              <View >
              <FontAwesome5 name="rupee-sign" size={54} color="white" />
              </View>
              <View style={{flex:1, marginVertical: 15, justifyContent:'center'}}>
                <Text style={styles.headingText}>Sale</Text>
                <Text style={styles.subHeadingText}>You can Update the sale of products and keep track of bills.</Text>
              </View>
              
            </TouchableOpacity>
          </View>
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.dashboard}
              onPress={()=> props.navigation.navigate('Dashboard')}
            >
              <View >
                <MaterialIcons name="dashboard-customize" size={54} color="white" />
              </View>
              <View style={{flex:1, marginVertical: 15, justifyContent:'center'}}>
                <Text style={styles.headingText}>Dashboard</Text>
                <Text style={styles.subHeadingText}>Shows overall analytics of your outlet.</Text>
              </View>
              
            </TouchableOpacity>
          </View>
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.ratings}
              onPress={()=> props.navigation.navigate('Ratings',{
                keeper: keeper,
                kiosk: kiosk
              })}  
            >
              <View >
                <MaterialIcons name="rate-review" size={54} color="white" />
              </View>
              <View style={{flex:1, marginVertical: 15, justifyContent:'center'}}>
                <Text style={styles.headingText}>Rate Us!</Text>
                <Text style={styles.subHeadingText}>Let us know how can we serve you better!</Text>
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
    backgroundColor:'#29128A',
    padding:20,
    flex: 0.9,
    borderRadius: 20,
    elevation: 15
  }
});

export default HomeScreen;
