import React from "react";
import * as Location from 'expo-location';
import { Text, TouchableOpacity, View, Dimensions, StyleSheet, ScrollView, ActivityIndicator} from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import {TextInput, RadioButton, Modal,Portal, Provider, DataTable  } from "react-native-paper";
import { SelectCountry } from "react-native-element-dropdown";
import HeaderBar from "../../Components/Headerbar";
import colors from "../../utils/colors";
import kioskApi from "../../api/kiosk";
import productApi from "../../api/product";
const {height, width} = Dimensions.get('window')
// const location = await Location.getCurrentPositionAsync();
const AddKiosk = props => {
    const token = props.navigation.state.params.token;
    const [result, setResult] = React.useState([])
    const [filteredProduct, setFilteredProducts] = React.useState(result)
    const [name, setName] = React.useState('')
    const [address, setAddress] = React.useState('')
    const [operational, setOperational] = React.useState(true)
    const [location, setLocation] = React.useState(null)
    const [longitude, setLongitude] = React.useState(0.0)
    const [latitude, setLatitude] = React.useState(0.0)
    const [products, setProducts] = React.useState([])
    const [mapModal, setMapModal] = React.useState(false)
    const [product_name, setProduct_Name] = React.useState('')
    const [product_id, setProduct_id] = React.useState('')
    const [product_price, setProduct_price] = React.useState('0')
    const [isExtended, setIsExtended] = React.useState(true);
    const [disableq, setDisableQ] = React.useState(true)
    const [spinner, setSpinner] = React.useState(false)
    const [addproductModal, setAddProductModal] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState(null)
    const [removeproductModal, setRemoveProductModal] = React.useState(false)
    const [deleteModal, setDeleteModal] = React.useState(false)

    const getProductData = async() => {
        setSpinner(true);
        try {
            const response = await productApi(token).get(`/`);
            setResult(response.data)
            var prods = []
            response.data.forEach(item =>{
                const i = products.findIndex(p => p._id === item._id.toString())
                if(i < 0){ 
                    prods.push(item)
                }
            })
            setFilteredProducts(prods)
            // console.log(response.data)
            setSpinner(false)
        } catch(err) {
            setSpinner(false)
            // console.log("Error: ",err)
            setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
        }
    }
    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
          Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    
        setIsExtended(currentScrollPosition <= 0);
    };
    const addProduct = () => {
        setSpinner(true)
        var product = filteredProduct.find((e) => {
            return e._id === product_id
        })
        product.price = product_price;
        setProducts(arr => [...arr, product]);
        setFilteredProducts(arr => arr.filter((e) => e._id !== product_id));
        changeStates();
        setSpinner(false)
        setAddProductModal(false)

    }
    const removeProduct = () => {
        setSpinner(true)
        setProducts(arr => arr.filter((e) => e._id !== product_id));
        var prods = []
        result.forEach(item =>{
            const i = products.findIndex(p => p._id === item._id.toString())
            if(i < 0){ 
                prods.push(item)
            }
        })
        setFilteredProducts(prods)
        changeStates();
        setSpinner(false)
        setRemoveProductModal(false)
    }
    const changeStates = async () => {
        setProduct_id('')
        setProduct_Name('')
        setProduct_price('0')
        setDisableQ(true)
    }
    const onclickSave = async() => {
        if(name === '') {
            setErrorMessage('Kiosk Name is required!')
        }
        else if( address === '' ){
            setErrorMessage('Kiosk Address is required!')
        }
        else if(products.length === 0){
            setErrorMessage('Please add product!')
        }else{
            await createKiosk()
        }
       
    };
    const createKiosk = async () => {
        setSpinner(true);
        try {
            const response = await kioskApi(token).post('/new_kiosk',{
                name: name,
                address: address,
                products: products,
                longitude:longitude,
                latitude: latitude,
                timezone: '+05:30'
            });
            // console.log(response)
            // console.log(response.data)
            if(response.status === 201||200){
                setSpinner(false);
                props.navigation.navigate('HomeAdmin')
            }
            else{
                setSpinner(false);
                setErrorMessage('Something went wrong! Try again!')
            }
        } catch(err) {
            setSpinner(false)
            // console.log("Error: ",err)
            setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
        }
    }
    React.useEffect(() => {
    
        (async () => {
          // setShouldMapLoad(false)
          let {status} = await Location.requestForegroundPermissionsAsync();
          console.log('location aquired:'+status);
          if (status !== 'granted') {
            setErrorMessage('Permission to access location was denied. Enable Location Permissions in your App Settigs');
            setLocation(null)
          }
          
          let location = await Location.getLastKnownPositionAsync()
            // console.log(location)
            setLocation(location);
          location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 100});
          
          setLocation(location);
          setLatitude(location.coords.latitude)
          setLongitude(location.coords.longitude)
        })();
        getProductData();
      }, []);
    return (
        <>
            <Provider>
            <HeaderBar navigation={props.navigation}/>
            {    (!location) ? 
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <ActivityIndicator size={96} color={colors.blue} />
                    </View> :
                <ScrollView contentContainerStyle={styles.container} onScroll={onScroll}>
                
                    <Portal>
                        <Modal
                            contentContainerStyle={{backgroundColor:colors.white, padding: 18,width: width*0.85,maxHeight: height*0.4, height: height*0.3, alignSelf:'center', position: 'relative', borderRadius: 16}}
                            visible = {errorMessage}
                            dismissable={false}
                        >
                            <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
                                <View style={{flex:1}}>
                                    <Text style={{fontSize: 18, fontWeight:'900', color:'red', alignSelf:'center', paddingBottom: 20}}>Error!</Text>
                                    <Text style={{fontSize: 16}}>{errorMessage}</Text>
                                    <Text style={{fontSize: 16}}>Make sure you have added Kiosk Details and Products and try again</Text>
                                </View>
                                
                                <View style={{}}>
                                    <TouchableOpacity style={styles.doneButton} onPress={() => setErrorMessage(null)}>
                                        <Text style={{color: colors.white, fontWeight:'bold'}}>Ok!</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </Modal>
                        <Modal
                            contentContainerStyle={{backgroundColor:colors.white, padding: 18,width: width*0.85,height: height*0.4, alignSelf:'center', position: 'relative', borderRadius: 16}}
                            visible = {addproductModal}
                            dismissable={false}
                        >
                            <View style={{flex:1}}>
                                <Text style={{alignSelf:'center', fontWeight:'bold', fontSize: 24, paddingVertical: 16}}>Add Product</Text>
                                {
                                    (filteredProduct.length === 0) 
                                    ? 
                                    <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize: 16}}>All the products already exist in this kiosk! You can edit the existing products.</Text>
                                        </View>
                                        
                                        <View style={{}}>
                                            <TouchableOpacity style={styles.doneButton} onPress={() => setAddProductModal(false)}>
                                                <Text style={{color: colors.white, fontWeight:'bold'}}>Done</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    :
                                    <View style={{flex:1}}>
                                        <View style={{flex:1}}>
                                            <View  style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between'}}>
                                                <Text style={{fontWeight:'bold', fontSize: 16, flex:0.4}}>Product: </Text>
                                                <SelectCountry 
                                                    style={styles.dropdown} 
                                                    selectedTextStyle={styles.selectedTextStyle} 
                                                    placeholderStyle={styles.placeholderStyle} 
                                                    placeholder="Select Product"
                                                    itemContainerStyle={{alignItems: 'center', justifyContent: 'center', marginLeft: -18}}
                                                    maxHeight={200} 
                                                    value={product_name} 
                                                    data={filteredProduct} 
                                                    valueField="name" 
                                                    labelField="name" 
                                                    onChange={e => {
                                                        setProduct_id(e._id)
                                                        setProduct_Name(e.name)
                                                        setProduct_price(e.price)
                                                        setDisableQ(false)
                                                    }}
                                                /> 
                                            </View>
                                            <TextInput style={{marginVertical:4}} label={'Unit Price*'} left={<TextInput.Affix text="₹"/>} defaultValue={product_price.toString()} value={product_price} keyboardType='number-pad' onChangeText={(value) => setProduct_price(value)}/>
                                        </View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 18, paddingVertical:30}}>
                                            <TouchableOpacity style={styles.canButton} onPress={() => {setDisableQ(true); setAddProductModal(false)}}>
                                                <Text style={{color: colors.themeblue, fontWeight:'bold'}}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity disabled={disableq} style={styles.saveButton} onPress={() => {addProduct()}}>
                                                <Text style={{color: colors.white, fontWeight:'bold'}}>Add</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    
                                }
                            </View>
                        </Modal>
                        <Modal
                            contentContainerStyle={{backgroundColor:colors.white, padding: 4,width: width*0.7,height: height*0.5, alignSelf:'center', position: 'relative'}}
                            visible = {spinner}
                            dismissable={false}
                        >
                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <ActivityIndicator size={64} color={colors.blue} />
                            </View>
                        </Modal>
                        <Modal
                            contentContainerStyle={{backgroundColor:colors.white, padding: 18,width: width*0.85,height: height*0.4, alignSelf:'center', position: 'relative', borderRadius: 16}}
                            visible = {removeproductModal}
                            dismissable={false}
                        >
                            <View style={{flex:1}}>
                                <Text style={{alignSelf:'center', fontWeight:'bold', fontSize: 24, paddingVertical: 16}}>Remove Product</Text>
                                
                                {
                                    (products.length === 0) 
                                    ? 
                                    <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize: 16}}>Nothing to remove! You can add the products.</Text>
                                        </View>
                                        
                                        <View style={{}}>
                                            <TouchableOpacity style={styles.doneButton} onPress={() => setRemoveProductModal(false)}>
                                                <Text style={{color: colors.white, fontWeight:'bold'}}>Done</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    :
                                  
                                    <View style={{flex:1}}>
                                        <View style={{flex:1}}>
                                            <View  style={{flexDirection:'row', alignItems:'center' , justifyContent:'space-between'}}>
                                                <Text style={{fontWeight:'bold', fontSize: 16, flex:0.4}}>Product: </Text>
                                                <SelectCountry 
                                                    style={styles.dropdown} 
                                                    selectedTextStyle={styles.selectedTextStyle} 
                                                    placeholderStyle={styles.placeholderStyle} 
                                                    placeholder="Select Product"
                                                    itemContainerStyle={{alignItems: 'center', justifyContent: 'center', marginLeft: -18}}
                                                    maxHeight={200} 
                                                    value={name} 
                                                    data={products} 
                                                    valueField="name" 
                                                    labelField="name" 
                                                    onChange={e => {
                                                        setProduct_id(e._id)
                                                        setDisableQ(false)
                                                    }}
                                                /> 
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 18, paddingVertical:30}}>
                                            <TouchableOpacity style={styles.canButton} onPress={() => {setDisableQ(true); setRemoveProductModal(false)}}>
                                                <Text style={{color: colors.themeblue, fontWeight:'bold'}}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity disabled={disableq} style={styles.saveButton} onPress={() => {removeProduct()}}>
                                                <Text style={{color: colors.white, fontWeight:'bold'}}>Remove</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    
                                } 
                            </View>
                        </Modal>
                        <Modal
                            contentContainerStyle={{backgroundColor: colors.navy, padding: 4,width: width*0.85,height: height*0.8, alignSelf:'center', position: 'relative'}}
                            visible = {mapModal}
                            onDismiss={() => {setMapModal(false)}}
                        >
                            <Callout style={styles.note}>
                                <View>
                                    <Text>Long Press to set the marker. Zoom in for best accuracy</Text>
                                </View>
                            </Callout>
                            <MapView
                                coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
                                provider={PROVIDER_GOOGLE}
                                loadingEnabled
                                showsUserLocation={false}
                                style={{ flex: 1, zIndex: -1, borderRadius: 18}}
                                initialRegion={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                }}
                                onMapLoaded={() => { setLatitude(location.coords.latitude);  setLongitude(location.coords.longitude)}}
                                onLongPress={(e) => { setLatitude(e.nativeEvent.coordinate.latitude); setLongitude(e.nativeEvent.coordinate.longitude)}}
                            >
                                <Marker
                                    draggable
                                    onDragEnd={(e) => { setLatitude(e.nativeEvent.coordinate.latitude); setLongitude(e.nativeEvent.coordinate.longitude)}}
                                    coordinate={{ latitude: location.coords.latitude, longitude:  location.coords.longitude }}
                                    title="Kiosk Location"
                                    description={`Kiosk Location: ${latitude}, ${longitude}`}
                                />
                            </MapView>
                            
                            <Callout style={styles.loginsection}>
            
                                <View style={{ marginTop: 15, alignItems:'center', justifyContent:'center'}}>
                                    <Text style={{fontSize:16, fontWeight:'bold'}}>Marked Location:</Text>
                                    <Text style={{fontSize:16, fontWeight:'bold'}}>{latitude}, {longitude}  </Text>
                                </View>
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginVertical: 8}}>
                                    <TouchableOpacity style={{paddingHorizontal: 12, paddingVertical: 5, backgroundColor: colors.themeblue, borderRadius: 12}} onPress={()=> setMapModal(false)}>
                                        <Text style={{color: colors.white, fontWeight:'500', fontSize: 18}}>Done</Text>
                                    </TouchableOpacity>
                                
                                </View>
                                
            
                            </Callout>
                        </Modal>
                    </Portal>
                    <View style={{padding: 24, flex:1}}>
                        <View style={{flex:1}}>
                            <Text style={{fontWeight:'bold', fontSize: 24}}>Add new Kiosk</Text>
                            <Text style={{fontWeight:'bold'}}>Basic Details:</Text>

                            <TextInput label={'Kiosk Name*'} defaultValue={name} onChangeText={(value) => {setName(value)}}/>
                            <TextInput label={'Address*'} defaultValue={address}  multiline onChangeText={(value) => {setAddress(value)}}/>

                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                <Text style={{fontWeight:'bold'}}>Operational:</Text>
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <RadioButton
                                        status={ operational ? 'checked' : 'unchecked' }
                                        onPress={() => setOperational(true)}
                                    />
                                    <Text>Yes</Text>
                                </View>
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <RadioButton
                                        status={ !operational ? 'checked' : 'unchecked' }
                                        onPress={() => setOperational(false)}
                                    />
                                    <Text style={{}}>No</Text>
                                </View>
                                
                            </View>
                            <View>
                                <Text style={{fontWeight:'bold'}}>Location:</Text>
                                <TextInput label={"Latitude*"} defaultValue={location.coords.latitude.toString()}  keyboardType='number-pad' onChangeText={(value)=>{setLatitude(parseFloat(value))}}/>
                                <TextInput label={"Longitude*"} defaultValue={location.coords.longitude.toString()}  keyboardType='number-pad' onChangeText={(value) => {setLongitude(parseFloat(value))}}/>
                                
                                <TouchableOpacity style={{ alignSelf: 'flex-end'}} onPress={() => setMapModal(true)}>
                                    <Text style={{color:colors.iconblue}}>Select using Map</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={{fontWeight:'bold'}}>Product List:</Text>
                                {
                                    (products.length > 0) ?
                                    <DataTable>
                                        <DataTable.Header>
                                            <DataTable.Title style={{flex:3}}>Name</DataTable.Title>
                                            <DataTable.Title>Price</DataTable.Title>
                                        </DataTable.Header>
                                        {
                                            products.map((product) =>{

                                                return(
                                                    <DataTable.Row key={product._id} style={{height: 64}}>
                                                        <DataTable.Cell style={{flex:3, justifyContent:'flex-start'}}>{product.name}</DataTable.Cell>
                                                        <DataTable.Cell><TextInput style={{fontSize: 14}} left={<TextInput.Affix text="₹" />} defaultValue={product.price.toString()} keyboardType='number-pad'/></DataTable.Cell>
                                                    </DataTable.Row>
                                                )
                                            })
                                        }
                                    </DataTable> : <View></View>
                                }
                                <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                                    <TouchableOpacity  onPress={() => setRemoveProductModal(true)}>
                                        <Text style={{color:'red', fontSize:16}}>- Remove Product</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setAddProductModal(true)}>
                                        <Text style={{color:colors.iconblue, fontSize:16}}>+ Add Product</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        
                        <View style={{justifyContent:'flex-end'}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 18, paddingVertical:30}}>
                                <TouchableOpacity style={styles.canButton} onPress={() => props.navigation.navigate('Kiosk')}>
                                    <Text style={{color: colors.themeblue, fontWeight:'bold'}}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveButton} onPress={() => onclickSave()}>
                                    <Text style={{color: colors.white, fontWeight:'bold'}}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                }
            </Provider>
        </>
    )
}
const styles = StyleSheet.create({
    container:{
        overflow: 'scroll',
        flexGrow: 1,
    },
    loginsection: {
        
        justifyContent: 'flex-end',
        alignSelf: 'center', 
        alignItems: 'center', 
        bottom: height*0.018,
        elevation: 10,
        zIndex: 2
    },
    note:{
        top: height*0.024,
        alignSelf: 'center', 
        alignItems: 'center', 
        elevation: 10,
        zIndex: 2
    },
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
    doneButton: {
        width:108,
        marginHorizontal: 12,
        padding: 10,
        backgroundColor: '#000F4D',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderRadius: 40,
        
    },
})
export default AddKiosk;