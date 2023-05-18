import React ,{useEffect, useState} from 'react';
import {View, Text, StyleSheet,ScrollView, Dimensions, ActivityIndicator ,UIManager, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import SaleApi from '../../api/sale';
import HeaderBar from '../../Components/Headerbar';
import { AnimatedFAB } from 'react-native-paper';
import colors from '../../utils/colors';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import SalesCard from '../../Components/SalesCard';

const { height } = Dimensions.get('window');

const SalesScreen = (props) => {
    const token = props.navigation.state.params.token
    const [result, setResult] = useState([])
    const [date, setDate] = React.useState(new Date());
    const [filteredData, setFilteredData] = React.useState(result)
    const [spinner, setSpinner] = React.useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [isExtended, setIsExtended] = React.useState(true);
    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    const onChange = (event, selectedDate) => {
        
        const currentDate = new Date(selectedDate);
        setDate(currentDate);
        //console.log(currentDate, typeof(currentDate))
    };
    
    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };
    const getSaleData = async () => {
        setSpinner(true)
        var dte = getDate(date)
        try {
            const response = await SaleApi(token).post(`/salesbydate`, {
                date: dte
            });
            setResult(response.data)
            setFilteredData(response.data)
            //console.log(response.data)
            setSpinner(false)
        } catch(err) {
            setSpinner(false)
            console.log("Error: ",err)
            setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
        }
    
    }
    const getDate = (date) => {
        let dte = date.getDate().toString();
        let month = (date.getMonth() + 1).toString();
        if(date.getDate() < 10) {
            dte = '0'+dte;
        }
        if((date.getMonth() + 1) < 10) {
            month = '0'+month;
        }
        let year = date.getFullYear();
        return (year+'-'+month+'-'+dte)
    }
    useEffect(() => {
        getSaleData();
    },[date])
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
                        <View style={{flex:1,alignSelf:'center', alignItems:'center', justifyContent:'center'}}>
                            <ActivityIndicator size={96} color={colors.blue}/>
                        </View> :
                <View>
                
                
                    <View >
                        
                        <TextInput 
                            style={styles.searchbox} 
                            underlineColor='transparent'
                            placeholder='Search Sales'
                            left={<TextInput.Icon icon="magnify" size={35} />}
                            onChangeText={(value)=>{
                                if(value.trim() === ''){
                                    setFilteredData(result)
                                }
                                setSearchTerm(value)
                            }}
                            onSubmitEditing={() => {
                                if(searchTerm.trim() === '' ){setFilteredData(result)}
                                let txt = searchTerm.toLowerCase()
                                let filterResult = result.filter(item =>{
                                    if(item.kiosk_name.toLowerCase().match(txt)) {
                                        return item
                                    }
                                    else if(item.keeper_name.toLowerCase().match(txt)) {
                                        return item
                                    }
                                    else if(item.payment_mode.toLowerCase().match(txt)) {
                                        return item
                                    }
                                })
                                setFilteredData(filterResult)
                            }}
                        />
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <Text style={{fontSize: 18,}}>Date: </Text>
                            <Text style={{fontSize: 18, fontWeight: '700', color: colors.themeblue}}>{date.toDateString()}</Text> 
                        </View>
                        <View >
                            <TouchableOpacity style={{borderRadius: 10, backgroundColor: colors.themeblue, padding:8, paddingHorizontal: 12}} onPress={showDatepicker}>
                                <Text style={{color: colors.white, fontWeight: '600'}}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.list}>
                        {
                            filteredData.map((item) => {
                                return <SalesCard
                                    key={item._id} 
                                    id={item._id}
                                    token={token} 
                                    sale={item} 
                                    // token = {props.navigation.state.params.keeper.token} 
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
                    label='Add a Sale'
                    extended={isExtended}
                    style={styles.fab}
                    onPress={() => props.navigation.navigate('AddSales',{
                        token: token
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
        marginBottom:18,
        elevation: 5
    },
    list:{

    }

});

export default SalesScreen;