import React, {  useState } from 'react';
import {View, Text, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';

const {height, width} = Dimensions.get('window')
const SaleModal = ({ product, navigation, isVisible, setVisible }) => {
    const [disabled, setDisabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [quantity, setQuantity] = useState(1)

    return(
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Modal
                animationType = 'fade'
                isVisible = {isVisible}
                backdropOpacity={0.8}
                onBackButtonPress={()=>{navigation.navigate('Home')}}
                onDismiss={()=>{navigation.navigate('Home')}}
            >
                <View style = {styles.modal}>  
                    <View style={{margin: 24, flex:1}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex:1}}>
                                <Text style = {styles.title}>{product.product_name}</Text>
                                <Text style={styles.text}>{product.count} units</Text> 
                            </View>
                            <View>
                                <Text style={styles.title}>₹ {product.product_price}</Text> 
                                <Text style={styles.text}>/ per bag</Text>
                            </View>
                            
                        </View>
                        <View style={{justifyContent: 'center', marginVertical: 32, flex: 1}}>
                            <View>
                                <Text style={{color:'#4A4B4D', fontSize: 20, fontWeight: 'bold'}}>Quantity of Units to sell:</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent:'center', alignItems: 'center'}}>
                                <View>
                                    <TouchableOpacity 
                                        style={styles.SmallButtons}
                                        onPress={() => {
                                            if(quantity < 2){
                                                return
                                            }
                                            setQuantity(quantity - 1)
                                            
                                        }}
                                    >
                                        <Text style={styles.operator}>-</Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Text style={{fontSize: 32, fontWeight: '600', marginHorizontal: 15}}>{quantity}</Text>
                                </View>
                                
                                <View>
                                    <TouchableOpacity 
                                        style={styles.SmallButtons}
                                        onPress={() => {
                                            if(quantity >= product.count){
                                                return
                                            }
                                            setQuantity(quantity + 1)
                                            
                                        }}
                                        
                                        
                                    >
                                        <Text style={styles.operator}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:1, justifyContent: 'center'}}>
                                <Text style={{color:'#4A4B4D', fontSize: 24, fontWeight: 'bold'}}>Total Price</Text>  
                            </View>
                            <View>
                                <Text style={styles.title}>₹ {quantity * parseInt(product.product_price)}</Text>
                            </View>
                            
                        </View>
                        <View style={{ alignItems:'center', flex: 1, marginTop: 24}}>
                            <TouchableOpacity 
                                style={styles.submitButton} 
                                onPress={()=>{
                                    navigation.navigate('Create Sale',{
                                        product: product,
                                        quantity: quantity,
                                        navigation: navigation
                                    })
                                }}
                            >
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
                                    <MaterialIcons  name="add-shopping-cart" size={32} color="white" />
                                    <Text style={styles.operator}>Proceed to Sale</Text>
                                </View>
                            </TouchableOpacity> 

                            <TouchableOpacity style={styles.cancelButton} onPress={setVisible}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
                                    <MaterialIcons name="cancel" size={32} color="#4A4B4D" />
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                </View>  
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    title:{
        fontSize: 36,
        fontWeight: '900',
        color: '#4A4B4D'
    },
    modal:{
        backgroundColor: '#FFFFFF', 
        alignSelf: 'center',       
        height: height / 1.4 ,  
        width: width * 0.75,  
        borderRadius:10,  
        borderWidth: 1,  
        borderColor: '#fff',      
    },
    text: {  
        color: '#B6B7B7',
        fontSize: 18   
    },
    SmallButtons:{
        margin: 15,
        backgroundColor: '#1182AE',
        borderRadius: 10,
        height: 60,
        width: 75,
        justifyContent: 'center',
        elevation: 15
    },
    operator: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '600',
        alignSelf: 'center',
        
    },
    input:{
        height: 58,
        width: 100,
        fontSize: 24,
        borderRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    submitButton:{
        marginBottom: 20,
        height: 65,
        width: width * 0.6,
        backgroundColor: '#6C971F',
        borderRadius: 10,
        justifyContent:'center',
        elevation:15
    },
    cancelButton:{
        height: 65,
        width: width * 0.6,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        justifyContent:'center',
        elevation:15
    },
    cancelText:{
        color: '#4A4B4D',
        fontSize: 24,
        fontWeight: '600',
        alignSelf:'center'
    }
});
export default SaleModal;