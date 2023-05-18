import React ,{useEffect, useState} from 'react';
import {View, Text, StyleSheet,ScrollView, Dimensions, ActivityIndicator  } from 'react-native';
import { TextInput } from 'react-native-paper';
import KioskCard from '../../Components/KioskCard';
import kioskApi from '../../api/kiosk';
import HeaderBar from '../../Components/Headerbar';
import { AnimatedFAB } from 'react-native-paper';
import colors from '../../utils/colors';
import { color } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const KioskScreen = (props) => {
    const [result, setResult] = useState([])
    const [filteredKiosk, setFilteredKiosks] = useState(result)
    const [errorMessage, setErrorMessage] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [isExtended, setIsExtended] = React.useState(true);
    const [spinner, setSpinner] = React.useState(false);
    const token = props.navigation.state.params.token
    const KioskApi = async () => {
        try {
            setSpinner(true);
            const response = await kioskApi(token).get(`/all`);
            setResult(response.data)
            setFilteredKiosks(response.data)
            // console.log(response.data)
            setSpinner(false);
        } catch(err) {
            console.log("Error: ",err)
            setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
        }
    
    }
    useEffect(() => {
        
        KioskApi();
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
                    (spinner) ? 
                        <View style={{alignSelf:'center', alignItems:'center', justifyContent:'center'}}>
                            <ActivityIndicator />
                        </View> :
                <View>
                
                
                    <View >
                        
                        <TextInput 
                            style={styles.searchbox} 
                            underlineColor='transparent'
                            placeholder='Search Kiosk'
                            left={<TextInput.Icon icon="magnify" size={35} />}
                            onChangeText={(value)=>{
                                if(value.trim() === ''){
                                    setFilteredKiosks(result)
                                }
                                setSearchTerm(value)
                            }}
                            onSubmitEditing={() => {
                                if(searchTerm.trim() === '' ){setFilteredKiosks(result)}
                                let txt = searchTerm.toLowerCase()
                                let filterResult = result.filter(item =>{
                                    if(item.name.toLowerCase().match(txt)) {
                                        return item
                                    }
                                })
                                setFilteredKiosks(filterResult)
                            }}
                        />
                    </View>
                    <View style={styles.list}>
                        {
                            filteredKiosk.map((item) => {
                                return <KioskCard 
                                    key={item._id} 
                                    id={item._id} 
                                    token={token}
                                    kiosk={item} 
                                    // token = {props.navigation.state.params.keeper.token}
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
                    label='Add Kiosk'
                    extended={isExtended}
                    style={styles.fab}
                    onPress={() => props.navigation.navigate('AddKiosk',{
                        token
                    })}
                    
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
        padding: 24,
    },
    fab: {
        position: 'absolute',
        margin: 24,
        right: 0,
        bottom: 0,
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

export default KioskScreen;