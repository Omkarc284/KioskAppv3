import React from "react";
import { Text, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Platform, UIManager,LayoutAnimation, SafeAreaView, ActivityIndicator} from "react-native";
import { TextInput } from 'react-native-paper';
import summaryApi from "../../../api/summary";
import HeaderBar from "../../../Components/Headerbar";
import colors from "../../../utils/colors";
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
const {height, width} = Dimensions.get('window')

const ExpandableCard = ({ item, onClickFunction, status }) => {
    //Custom Component for the Expandable List
    const [layoutHeight, setLayoutHeight] = React.useState(0);
    const getTime = (time) => {
        if(time === null){
            //setDisplayStatus('Ongoing')
            return '-- : --'
        }else{
            var time = new Date(time)
            //setDisplayStatus('Completed')
            return time.toLocaleTimeString(undefined, {
                hour:   '2-digit',
                minute: '2-digit'
            })
        }
        
    }
    const getColor = ( ) => {
        if(status === 'Ongoing'){
            return colors.iconblue
        }else if(status === 'Completed'){
            return 'green'
        }else{
            return 'red'
        }
    }
    const getSession = (sessionTime) => {
        if (sessionTime.search(':') === -1){
            
            return '-- : --'
        }else{
            
            const arr = sessionTime.split(":");
            return arr[0]+' h '+arr[1]+' m'
        }
        
    }
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
          style={{ backgroundColor: colors.tilewhite, borderRadius: 12}}>
          <View style={{flexDirection:'row', flex:1, padding: 12, justifyContent:'space-between', alignItems:'stretch'}}>
                <View>
                    <Text style={styles.upperText}>
                        {item.kiosk_name}
                    </Text>
                    <Text style={styles.mainText}>
                        {item.keeper}
                    </Text>
                </View>
              {/* <View>
                  <Text style={styles.upperText}>
                      Available Stock
                  </Text>
                  <Text style={styles.mainText}>
                      {item.unsold_units}
                  </Text>
              </View> */}
          </View>
          <View
              style={{
              height: layoutHeight,
              overflow: 'hidden',
              borderRadius:12
              }}
          >
          {/*Content under the header of the Expandable List Item*/}
              <View style={{flex:1, backgroundColor: colors.tilewhite, flexDirection: 'row',  padding:12, justifyContent:'space-between'}}>
                  <View style={{ }}>
                      <Text style={styles.text}>Log In: </Text>
                      <Text style={styles.val}>{getTime(item.firstLoginTime)}</Text>
                  </View>
                  <View style={{alignItems:'center', justifyContent:'center'}}>
                    <View>
                        <Text style={styles.text1}> {getSession(item.sessionTime)}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
                        <Entypo name="dot-single" size={14} color={colors.text} />
                        <MaterialIcons name="horizontal-rule" size={14} color={colors.text} />
                        <MaterialIcons name="horizontal-rule" size={14} color={colors.text} />
                        <Entypo name="dot-single" size={32} color={getColor()} />
                        <MaterialIcons name="horizontal-rule" size={14} color={colors.text} />
                        <MaterialIcons name="horizontal-rule" size={14} color={colors.text} />
                        <Entypo name="dot-single" size={14} color={colors.text} />
                    </View>
                    <View>
                        <Text style={[styles.val1, {color: getColor()}]}> {status} </Text>
                    </View>
                  </View>
                  <View style={{ }}>
                      <Text style={styles.text}>Log Out:  </Text>
                      <Text style={styles.val}>{getTime(item.lastLogoutTime)}</Text>
                  </View>
                  {/* <View style={{ flex:1}}>
                      <Text style={styles.text}>Session:   </Text>
                      <Text style={styles.val}> {getSession(item.sessionTime)}</Text>
                  </View>
                  <View style={{ flex:1}}>
                      <Text style={styles.text}>Status:   </Text>
                      <Text style={[styles.val, status==='Ongoing' ? {color: colors.iconblue} : {color: 'green'} ]}> {status} </Text>
                  </View> */}
                  
              </View>
          
  
          </View>
        </TouchableOpacity>
        
      </View>
    );
  };

const Attendance = (props) => {
    const token = props.navigation.state.params.token
    const [date, setDate] = React.useState(new Date());
    const [result, setResult] = React.useState([])
    const [filteredData, setFilteredData] = React.useState(result)
    const [spinner, setSpinner] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState('')
    const [multiSelect, setMultiSelect] = React.useState(true);

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
    const getDataNow = async () => {
        var d = date
        let localDate = getDate(date)
        console.log(localDate)
        
        try {
            setSpinner(true)
            const response = await summaryApi(token).post(`/getattendance`,{
                date: localDate
            });
            const dat = await setExpansion(response.data.attendance)
            setResult(dat)
            setFilteredData(dat)
            setSpinner(false)
            console.log(response.data)
        } catch(err) {
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
    const getTime = (time) => {
        if(time.getMinutes() < 10){
            return (time.getHours()+ ': 0'+time.getMinutes())
        }else{
            return (time.getHours()+ ': '+time.getMinutes())
        }
    }
    // const getDataDate = async (date) => {
    //     try {
    //         const response = await summaryApi().post(`/getattendance`,{
    //             date: date
    //         });
    //         // setResult(response.data)
    //         // setFilteredProducts(response.data)
    //         console.log(response.data)
    //     } catch(err) {
    //         console.log("Error: ",err)
    //         setErrorMessage('Couldnt fetch data! Something went wrong! Try again!')
    //     }
    // }
    React.useEffect(() => {
        getDataNow();
    },[date])
    
    return(
        <>
            <HeaderBar navigation={props.navigation}/>
            <ScrollView style={styles.container}>
                <View style={{flexDirection:'row', alignItems:'center', flex:1, marginBottom: 18}}>
                    <TextInput 
                        style={styles.searchbox} 
                        underlineColor='transparent'
                        placeholder='Search'
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
                                if(item.keeper.toLowerCase().match(txt)) {
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
                <View style={{marginVertical: 24, flex:1}}>
                    
                    {
                    (spinner) ? 
                        <ActivityIndicator/>
                    :
                        
                        <View style={{marginBottom: 36}}>
                            {
                                (filteredData.length === 0) ?
                                <Text style={{color: colors.navy, fontSize: 18}}>
                                    An error occured from the server! Try changing the date or go back and try again. If the problem still persists contact admin!
                                </Text> :
                                filteredData.map((item) => {
                                    var status = 'Completed'
                                    if (item.sessionTime.search(':') === -1){
                                        status = 'Ongoing'
                                    }
                                    return (
                                        <ExpandableCard
                                            key={item.id}
                                            token ={token}
                                            onClickFunction={() => {
                                                updateLayout(item.id);
                                            }}
                                            item={item}
                                            status={status}
                                        />
                                    )
                                    
                                })
                            }
                        </View>
                       
                    
                }
                    
                </View>
            </ScrollView>
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
    text1: {
        fontSize: 14,
        color: '#606070',
        paddingHorizontal: 10,
    },
    val:{
        fontSize: 16,
        fontWeight: '500',
        paddingHorizontal: 10,
    },
    val1:{
        fontSize: 12,
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

export default Attendance;