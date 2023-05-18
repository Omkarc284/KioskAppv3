import React, { useState } from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import kioskApi from "../api/home";


const {height, width} = Dimensions.get('window')
const AddInventory = (props) => {
    const token = props.navigation.state.params.token;
    const summary = props.navigation.state.params.summary;
    var product = {
        id: props.navigation.state.params.id,
        name: props.navigation.state.params.title,
        count: parseInt(props.navigation.state.params.count),
    }
    const [isEditable, setIsEditable] = useState(false);
    const [count, setCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('')

    const updateInventory = async (kioskname, token) => {
        try {
            const response = await kioskApi(token).patch(`/${kioskname}`,{
                "product_id": product.id,
                "Inventory_load_count": count
            });
            if(response.status === 200){
                props.navigation.navigate('Home')
            } else{
                console.log("Error: ", response)
            }
        } catch(err) {
            setErrorMessage('Something went wrong!')
        }
    }
    return (
        <View>
            <View>
                <View style={styles.screen}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.title}>{product.name}</Text> 
                        <IconButton
                            mode='contained-tonal'
                            icon="home"
                            iconColor='#000F4D'
                            size={32}
                            onPress={() => props.navigation.navigate('Home')}
                        />
                    </View>
                     
                </View>
                <View
                    style={{ 
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                
                <View style={styles.inventorybag}>
                    <View>
                        <View style={styles.box}>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: '#626262', fontSize: 16, fontWeight: '300'}}>Currently Available</Text>
                            </View>
                            
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: '#000F4D', fontSize: 46, fontWeight: '900'}}>{product.count}</Text>
                                <Text style={{color: '#000F4D', fontSize: 36, fontWeight: '300'}}> Units</Text>
                            </View>
                            
                        </View>
                    </View>
                    <Image
                    resizeMode="center"
                        style={{ width: width*0.8, height: height*0.3}}
                        source={require('../../../assets/AddInventory0.png')}
                    />
                    <View style={{ marginVertical: height/50,justifyContent: 'center', alignItems: 'center'}}>
                        {
                            isEditable ? 
                            <View>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <View>
                                        <TextInput 
                                            style={styles.input}
                                            underlineColor="transparent"
                                            keyboardType='number-pad'
                                            onChangeText={(value) => {
                                                if(/^-?\d*\.?\d+$/.test(value)){
                                                    setCount(parseInt(value))
                                                }else{
                                                    setCount(0)
                                                }
                                            
                                                
                                            }}
                                        />
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <TouchableOpacity
                                            style={styles.cancelButton}
                                            onPress={()=>{setIsEditable(false)}}
                                        >
                                            <Text style={{color: '#000F4D', fontSize: 24}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.submitButton}
                                            onPress={()=>{
                                                product.count = product.count + count;
                                                updateInventory(summary.kiosk_name,token)
                                                setIsEditable(false)
                                            }}
                                        >
                                            <Text style={{color: '#FFFFFF', fontSize: 24}}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                                </View>
                            </View>
                            : 
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity 
                                    style={styles.AddButton}
                                    onPress={()=>{setIsEditable(true)}}
                                >
                                    <Text style={{color: '#FFFFFF', fontSize: 24, fontWeight: '500'}}>Edit Inventory</Text>
                                </TouchableOpacity>
                            </View> 
                        }
                        
                        
                    </View>
                </View>
                
                
            </View>
            
            
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        margin: 24
    },
    title: {
        flex: 1,
        color:'#000F4D',
        fontSize: 32,
        fontWeight: '500'
    },
    inventorybag: {
        marginTop: height/18,
        alignSelf: 'center'
    },
    box:{
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 40,
        alignSelf: 'center',
        marginBottom: 30,
        height: height/9,
        width: width/2,
        backgroundColor:'#FFFFFF',
        elevation: 10,
    },
    AddButton: {
        borderRadius: 10,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#1182AE',
        height: height/12,
        width: width/2,
        elevation:10
    },
    input:{
        fontSize:24,
        fontWeight: '500',
        marginBottom: 20,
        borderRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: height/11,
        width: width/1.5,
        elevation:10
    },
    submitButton: {
        marginHorizontal: width/20,
        borderRadius: 10,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#000F4D',
        height: height/12,
        width: width/3.6,
        elevation:10
    },
    cancelButton:{
        marginHorizontal: width/20,
        borderRadius: 10,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        height: height/12,
        width: width/3.6,
        elevation:10
    }
})

export default AddInventory