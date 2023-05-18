import React from "react";
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import HeaderBar from "../../../Components/Headerbar";
import summaryApi from "../../../api/summary";
import { SelectCountry } from "react-native-element-dropdown";
import { TextInput } from "react-native-paper";
import colors from "../../../utils/colors";
import { Ionicons } from '@expo/vector-icons';


const EditInventories = props => {
    const token = props.navigation.state.params.token
    const [spinner, setSpinner] = React.useState(false)
    const [sale, setSale] = React.useState(null)
    const [summaries, setSummaries] = React.useState([])
    const [id, setId] = React.useState('');
    const [kiosk_name, setKiosk_name] = React.useState('');
    const [product_id, setProduct_id] = React.useState('');
    const [product_name, setProduct_name] = React.useState('');
    const [product_price, setProduct_price] = React.useState("--");
    const [quantity, setQuantity] = React.useState('1');
    const [product_Inventory, setProduct_Inventory] = React.useState([])
    const [selectedProduct, setSelectedProduct] = React.useState({})
    const [disableproduct, setDisableProduct] = React.useState(true)
    const [disableq, setDisableQ] = React.useState(true)
    const [errorMessage, setErrorMessage] = React.useState(null)

    const getData = async() => {
        try{
            setSpinner(true);
            const response = await summaryApi(token).get('/all')
            if(response.status === 200){
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
        console.log('Id: ', id)
        const response = await summaryApi(token).patch(`/${id}`,{
            product_id: product_id,
            Inventory_load_count: parseInt(quantity)
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
                        <View style={{flex:1}}>
                        <View style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between', paddingVertical: 8, paddingBottom:36}}>
                            <Text style={{fontWeight:'bold', fontSize: 24, paddingVertical: 8}}>Add Inventories:</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between', paddingBottom: 18}}>
                            
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
                                    setKiosk_name(e.kiosk_name)
                                    setProduct_Inventory(e.product_Inventory)
                                    setId(e._id)
                                    setProduct_name('')
                                    setProduct_price('--')
                                    setQuantity('1')
                                    setDisableProduct(false)
                                    setDisableQ(true)
                                }}
                            /> 
                            
                            
                        </View>
                        <View  style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between',paddingBottom: 28}}>
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
                        <View  style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between',paddingBottom: 18}}>
                            <Text style={{fontWeight:'bold', fontSize: 16, flex:0.4}}>Product Price: </Text>
                            <Text style={{fontWeight:'bold', fontSize: 16, flex:0.4}}>₹ {product_price} </Text>
                        </View>
                        </View>
                        <View style={{flex:1, justifyContent:'flex-start'}}>
                            <Text style={{alignSelf:'center',fontWeight:'bold', fontSize: 16, paddingVertical: 42}}>Quantity</Text>
                            <View style={{flexDirection:'row', justifyContent: 'center', alignItems:'center'}}>
                                <TouchableOpacity 
                                    style={styles.SmallButtons}
                                    disabled={disableq}
                                    onPress={()=>{
                                        
                                        setQuantity((parseInt(quantity) - 1).toString())
                                        
                                    }}
                                >
                                    <Text style={{color: colors.white, fontSize: 24}}>-</Text>
                                </TouchableOpacity>
                                {/* <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                                    <Text style={{fontSize:24, elevation:15}}>{quantity}</Text>
                                </View> */}
                                <TextInput mode="outlined" disabled={disableq} contentStyle={{alignSelf:'center'}} textAlign="center" style={styles.quantityinput} defaultValue={quantity} value={quantity} keyboardType='number-pad' onChangeText={(value) => setQuantity(value)}/>
                                <TouchableOpacity 
                                    style={styles.SmallButtons}
                                    disabled={disableq}
                                    onPress={() => {
                                        setQuantity((parseInt(quantity) + 1).toString())
                                    }}
                                >  
                                    <Text style={{color: colors.white, fontSize: 24}}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        
                        
                    </View>
                    
                    <View style={{flexDirection: 'row', alignSelf:'flex-end', justifyContent: 'space-between', padding: 18, paddingVertical:30}}>
                        <TouchableOpacity style={styles.canButton} onPress={() => props.navigation.navigate('InventoryAdmin')}>
                            <Text style={{color: colors.themeblue, fontWeight:'bold'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={disableq} style={styles.saveButton} onPress={() => onclickSave()}>
                            <Text style={{color: colors.white, fontWeight:'bold'}}>Add</Text>
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
    quantityinput:{
        marginHorizontal: 36,
        alignSelf:'center',
        width: 108,
        justifyContent:'center',
        fontSize: 24,
    }
})
export default EditInventories;