import React,{useState} from 'react';
import {View, Text, StyleSheet, FlatList, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import HeaderBar from '../../Components/Headerbar';
const {width, height} = Dimensions.get('window');
const DashboardScreen = (props) => {
    const [errorMessage, setErrorMessage] = useState(null)
    const token = props.navigation.state.params.token
    
    return (
        <>
            <HeaderBar navigation={props.navigation}/>
            <ScrollView contentContainerStyle={styles.container} >
                <View style={{flex: 1}}>
                    <View style={styles.cardContainer}>
                      <TouchableOpacity 
                        style={styles.inventory}
                        onPress={() => props.navigation.navigate('InventoryAdmin',{
                          token: token
                        })}
                      >
                        <View >
                            <MaterialIcons name="inventory" size={54} color="white" />
                        </View>
                        <View style={{flex:1, marginVertical: 15, justifyContent:'center'}}>
                          <Text style={styles.headingText}>Inventory</Text>
                          <Text style={styles.subHeadingText}>Track your Inventory</Text>
                        </View>
                      
                      </TouchableOpacity>
                    </View>
                    <View style={styles.cardContainer}>
                      <TouchableOpacity 
                        style={styles.sales}
                        onPress={()=> props.navigation.navigate('CollectionAdmin',{
                          token: token
                        })}  
                      >
                        <View >
                        <FontAwesome5 name="rupee-sign" size={54} color="white" />
                        </View>
                        <View style={{flex:1, marginVertical: 15, justifyContent:'center'}}>
                          <Text style={styles.headingText}>Sales Collection</Text>
                          <Text style={styles.subHeadingText}>Check the income of your business.</Text>
                        </View>
                        
                      </TouchableOpacity>
                    </View>
                    <View style={styles.cardContainer}>
                      <TouchableOpacity 
                        style={styles.dashboard}
                        onPress={()=> props.navigation.navigate('AttendanceAdmin',{
                          token: token
                        })}  
                      >
                        <View >
                        <FontAwesome5 name="user-check" size={54} color="white" />
                        </View>
                        <View style={{flex:1, marginVertical: 15, justifyContent:'center'}}>
                          <Text style={styles.headingText}>Attendance</Text>
                          <Text style={styles.subHeadingText}>Check the attendance of your staff.</Text>
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
    padding: 24
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
    backgroundColor: '#181823',
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

export default DashboardScreen;