import React from "react";
import { Text, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Platform, UIManager,LayoutAnimation, SafeAreaView, ActivityIndicator} from "react-native";
import { TextInput, Modal,Portal, Provider } from 'react-native-paper';
import summaryApi from "../../../api/summary";
import HeaderBar from "../../../Components/Headerbar";
import colors from "../../../utils/colors";
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
// import Modal from 'react-native-modal';
const {height, width} = Dimensions.get('window')

const ExpandableCard = ({ item, onClickFunction }) => {
  //Custom Component for the Expandable List
  const [layoutHeight, setLayoutHeight] = React.useState(0);

  React.useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded]);

  return (
    <View style={{marginVertical: 8}}>
      {/*Header of the Expandable List Item*/}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClickFunction}
        style={{ backgroundColor: colors.tilewhite,  flex:1, borderRadius: 12}}>
        <View style={{flexDirection:'row', flex:1, padding: 12, justifyContent:'space-between', alignItems:'stretch'}}>
            <View>
                <Text style={styles.upperText}>
                    {item.kiosk_name}
                </Text>
                <Text style={styles.mainText}>
                    {item.product_name}
                </Text>
            </View>
            <View>
                <Text style={styles.upperText}>
                    Total Collection
                </Text>
                <Text style={styles.mainText}>
                    ₹ {item.total_collection}
                </Text>
            </View>
        </View>
        <View
            style={{
            height: layoutHeight,
            overflow: 'hidden',
            borderRadius:12
            }}
        >
        {/*Content under the header of the Expandable List Item*/}
            <View style={{backgroundColor: colors.tilewhite, flex:1, padding:12}}>
                <View style={{flexDirection: 'row', justifyContent:'space-between', flex:1}}>
                    <Text style={styles.text}>Total Unit Sales:   </Text>
                    <Text style={styles.val}> {item.sold_units}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent:'space-between', flex:1}}>
                    <Text style={styles.text}>Units Sales UPI: </Text>
                    <Text style={styles.val}>{item.sold_units - item.cash_unit_sales}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent:'space-between', flex:1}}>
                    <Text style={styles.text}>UPI Collection:   </Text>
                    <Text style={styles.val}> ₹ {item.total_collection - item.cash_collection}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent:'space-between', flex:1}}>
                    <Text style={[styles.text, {fontWeight: '700'}]}>Units Sales Cash:  </Text>
                    <Text style={[styles.val, {fontWeight: '700'}]}>{item.cash_unit_sales}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent:'space-between', flex:1}}>
                    <Text style={[styles.text, {fontWeight: '900'}]}>Cash Collection:   </Text>
                    <Text style={[styles.val, {fontWeight: '900'}]}>₹ {item.cash_collection}</Text>
                </View>
                
            </View>
        

        </View>
      </TouchableOpacity>
      
    </View>
  );
};
const Collection = (props) => {
    const token = props.navigation.state.params.token
    const [CashColl, setCashColl] = React.useState(null)
    const [TotalColl, setTotalColl] = React.useState(null)
    const [CashUnits, setCashUnits] = React.useState(null)
    const [TotalUnits, setTotalUnits] = React.useState(null)
    const [fromdate, setFromDate] = React.useState(new Date());
    const [spinner, setSpinner] = React.useState(false)
    const [todate, setToDate] = React.useState(new Date());
    const [data, setData] = React.useState([])
    const [filteredData, setFilteredData] = React.useState(data)
    const [searchTerm, setSearchTerm] = React.useState('')
    const [multiSelect, setMultiSelect] = React.useState(true);
    const [modal, setModal] = React.useState(false);
    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
   
    const onChangeFrom = (event, selectedDate) => {
        //console.log(event)
        const currentDate = new Date(selectedDate);
        setFromDate(currentDate);
        //console.log(currentDate, typeof(currentDate))
    };
    const showModeFrom = (currentMode) => {
        DateTimePickerAndroid.open({
            value: fromdate,
            onChange: onChangeFrom,
            mode: currentMode,
            is24Hour: true,
        });
        
    };
    const onChangeTo = (event, selectedDate) => {
        //console.log(event)
        const currentDate = new Date(selectedDate);
        setToDate(currentDate);
        //console.log(currentDate, typeof(currentDate))
    };
    const showModeTo = (currentMode) => {
        DateTimePickerAndroid.open({
            value: fromdate,
            onChange: onChangeTo,
            mode: currentMode,
            is24Hour: true,
        });
        
    };
    const showDatepickerTo = () => {
        showModeTo('date');
    };
    const showDatepickerFrom = () => {
        showModeFrom('date');
    };
    const updateLayout = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...filteredData];
        if (multiSelect) {
        const i = array.findIndex(p => p.id === index)
        // If multiple select is enabled
        array[i]['isExpanded'] = !array[i]['isExpanded'];
        } else {
        // If single select is enabled
        array.map((value, placeindex) =>
            placeindex === i
            ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
            : (array[placeindex]['isExpanded'] = false)
        );
        }
        setFilteredData(array);
    };
    const setExpansion = async(array) => {
        await array.forEach(d => {
            d.isExpanded = false;
        })
        // console.log(array)
        return array
    }
    const getData = async () => {
        var localtoDate = getDate(todate)
        let localfromDate = getDate(fromdate)
        try {
            setSpinner(true)
            const response = await summaryApi(token).post(`/getsalesdate`,{
                fromdate: localfromDate,
                todate: localtoDate
            });
            // setResult(response.data)
            // setFilteredProducts(response.data)
            console.log(response.data)
            const dat = await setExpansion(response.data.individual)
            setData(dat)
            setFilteredData(dat);
            setTotals(dat)
            setSpinner(false)
        } catch(err) {
            console.log("Error: ",err)
            //setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
        }
    
    }
    const setTotals = async (filterData) => {
        var cash = 0;
        var total = 0;
        var cashunits = 0;
        var totalunits = 0;
        await filterData.forEach((data) =>{
            cash = cash + data.cash_collection;
            total = total + data.total_collection;
            cashunits = cashunits + data.cash_unit_sales;
            totalunits = totalunits + data.sold_units;
        })
        setCashUnits(cashunits);
        setTotalUnits(totalunits);
        setCashColl(cash);
        setTotalColl(total);
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
    const getTime = (time) => {
        if(time.getMinutes() < 10){
            return (time.getHours()+ ': 0'+time.getMinutes())
        }else{
            return (time.getHours()+ ': '+time.getMinutes())
        }
    }

    // const getDataRange = async (date1, date2) => {

    // }

    React.useEffect(() => {
        getData();
    },[fromdate, todate])

    return(
        <>
            <HeaderBar navigation={props.navigation}/>
            <Provider>
            <ScrollView style={styles.container}>
                {
                    
                   <Portal> 
                    <Modal
                        contentContainerStyle={{backgroundColor: colors.navy, borderRadius: 18, padding: 18, width: width*0.75, alignSelf:'center', position: 'relative'}}
                        visible = {modal}
                    >
                        
                            <View style={{alignSelf:'center', justifyContent:'center', padding: 18}}>
                                <Text style={[styles.titleText, {color: colors.white}]}>Sales Details</Text>
                            </View>
                                
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.text, {color: colors.white, flex:1}]}>Units Sales UPI: </Text>
                                    <Text style={[styles.val,{color: colors.white}]}>{TotalUnits - CashUnits}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.text, {color: colors.white, flex:1}]}>UPI Collection:   </Text>
                                    <Text style={[styles.val,{color: colors.white}]}> ₹ {TotalColl - CashColl}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.text, {fontWeight: '700', color: colors.white, flex:1}]}>Units Sales Cash:  </Text>
                                    <Text style={[styles.val, {fontWeight: '700', color: colors.white}]}>{CashUnits}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.text, {fontWeight: '900', color: colors.white, flex:1}]}>Cash Collection:   </Text>
                                    <Text style={[styles.val, {fontWeight: '900', color: colors.white}]}>₹ {CashColl}</Text>
                                </View>
                                <View
                                    style={{ 
                                        borderBottomColor: 'white',
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        marginVertical: 12
                                    }}
                                />
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.text, {fontWeight: '900',color: colors.white, flex:1}]}>Total Unit Sales:   </Text>
                                    <Text style={[styles.val,{fontWeight: '900',color: colors.white}]}> {TotalUnits}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.text, {fontWeight: '900',color: colors.white, flex:1}]}>Total Collection:   </Text>
                                    <Text style={[styles.val,{fontWeight: '900',color: colors.white}]}>₹ {TotalColl}</Text>
                                </View>
                            
                        
                    </Modal>
                    </Portal>
                    
                }
                
                <View style={{flexDirection:'row', alignItems:'center', flex:1, marginBottom: 18}}>
                    <TextInput 
                        style={styles.searchbox} 
                        underlineColor='transparent'
                        placeholder='Search'
                        left={<TextInput.Icon icon="magnify" size={35} />}
                        onChangeText={(value)=>{
                            if(value.trim() === ''){
                                setFilteredData(data);
                                setTotals(data)
                            }
                            setSearchTerm(value)
                        }}
                        onSubmitEditing={() => {
                            if(searchTerm.trim() === '' ){setFilteredData(data); setTotals(data)}
                            let txt = searchTerm.toLowerCase()
                            let filterResult = data.filter(item =>{
                                if(item.product_name.toLowerCase().match(txt)) {
                                    return item
                                }
                                else if(item.kiosk_name.toLowerCase().match(txt)) {
                                    return item
                                }
                            })
                            setFilteredData(filterResult);
                            setTotals(filterResult);
                        }}
                    />
                    {/* <TouchableOpacity style={{marginHorizontal: 12}}>
                        <View>
                            <FontAwesome5 name="filter" size={24} color="black" />
                        </View>
                    </TouchableOpacity> */}
                </View>
                <View style={{flex:1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}}>
                    <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent:'center', marginRight: 8}}>
                        <Text style={{fontSize: 13,alignItems:'center', justifyContent:'center'}}>From: </Text>
                        <Text style={{fontSize: 13, fontWeight: '700', color: colors.themeblue,alignItems:'center', justifyContent:'center'}}>{fromdate.toDateString()}</Text> 
                        <TouchableOpacity style={{alignItems:'center', justifyContent:'center', paddingHorizontal: 5}} onPress={showDatepickerFrom}>
                            <FontAwesome5 name="edit" size={18} color={colors.iconblue} />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent:'center', marginLeft: 8}}>
                        <Text style={{fontSize: 13,alignItems:'center', justifyContent:'center'}}>To: </Text>
                        <Text style={{fontSize: 13, fontWeight: '700', color: colors.themeblue,alignItems:'center', justifyContent:'center'}}>{todate.toDateString()}</Text> 
                        <TouchableOpacity style={{alignItems:'center', justifyContent:'center', paddingHorizontal: 5}} onPress={showDatepickerTo}>
                            <FontAwesome5 name="edit" size={18} color={colors.iconblue} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={{ 
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        marginVertical: 12
                    }}
                />
                {
                    (spinner) ? 
                        <ActivityIndicator/>
                    :
                        
                        <View style={{marginBottom: 36}}>
                            {
                                filteredData.map((item) => {
                                    return (
                                        <ExpandableCard
                                            key={item.id}
                                            token={token}
                                            onClickFunction={() => {
                                                updateLayout(item.id);
                                            }}
                                            item={item}
                                        />
                                    )
                                    
                                })
                            }
                        </View>
                       
                    
                }
                    
                
            </ScrollView>
            <View style={{backgroundColor: colors.themeblue, height: height*0.08, alignItems: 'center',elevation: 20, justifyContent:'center',position: 'relative', borderTopRightRadius: 24, borderTopLeftRadius:24}}>
                <TouchableOpacity style={{alignSelf:"center", zIndex: 3, position: "absolute", elevation:15}} onPressIn={() => {setModal(true)}} onPressOut={() => {setModal(false)}}>
                    <FontAwesome name="angle-double-up" size={36} color="white"  />
                </TouchableOpacity>
                
                <View style={{flexDirection: 'row',flex:1, alignSelf:'center'}}>
                    <View style={{flex:1,alignItems: 'center', paddingVertical:12}}>
                        <Text style={{color: colors.white}}>Cash Collection </Text>
                        {
                            ( spinner) ? <ActivityIndicator color='white'/> : <Text style={{color: colors.white, fontWeight: '900', fontSize: 18}}>₹ {CashColl}</Text>
                        }
                        
                    </View>
                    {/* <View style={styles.verticleLine}></View> */}
                    <View style={{flex:1, alignItems: 'center', paddingVertical:12}}>
                        <Text style={{color: colors.white}}>Total Collection </Text>
                        {
                            ( spinner) ? <ActivityIndicator color='white'/> : <Text style={{color: colors.white, fontWeight: '900', fontSize: 18}}>₹ {TotalColl}</Text>
                        }
                    </View>
                    
                </View>
                
            </View>
            </Provider>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        padding:18
    },
    upperText:{
        fontSize:16,
        fontWeight: '400',
        color: colors.text
    },
    mainText: {
        fontSize:22,
        fontWeight: 'bold',
        color: colors.text,
        alignSelf: 'flex-end'
    },
    searchbox:{
        fontSize: 18,
        overflow: 'hidden',
        borderRadius: 40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        flex:1,
        height: 60
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
      },
      header: {
        backgroundColor: '#F5FCFF',
        padding: 20,
      },
      headerText: {
        fontSize: 16,
        fontWeight: '500',
      },
    
      text: {
        fontSize: 16,
        color: '#606070',
        paddingHorizontal: 10,
      },
      val:{
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
        paddingHorizontal: 10,
      },
      content: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
      },
      verticleLine: {
        marginVertical: 12,
        height: '100%',
        width: 1,
        backgroundColor: colors.white,
      },
      modal:{
        alignSelf: 'center',       
        height: height / 1.2 ,  
        width: width * 0.85,  
        borderRadius:10,  
        borderWidth: 1,  
        borderColor: '#fff', 
      }
      
})

export default Collection;