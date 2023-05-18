import React ,{useEffect, useState} from 'react';
import {View, Text, StyleSheet,ScrollView, Dimensions  } from 'react-native';
import { TextInput } from 'react-native-paper';
import ProductCard from '../../Components/ProductCard';
import productApi from '../../api/product';
import HeaderBar from '../../Components/Headerbar';
import { AnimatedFAB } from 'react-native-paper';
import colors from '../../utils/colors';
import { color } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const ProductScreen = (props) => {
    const token = props.navigation.state.params.token
    const [result, setResult] = useState([])
    const [filteredProduct, setFilteredProducts] = useState(result)
    const [errorMessage, setErrorMessage] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [isExtended, setIsExtended] = React.useState(true);
    const ProductApi = async () => {
        try {
            const response = await productApi(token).get(`/`);
            setResult(response.data)
            setFilteredProducts(response.data)
            console.log(response.data)
        } catch(err) {
            console.log("Error: ",err)
            setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
        }
    
    }
    useEffect(() => {
        ProductApi();
    },[])
    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
          Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    
        setIsExtended(currentScrollPosition <= 0);
    };
    return (
        <>
            <HeaderBar navigation={props.navigation}/>
            <ScrollView contentContainerStyle={styles.container} onScroll={onScroll}>
            { (errorMessage) ?
                    <View>
                        <Text style={styles.title}> {errorMessage}</Text>
                    </View> :
                <View>
                
                
                    <View >
                        
                        <TextInput 
                            style={styles.searchbox} 
                            underlineColor='transparent'
                            placeholder='Search Product'
                            left={<TextInput.Icon icon="magnify" size={35} />}
                            onChangeText={(value)=>{
                                if(value.trim() === ''){
                                    setFilteredProducts(result)
                                }
                                setSearchTerm(value)
                            }}
                            onSubmitEditing={() => {
                                if(searchTerm.trim() === '' ){setFilteredProducts(result)}
                                let txt = searchTerm.toLowerCase()
                                let filterResult = result.filter(item =>{
                                    if(item.name.toLowerCase().match(txt)) {
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
                                return <ProductCard 
                                    key={item._id} 
                                    id={item._id} 
                                    product={item} 
                                    token={token}
                                    title={item.name} 
                                    navigation={props.navigation}/>
                            })
                        }
                        {/* <FlatList 
                            data={result.product_Inventory}
                            keyExtractor={(inventory) => inventory._id}
                            renderItem={(item) => {
                                return <InventoryCard title={item.product_name} count={item.unsold_units} navigation={props.navigation}/>
                            }}
                        />
                        */}
                    </View>
                    
           
                </View>
            }
                
            </ScrollView>
            <View  style={{}}>
                <AnimatedFAB
                    icon="plus"
                    label='Add Product'
                    extended={isExtended}
                    style={styles.fab}
                    onPress={() => props.navigation.navigate('AddProduct')}
                    
                    animateFrom={'right'}
                    iconMode={'dynamic'}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container:{
        overflow: 'scroll',
        flexGrow: 1,
        margin: 24,
    },
    fab: {
        position: 'absolute',
        margin: 24,
        right: 0,
        bottom: 0,
    },
    // design:{
    //     borderTopRightRadius: 45,
    //     borderBottomRightRadius: 45,
    //     marginTop: 256,
    //     position: 'absolute',
    //     width: "35%",
    //     height: height,
    //     backgroundColor: '#1182AE',
    //     zIndex: -5
    // },
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
        borderRadius: 40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        height: 60,
        marginBottom:24,
        elevation: 5
    },
    list:{

    }

});

export default ProductScreen;