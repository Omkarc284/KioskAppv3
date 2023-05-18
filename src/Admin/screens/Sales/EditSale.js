import React from "react";
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import HeaderBar from "../../Components/Headerbar";
import summaryApi from "../../api/summary";
import { SelectCountry } from "react-native-element-dropdown";
import { TextInput } from "react-native-paper";
import colors from "../../utils/colors";
import { Ionicons } from '@expo/vector-icons';
import SaleApi from "../../api/sale";

const EditSale = props => {
    const data = [
        {
            value: 'Cash',
            label: 'Cash',
        },
        {
            value: 'UPI',
            label: 'UPI',
        },
        {
            value: 'Card',
            label:'Card'
        }
    ]
    const token = props.navigation.state.params.token
    // const [name, setName] = React.useState(props.navigation.state.params.product.name)
    // const [id, setId] = React.useState(props.navigation.state.params.product._id)
    // const [price, setPrice] = React.useState(props.navigation.state.params.product.price)
    // const [status, setStatus] = React.useState(props.navigation.state.params.product.status)
    const [spinner, setSpinner] = React.useState(false)
    const [sale, setSale] = React.useState(props.navigation.state.params.sale)
    const [kiosk_name, setKiosk_name] = React.useState(sale.kiosk_name)
    const [product_id, setProduct_id] = React.useState(sale.product_id);
    const [product_name, setProduct_name] = React.useState(sale.product_name);
    const [product_price, setProduct_price] = React.useState(sale.product_price);
    const [quantity, setQuantity] = React.useState(sale.quantity);
    const [payment_mode, setPayment_Mode] = React.useState(sale.payment_mode)
    const [product_Inventory, setProduct_Inventory] = React.useState([])
    const [selectedProduct, setSelectedProduct] = React.useState(sale)
    const [disablep, setDisableP] = React.useState(false)
    const [disablem, setDisableM] = React.useState(false)
    const [disables, setDisableS] = React.useState(false)
    const [deleteModal, setDeleteModal] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState(null)

    const getData = async() => {
        try{
            setSpinner(true);
            const response = await summaryApi(token).post('/geteditSale',{
                kiosk_name: kiosk_name,
                saleDate: sale.saleDate
            })
            
            
            // console.log(response)
            if(response.status === 200){
                setProduct_Inventory(response.data.product_Inventory)
                const i = response.data.product_Inventory.findIndex(p => p.product_id === sale.product_id)
                setSelectedProduct(response.data.product_Inventory[i])
                //console.log("this:",i,' Value',response.data.product_Inventory[i])
                setSpinner(false)
            }else{
                setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
                setSpinner(false)
            }
            
        }catch(err) {
            setSpinner(false)
            console.log("Error: ",err)
            setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
        }
    }
    const onDelete = async () =>{
        try{
            setSpinner(true);
            const response = await SaleApi(token).delete(`/${sale._id}`)
            // console.log(response)
            if(response.status === 200){
                
                //console.log("this:",i,' Value',response.data.product_Inventory[i])
                setSpinner(false)
                props.navigation.navigate('HomeAdmin')
            }else{
                setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
                setSpinner(false)
            }
            
        }catch(err) {
            setSpinner(false)
            console.log("Error: ",err)
            setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
        }
    }
    const onclickSave = async () => {
        try{
            setSpinner(true);
            const response = await SaleApi(token).patch(`/${sale._id}`,{
                kiosk_name: kiosk_name,
                keeper_name: sale.keeper_name,
                product_id: product_id,
                product_name: product_name, 
                product_price: product_price, // store this as 128bit decimal in MongoDB
                quantity: quantity,
                total: product_price * quantity,
                payment_mode: payment_mode,
            })
            // console.log(response)
            if(response.status === 200){
                
                //console.log("this:",i,' Value',response.data.product_Inventory[i])
                setSpinner(false)
                props.navigation.navigate('HomeAdmin')
            }else{
                setSpinner(false)
                setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
                
            }
            
        }catch(err) {
            setSpinner(false)
            console.log("Error: ",err)
            setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
        }
    }
    React.useEffect(() => {
        getData();
    },[])
    return (
        <>
            <HeaderBar navigation={props.navigation}/>
            {
                (spinner) ? 
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size={96} color={colors.blue} />
                </View>
                :
                <View style={{padding: 24, flex:1}}>
                    <View style={{flex:1}}>

                    
                        <View style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between', paddingVertical: 8}}>
                            <Text style={{fontWeight:'bold', fontSize: 24, paddingVertical: 8}}>Edit Sales</Text>
                            <View>
                                <TouchableOpacity onPress={() => onDelete()}>
                                    <Ionicons name="ios-trash-sharp" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <View style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between', paddingVertical: 8}}>
                            <Text>Sale id: </Text>
                            <Text>{sale._id}</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between', paddingVertical: 8}}>
                            <Text>Sale Time: </Text>
                            <Text>{new Date(sale.saleTime).toLocaleString()}</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between', paddingVertical: 8}}>
                            <Text>Kiosk name:  </Text>
                            <Text style={{fontWeight:'bold', fontSize: 16}}>{sale.kiosk_name}</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between', paddingVertical: 8}}>
                            <Text>Keeper name: </Text>
                            <Text style={{fontWeight:'bold', fontSize: 16}}>{sale.keeper_name}</Text>
                        </View>
                        
                        <View style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between', paddingVertical: 8}}>
                            <Text style={{fontWeight:'bold', fontSize: 16}}>Product: </Text>
                            <SelectCountry 
                                style={styles.dropdown} 
                                selectedTextStyle={styles.selectedTextStyle} 
                                placeholderStyle={styles.placeholderStyle} 
                                itemContainerStyle={{alignItems: 'center', justifyContent: 'center', marginLeft: -18}}
                                maxHeight={200} 
                                value={sale.product_name} 
                                data={product_Inventory} 
                                valueField="product_name" 
                                labelField="product_name" 
                                onChange={e => {
                                    const i = product_Inventory.findIndex(p => p.product_name === e.product_name)
                                    if(product_Inventory[i].unsold_units < 1 && quantity < 2){
                                        alert('Product is out of stock! Please select another product or refill inventory!')
                                        setDisableP(true)
                                        setDisableM(true)
                                        setDisableS(true)
                                    }else if(product_Inventory[i].unsold_units < 1 && quantity > 1 ){
                                        setDisableP(true)
                                        setDisableM(false)
                                        setDisableS(false)
                                    }else{
                                        setDisableP(false)
                                        setDisableM(false)
                                        setDisableS(false)
                                    }
                                    setSelectedProduct(product_Inventory[i]);
                                    setProduct_id(e.product_id)
                                    setProduct_name(e.product_name)
                                    setProduct_price(e.product_price)
                                }}
                            /> 
                        </View>
                        
                        <TextInput style={{marginVertical:4}} label={'Unit Price*'} left={<TextInput.Affix text="₹"/>} defaultValue={selectedProduct.product_price.toString()} value={(selectedProduct !== undefined) ? selectedProduct.product_price : sale.product_price} keyboardType='number-pad' onChangeText={(value) => setProduct_price(parseInt(value))}/>
                        {/* <TextInput style={{marginVertical:4}} label={'Quantity*'} defaultValue={sale.quantity.toString()} value={sale.quantity} keyboardType='number-pad' onChangeText={(value) => setQuantity(parseInt(value))} /> */}
                        <View style={{paddingVertical: 16,flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            <Text style={{flex: 1, alignSelf:'center',fontWeight:'bold', fontSize: 16}}>Quantity: </Text>
                            <View style={{flex: 1,flexDirection:'row', justifyContent: 'space-between'}}>
                                <TouchableOpacity 
                                    disabled={disablem}
                                    style={styles.SmallButtons}
                                    onPress={()=>{
                                        if(quantity < 2){
                                            setQuantity(1)
                                        }else{
                                            setQuantity(quantity - 1)
                                        }
                                    }}
                                >
                                    <Text style={{color: colors.white, fontSize: 24}}>-</Text>
                                </TouchableOpacity>
                                <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                                    <Text style={{fontSize:24, elevation:15}}>{quantity}</Text>
                                </View>
                                
                                <TouchableOpacity 
                                    disabled={disablep}
                                    style={styles.SmallButtons}
                                    onPress={() => {
                                        if(quantity >= selectedProduct.unsold_units){
                                            setQuantity(parseInt(selectedProduct.unsold_units))
                                        }else{
                                            setQuantity(quantity + 1)
                                        }
                                        
                                    }}
                                >  
                                    <Text style={{color: colors.white, fontSize: 24}}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between', paddingVertical: 8}}>
                            <Text style={{fontWeight:'bold', fontSize: 16}}>Payment Mode: </Text>
                            <SelectCountry 
                                style={styles.dropdown} 
                                selectedTextStyle={styles.selectedTextStyle} 
                                placeholderStyle={styles.placeholderStyle} 
                                itemContainerStyle={{alignItems: 'center', justifyContent: 'center', marginLeft: -18}}
                                maxHeight={200} 
                                value={payment_mode} 
                                data={data} 
                                valueField="value" 
                                labelField="label" 
                                onChange={e => {
                                    setPayment_Mode(e.value)
                                }}
                            /> 
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between', paddingVertical: 8}}>
                            <Text style={{fontWeight:'bold', fontSize: 16}}>Total Amount: </Text>
                            <Text style={{fontWeight:'bold', fontSize: 16}}>₹{ quantity * product_price }</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignSelf:'flex-end', justifyContent: 'space-between', padding: 18, paddingVertical:30}}>
                        <TouchableOpacity style={styles.canButton} onPress={() => props.navigation.navigate('Sales')}>
                            <Text style={{color: colors.themeblue, fontWeight:'bold'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={disables} style={styles.saveButton} onPress={() => onclickSave()}>
                            <Text style={{color: colors.white, fontWeight:'bold'}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            }
        </>
    )
}
const styles = StyleSheet.create({
    dropdown: {
        flex: 1,
        marginVertical: 8,
        height: 36,
        backgroundColor: 'transparent',
        paddingHorizontal:8,
        justifyContent:'flex-start',
        alignSelf: 'flex-start',
        textAlign:'center',
    },
    selectedTextStyle: {
        fontSize: 16,
        textAlign:'center'
    },
    saveButton: {
        flex: 1,
        marginHorizontal: 12,
        padding: 10,
        backgroundColor: '#000F4D',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderRadius: 40,
        
    },
    SmallButtons:{
        backgroundColor: '#1182AE',
        borderRadius: 36,
        height: 48,
        width: 48,
        justifyContent: 'center',
        alignItems:'center',
        elevation: 15
    },
    canButton: {
        flex: 1,
        marginHorizontal: 12,
        padding: 10,
        borderWidth:1,
        borderColor: '#000F4D',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderRadius: 40,
        
    },
    delButton: {
        
        padding: 10,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderRadius: 40,
        
    },
})
export default EditSale;