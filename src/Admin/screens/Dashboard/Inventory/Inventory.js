import React from "react";
import { Text, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Platform, UIManager,LayoutAnimation, SafeAreaView, ActivityIndicator} from "react-native";
import { TextInput } from 'react-native-paper';
import summaryApi from "../../../api/summary";
import HeaderBar from "../../../Components/Headerbar";
import colors from "../../../utils/colors";
import { AnimatedFAB } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
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
                    Available Stock
                </Text>
                <Text style={styles.mainText}>
                    {item.unsold_units}
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
                    <Text style={styles.text}>Opening Stock: </Text>
                    <Text style={styles.val}>{item.opening_units}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent:'space-between', flex:1}}>
                    <Text style={styles.text}>Sold:  </Text>
                    <Text style={styles.val}>{item.sold_units}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent:'space-between', flex:1}}>
                    <Text style={styles.text}>Stock Price:   </Text>
                    <Text style={styles.val}>₹ {item.product_price}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent:'space-between', flex:1}}>
                    <Text style={styles.text}>Total Stock:   </Text>
                    <Text style={styles.val}>{item.total_units}</Text>
                </View>
                
            </View>
        

        </View>
      </TouchableOpacity>
      
    </View>
  );
};
const Inventory = (props) => {
    const token = props.navigation.state.params.token
    const [date, setDate] = React.useState(new Date());
    const [data, setData] = React.useState([])
    const [spinner, setSpinner] = React.useState(false)
    const [filteredData, setFilteredData] = React.useState(data)
    const [searchTerm, setSearchTerm] = React.useState('')
    const [multiSelect, setMultiSelect] = React.useState(true);
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
        console.log(array)
        return array
    }
    const getData = async () => {
        setSpinner(true)
        var d = date
        let localDate = getDate(date)
        try {
            
            const response = await summaryApi(token).post(`/getinventorydate`,{
                date: localDate
            });
            // setResult(response.data)
            // setFilteredProducts(response.data)
            // console.log(response.data)
            const dat = await setExpansion(response.data.individual)
            setData(dat)
            setFilteredData(dat)
            setSpinner(false)
        } catch(err) {
            setSpinner(false)
            console.log("Error: ",err)
            //setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
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

    // const getDataRange = async (date1, date2) => {

    // }

    React.useEffect(() => {
        getData();
    },[date])
    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
          Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    
        setIsExtended(currentScrollPosition <= 0);
    };
    return(
        <>
            <HeaderBar navigation={props.navigation}/>
            <ScrollView contentContainerStyle={styles.container} onScroll={onScroll}>
                <View style={{flexDirection:'row', alignItems:'center', flex:1, marginBottom: 18}}>
                    <TextInput 
                        style={styles.searchbox} 
                        underlineColor='transparent'
                        placeholder='Search'
                        left={<TextInput.Icon icon="magnify" size={35} />}
                        onChangeText={(value)=>{
                            if(value.trim() === ''){
                                setFilteredData(data)
                            }
                            setSearchTerm(value)
                        }}
                        onSubmitEditing={() => {
                            if(searchTerm.trim() === '' ){setFilteredData(data)}
                            let txt = searchTerm.toLowerCase()
                            let filterResult = data.filter(item =>{
                                if(item.product_name.toLowerCase().match(txt)) {
                                    return item
                                }
                                else if(item.kiosk_name.toLowerCase().match(txt)) {
                                    return item
                                }
                            })
                            setFilteredData(filterResult)
                        }}
                    />
                    {/* <TouchableOpacity style={{marginHorizontal: 12}}>
                        <View>
                            <FontAwesome5 name="filter" size={24} color="black" />
                        </View>
                    </TouchableOpacity> */}
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}}>
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
                <View
                    style={{ 
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        marginVertical: 12
                    }}
                />
                {
                    (spinner) ? 
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <ActivityIndicator size={96} color={colors.blue} />
                    </View>
                    :
                        
                        <View >
                            {
                                (filteredData.length === 0) ?
                                <Text>
                                    An error occured from the server!
                                </Text> :
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
            <View  style={{}}>
                <AnimatedFAB
                    icon="pencil"
                    label='Edit Inventories'
                    extended={isExtended}
                    style={styles.fab}
                    onPress={() => props.navigation.navigate('EditInventory',{
                        token: token,
                    })}
                    
                    animateFrom={'right'}
                    iconMode={'dynamic'}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        padding:18,
        overflow: 'scroll',
        
    },
    fab: {
        position: 'absolute',
        margin: 24,
        right: 0,
        bottom: 0,
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
        flex: 1,
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
})

export default Inventory;