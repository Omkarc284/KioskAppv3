import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image } from "react-native";
import { RadioButton } from "react-native-paper";
import Modal from 'react-native-modal';
import upidetails from "../api/upidetails";
import ConfirmSale from "../api/sale";
import { SafeAreaView } from "react-native-safe-area-context";

const { height, width} = Dimensions.get('window');
const AddSale = (props) => {
    const [showQr, setShowQr] = useState(false);
    const [upiDetails, setUpiDetails] = useState({
        qr: '',
        intent: '',
        transactionId: ''
    })
    const token = props.navigation.state.params.product.token;
    const [sale, setSale] = useState({
        kiosk_id: props.navigation.state.params.product.summary.kiosk_id,
        kiosk_name: props.navigation.state.params.product.summary.kiosk_name,
        product_id: props.navigation.state.params.product.product_id,
        product_name: props.navigation.state.params.product.product_name,
        product_price: props.navigation.state.params.product.product_price,
        quantity: props.navigation.state.params.quantity,
        total: parseInt(props.navigation.state.params.quantity) * parseInt(props.navigation.state.params.product.product_price),
        payment_mode:'Cash',
        transaction_id: ''
    });
    const [errorMessage, setErrorMessage] = useState('')
    const [checked, setChecked] = React.useState('Cash');
    const onsetCash = () => {
        setChecked('Cash');
        setSale({
            kiosk_id: props.navigation.state.params.product.summary.kiosk_id,
            kiosk_name: props.navigation.state.params.product.summary.kiosk_name,
            product_id: props.navigation.state.params.product.product_id,
            product_name: props.navigation.state.params.product.product_name,
            product_price: props.navigation.state.params.product.product_price,
            quantity: props.navigation.state.params.quantity,
            total: parseInt(props.navigation.state.params.quantity) * parseInt(props.navigation.state.params.product.product_price),
            payment_mode:'Cash',
            transaction_id: ''
        })
    }
    const getUpidetails = async (token) => {
        try{
            const response = await upidetails(token).post('/upi_details',{
                "total": sale.total,
                "transactionNote": `${sale.quantity} units ${sale.product_name}-${sale.product_price} each.`
            });
            setUpiDetails({qr: response.data.qr, intent: response.data.intent, transactionId: response.data.transactionId})
            
        }catch(err){
            console.log("Error: ",err)
            setErrorMessage('Something went wrong!')
        }
    }
    
    const onSetUPI = () => {
        setChecked('UPI');
        setSale({
            kiosk_id: props.navigation.state.params.product.summary.kiosk_id,
            kiosk_name: props.navigation.state.params.product.summary.kiosk_name,
            product_id: props.navigation.state.params.product.product_id,
            product_name: props.navigation.state.params.product.product_name,
            product_price: props.navigation.state.params.product.product_price,
            quantity: props.navigation.state.params.quantity,
            total: parseInt(props.navigation.state.params.quantity) * parseInt(props.navigation.state.params.product.product_price),
            payment_mode:'UPI',
            transaction_id: upiDetails.transactionId
        })
        setShowQr(true);
    }

    const onConfirmSale = async () =>{
        try{
            const response = await ConfirmSale(token).post('/new_sale', sale)
            console.log(response.data)
            props.navigation.navigate('Home')
        }catch(err){
            console.log("Error: ",err)
            setErrorMessage('Something went wrong!')
        }
    }
    useEffect(()=>{
        getUpidetails(props.navigation.state.params.product.token);
    },[])
    
    return (
        <>
            <SafeAreaView>
                <View>
                    <Modal
                        isVisible={showQr}
                        animationType = 'fade'
                        backdropOpacity={0.8}
                    >
                        <View style={styles.modal}>
                            <View>
                                <Image 
                                    style={{width: width * 0.65, height: height * 0.45, resizeMode: 'contain'}} 
                                    source={{uri: upiDetails.qr}}
                                />
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={styles.modalbutton}
                                    onPress={() =>{
                                        setShowQr(false)
                                    }}
                                >
                                    <Text style={{fontSize: 18, color: '#fff', fontWeight:'bold'}}>
                                        Done
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex: 1, margin: 24}}>
                                <Text style={styles.title}>Cart:</Text>  
                            </View>
                            <View style={{margin: 24, justifyContent:'center'}}>
                                <Text style={{color: '#454545', fontSize: 24, fontWeight: '500' }}>{sale.kiosk_name}</Text>  
                            </View>
                        </View>
                        
                        <View
                            style={{ 
                                width: width,
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                        <View style={{margin: 24}}>
                            <View style={styles.sideview}>
                                <Text style={styles.leftside}>Product Name: </Text>
                                <Text style={{fontSize: 18,color:'#4A4B4D', fontWeight: '600'}}>{sale.product_name}</Text>
                            </View>
                            <View style={styles.sideview}>
                                <Text style={styles.leftside}>Unit Price: </Text>
                                <Text style={{fontSize: 18,color:'#4A4B4D', fontWeight: '600'}}>₹ {sale.product_price}</Text>
                            </View>
                            <View style={styles.sideview}>
                                <Text style={styles.leftside}>Quantity: </Text>
                                <Text style={{fontSize: 18,color:'#4A4B4D', fontWeight: '600'}}>{sale.quantity}</Text>
                            </View>
                            <View
                                style={{ 
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            <View style={styles.sideview}>
                                <Text style={{flex: 1, fontSize: 16, color:'#4A4B4D', fontWeight: '900'}}>SubTotal: </Text>
                                <Text style={{fontSize: 16,color:'#4A4B4D', fontWeight: '900'}}>₹ {parseInt(sale.product_price) * parseInt(sale.quantity)}</Text>
                            </View>

                            <View style={styles.sideview}>
                                <Text style={{flex: 1, fontSize: 16, color:'#4A4B4D', fontWeight: '900'}}>Handling Charges: </Text>
                                <Text style={{fontSize: 16,color:'#4A4B4D', fontWeight: '900'}}>₹ 0</Text>
                            </View>
                            <View
                                style={{ 
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            <View style={styles.sideview}>
                                <Text style={{flex: 1, fontSize: 24, color:'#4A4B4D', fontWeight: '900'}}>Total: </Text>
                                <Text style={{fontSize: 24,color:'#4A4B4D', fontWeight: '900'}}>₹ {sale.total}</Text>
                            </View>
                            
                        </View>
                            <View
                                style={{ 
                                    width: width,
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            <View>
                                <View style={styles.screen}>
                                    <Text style={{fontSize: 28, color:'#4A4B4D', fontWeight: '900',marginVertical: 8}}>Payment Mode: </Text>
                                    <View>
                                        <View style={{flexDirection: 'row', alignItems:'center', marginVertical: 15}}>
                                            <RadioButton
                                                color="#000F4D"
                                                value="Cash" 
                                                status={ checked === 'Cash' ? 'checked' : 'unchecked' } //if the value of checked is Cash, then select this button
                                                onPress={() => onsetCash()} //when pressed, set the value of the checked Hook to 'Cash'
                                            />
                                            <Text  onPress={() => onsetCash()} style={{flex: 1, fontSize: 18, color:'#4A4B4D', fontWeight: '900'}}>Cash</Text>  
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems:'center'}} >
                                            <RadioButton
                                                color="#000F4D"
                                                value="UPI"
                                                status={ checked === 'UPI' ? 'checked' : 'unchecked' }
                                                onPress={() => onSetUPI()}
                                            />
                                            <Text onPress={() => onSetUPI()} style={{flex: 1, fontSize: 18, color:'#4A4B4D', fontWeight: '900'}}>UPI/Gpay/PhonePe/AmazonPay</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{marginHorizontal: 20}}>
                                        <TouchableOpacity 
                                            style={styles.CancelButton}
                                            onPress={()=>{
                                                props.navigation.navigate('Home')
                                            }}
                                        >
                                            <Text style={{fontSize: 24,fontWeight: '500'}}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{marginHorizontal: 20}}>
                                        <TouchableOpacity
                                            style={styles.ConfirmButton}
                                            onPress={()=>{
                                                onConfirmSale();
                                            }}
                                        >
                                            <Text style={{color: '#FFFFFF', fontSize: 24, fontWeight: '500'}}>Confirm</Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                                </View>
                            </View>
                            
                    </View>
                    
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    screen: {
        margin: 24
    },
    modal:{
        backgroundColor: '#FFFFFF', 
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',       
        height: height / 1.7 ,  
        width: width * 0.75,  
        borderRadius:10,  
        borderWidth: 1,  
        borderColor: '#fff',    
        marginTop: 60,  
    },
    title: {
        color:'#000F4D',
        fontSize: 32,
        fontWeight: '500'
    },
    sideview:{
        flexDirection: "row"
    },
    leftside: {
        flex: 1,
        fontSize: 18
    },
    modalbutton:{
        marginTop: -38,
        paddingBottom: 5,
        width: 108,
        height: 48,
        borderRadius: 32,
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: '#000F4D',
        elevation: 15
    },
    ConfirmButton:{
        justifyContent:'center',
        alignItems: 'center',
        marginHorizontal: 24,
        width: 108,
        height: 48,
        borderRadius: 10,
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: '#000F4D',
        elevation: 15
    },
    CancelButton:{
        justifyContent:'center',
        alignItems: 'center',
        marginHorizontal: 24,
        width: 108,
        height: 48,
        backgroundColor: '#FFFFFF',
        borderColor: 'black',
        borderRadius: 10,
        justifyContent:'center',
        elevation:15
    }

})

export default AddSale