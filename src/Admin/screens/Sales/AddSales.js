import React from "react";
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import HeaderBar from "../../Components/Headerbar";
import summaryApi from "../../api/summary";
import { SelectCountry } from "react-native-element-dropdown";
import { TextInput } from "react-native-paper";
import colors from "../../utils/colors";
import { Ionicons } from '@expo/vector-icons';
import SaleApi from "../../api/sale";

const AddSales = props => {
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
    const [spinner, setSpinner] = React.useState(false)
    const [sale, setSale] = React.useState(null)
    const [summaries, setSummaries] = React.useState([])
    const [keepers, setKeepers] = React.useState([])
    const [kiosk_id, setKiosk_id] = React.useState('');
    const [kiosk_name, setKiosk_name] = React.useState('');
    const [keeper, setKeeper] = React.useState('')
    const [product_id, setProduct_id] = React.useState('');
    const [product_name, setProduct_name] = React.useState('');
    const [product_price, setProduct_price] = React.useState(0);
    const [quantity, setQuantity] = React.useState(1);
    const [payment_mode, setPayment_Mode] = React.useState('')
    const [product_Inventory, setProduct_Inventory] = React.useState([])
    const [selectedProduct, setSelectedProduct] = React.useState({})
    const [disableproduct, setDisableProduct] = React.useState(true)
    const [disableq, setDisableQ] = React.useState(true)
    const [errorMessage, setErrorMessage] = React.useState(null)

    const getData = async() => {
        try{
            setSpinner(true);
            const response = await SaleApi(token).get('/preSale')
            if(response.status === 200){
                setKeepers(response.data.keepers)
                setSummaries(response.data.summaries)
                // setProduct_Inventory(response.data.product_Inventory)
                // const i = response.data.product_Inventory.findIndex(p => p.product_id === sale.product_id)
                // setSelectedProduct(response.data.product_Inventory[i])
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
    const onclickSave = async () => {
        setSpinner(true);
        const response = await SaleApi(token).post('/add_sale',{
            kiosk_id: kiosk_id,
            kiosk_name: kiosk_name,
            keeper_name: keeper,
            product_id: product_id,
            product_name: product_name, 
            product_price: product_price, // store this as 128bit decimal in MongoDB
            quantity: quantity,
            total: product_price * quantity,
            payment_mode: payment_mode,
            
        })
        if(response.status === 200 || response.status === 201){
            console.log(response.data)
            setSpinner(false)
            props.navigation.navigate('HomeAdmin')
        }else{
            setSpinner(false)
            setErrorMessage('Couldnt create sale! An error occured try again later after checking the connection!')
        }
    }
    React.useEffect(() => {
        getData();
    },[])
    return (
        <>
            <HeaderBar navigation={props.navigation}/>
            {
                (spinner ) ? 
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size={96} color={colors.blue} />
                </View>
                :
                <View style={{padding: 24, flex:1}}>
                    {/* <Text>Add Sale here</Text> */}
                    <View style={{flex:1}}>
                        <View style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between', paddingVertical: 8}}>
                            <Text style={{fontWeight:'bold', fontSize: 24, paddingVertical: 8}}>Add a new Sale</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between'}}>
                            
                            <Text style={{fontWeight:'bold', fontSize: 16, flex:0.4}}>Kiosk: </Text>
                            <SelectCountry 
                                style={styles.dropdown} 
                                selectedTextStyle={styles.selectedTextStyle} 
                                placeholderStyle={styles.placeholderStyle} 
                                placeholder="Select Kiosk"
                                itemContainerStyle={{alignItems: 'center', justifyContent: 'center', marginLeft: -18}}
                                maxHeight={200} 
                                value={kiosk_name} 
                                data={summaries} 
                                valueField="kiosk_name" 
                                labelField="kiosk_name" 
                                onChange={e => {
                                    setKiosk_id(e.kiosk_id)
                                    setKiosk_name(e.kiosk_name)
                                    setProduct_Inventory(e.product_Inventory)
                                    setProduct_name('')
                                    setProduct_price('')
                                    setQuantity(1)
                                    setDisableProduct(false)
                                    setDisableQ(true)
                                }}
                            /> 
                            
                            
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between'}}>
                            <Text style={{fontWeight:'bold', fontSize: 16, flex:0.4}}>Keeper: </Text>
                            <SelectCountry 
                                style={styles.dropdown} 
                                selectedTextStyle={styles.selectedTextStyle} 
                                placeholder="Select Keeper"
                                placeholderStyle={styles.placeholderStyle} 
                                itemContainerStyle={{alignItems: 'center', justifyContent: 'center', marginLeft: -18}}
                                maxHeight={200} 
                                value={keeper} 
                                data={keepers} 
                                valueField="username" 
                                labelField="username" 
                                onChange={e => {
                                    console.log(product_Inventory)
                                    setKeeper(e.username)
                                }}
                            /> 
                        </View>
                        <View  style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between'}}>
                            <Text style={{fontWeight:'bold', fontSize: 16, flex:0.4}}>Product: </Text>
                            <SelectCountry 
                                disable={disableproduct}
                                style={styles.dropdown} 
                                selectedTextStyle={styles.selectedTextStyle} 
                                placeholderStyle={styles.placeholderStyle} 
                                placeholder="Select Product"
                                itemContainerStyle={{alignItems: 'center', justifyContent: 'center', marginLeft: -18}}
                                maxHeight={200} 
                                value={product_name} 
                                data={product_Inventory} 
                                valueField="product_name" 
                                labelField="product_name" 
                                onChange={e => {
                                    const i = product_Inventory.findIndex(p => p.product_name === e.product_name)
                                    setSelectedProduct(product_Inventory[i]);
                                    setDisableQ(false)
                                    setProduct_id(e.product_id)
                                    setProduct_name(e.product_name)
                                    setProduct_price(e.product_price)
                                }}
                            /> 
                        </View>
                        <TextInput disabled={disableq} style={{marginVertical:4}} label={'Unit Price*'} left={<TextInput.Affix text="₹"/>} defaultValue={product_price.toString()} value={product_price} keyboardType='number-pad' onChangeText={(value) => setProduct_price(parseInt(value))}/>
                        {/* <TextInput disabled={disableq} style={{marginVertical:4}} label={'Quantity*'} defaultValue={quantity.toString()} value={quantity} keyboardType='number-pad' 
                            onChangeText={(value) => {
                                if(parseInt(value) > selectedProduct.unsold_units){

                                    alert(`Cannot add more than the existing Inventory! Inventory count for the selected Kiosk and product is ${selectedProduct.unsold_units}. Enter approppriate number.`)
                                    setQuantity(1)
                                }
                                else if(parseInt(value) < 0){
                                    setQuantity(1)
                                }
                                else{
                                    setQuantity(parseInt(value))
                                }
                            }} 
                            
                        /> */}
                        <View style={{paddingVertical: 16,flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            <Text style={{flex: 1, alignSelf:'center',fontWeight:'bold', fontSize: 16}}>Quantity: </Text>
                            <View style={{flex: 1,flexDirection:'row', justifyContent: 'space-between'}}>
                                <TouchableOpacity 
                                    style={styles.SmallButtons}
                                    disabled={disableq}
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
                                    style={styles.SmallButtons}
                                    disabled={disableq}
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
                                disabled={disableproduct}
                                style={styles.dropdown} 
                                selectedTextStyle={styles.selectedTextStyle} 
                                placeholderStyle={styles.placeholderStyle}
                                placeholder="Select mode of Payment" 
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
                        
                        
                    </View>
                    <View
                        style={{
                            borderBottomColor: colors.text,
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                    />
                    <View style={{flexDirection:'row',alignSelf:'flex-end', alignItems:'center' , justifyContent:'space-between', paddingVertical: 8}}>
                        <Text style={{fontWeight:'bold', fontSize: 24}}>Total Amount: </Text>
                        
                        <Text style={{fontWeight:'bold', fontSize: 24}}>₹ { quantity * product_price} </Text>
                        
                        
                    </View>
                    <View
                        style={{
                            borderBottomColor: colors.text,
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                    />
                    <View style={{flexDirection: 'row', alignSelf:'flex-end', justifyContent: 'space-between', padding: 18, paddingVertical:30}}>
                        <TouchableOpacity style={styles.canButton} onPress={() => props.navigation.navigate('Sales')}>
                            <Text style={{color: colors.themeblue, fontWeight:'bold'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={() => onclickSave()}>
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
        borderWidth: 1,
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
        textAlign:'center',
    },
    placeholderStyle: {
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
export default AddSales;