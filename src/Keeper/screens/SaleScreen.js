import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList,ScrollView, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import SaleCard from '../Components/SaleCard';
import kioskApi from '../api/home';
const { height } = Dimensions.get('window');
const SaleScreen = (props) => {
    const [result, setResult] = useState({
        _id:'',
        date: '',
        kiosk_id: props.navigation.state.params.kiosk.id,
        kiosk_name: props.navigation.state.params.kiosk.name,
        login_time: '',
        logout_time: '',
        product_Inventory: [ 
            {
                _id:'',
                product_id: '',
                product_name: '',
                product_price: 0,
                prev_day_balance_count: 0,
                Inventory_load_count: 0,
                Total_inventory: 0,
                sales_count_total: 0,
                sales_count_cash: 0,
                units_sold_cash: 0,
                unit_sold_total: 0,
                unsold_units: 0,
                total_sales: 0,
                cash_collection: 0
            }
        ]
    })
    const [filteredProduct, setFilteredProducts] = useState(result.product_Inventory)
    const [errorMessage, setErrorMessage] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const SummaryApi = async (kioskname, token) => {
        try {
            const response = await kioskApi(token).get(`/${kioskname}`);
            setResult(response.data)
            setFilteredProducts(response.data.product_Inventory)
        } catch(err) {
            console.log("Error: ",err)
            setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
        }
    
    }
    useEffect(() => {
        SummaryApi(props.navigation.state.params.kiosk.name, props.navigation.state.params.keeper.token)
    },[])
    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                { (errorMessage) ?
                        <View>
                            <Text style={styles.title}> {errorMessage}</Text>
                        </View> :
                    <View>
                    
                        <View >
                            <View style={styles.screen}>
                                <Text style={styles.title}>Product</Text>
                                
                                
                            </View>
                            <View
                                style={{ 
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            <TextInput 
                                style={styles.searchbox} 
                                underlineColor='transparent'
                                placeholder='Search Product'
                                left={<TextInput.Icon icon="magnify" size={35} />}
                                onChangeText={(value)=>{
                                    if(value.trim() === ''){
                                        setFilteredProducts(result.product_Inventory)
                                    }
                                    setSearchTerm(value)
                                }}
                                onSubmitEditing={() => {
                                    if(searchTerm.trim() === '' ){setFilteredProducts(result.product_Inventory)}
                                    let txt = searchTerm.toLowerCase()
                                    let filterResult = result.product_Inventory.filter(item =>{
                                        if(item.product_name.toLowerCase().match(txt)) {
                                            return item
                                        }
                                    })
                                    setFilteredProducts(filterResult)
                                }}
                            />
                        </View>
                        <View style={styles.list}>
                        {
                                filteredProduct.map((item) => {
                                    return <SaleCard 
                                        key={item.product_id} 
                                        id={item.product_id} 
                                        summary={result} 
                                        token = {props.navigation.state.params.keeper.token}
                                        name={item.product_name}
                                        price={item.product_price} 
                                        count={item.unsold_units} navigation={props.navigation}/>
                                })
                            }
                        </View>
                        <View  style={styles.design}></View>
                    </View>
                }
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    
    container:{
        overflow: 'scroll',
        flexGrow: 1,
    },
    design:{
        borderTopRightRadius: 45,
        borderBottomRightRadius: 45,
        marginTop: 256,
        position: 'absolute',
        width: "35%",
        height: height,
        backgroundColor: '#6C971F',
        zIndex: -5
    },
    screen: {
        margin: 36
    },
    title: {
        color:'#000F4D',
        fontSize: 32,
        fontWeight: '500'
    },
    subtitle: {
        color:'#000F4D',
        fontSize: 18,
        fontWeight: '300'
    },
    searchbox:{
        fontSize: 18,
        overflow: 'hidden',
        borderRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        margin: 36,
        height: 60
    },
    list:{
     marginTop: 50,
    }
});

export default SaleScreen;