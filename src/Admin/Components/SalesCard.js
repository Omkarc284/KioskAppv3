import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../utils/colors';

const SalesCard = props => {
    const [expanded, setExpanded] = React.useState(false)
    const [time, setTime] = React.useState(()=>{
        var t = new Date(props.sale.saleTime);
        var hour = t.getHours().toString()
        if(parseInt(hour) < 10){
            hour = `0`+hour
        }
        var min = t.getMinutes().toString()
        if(parseInt(min) < 10){
            min = `0`+min
        }
        var sec = t.getSeconds().toString()
        if(parseInt(sec) < 10){
            sec = `0`+sec
        }
        return hour+':'+min+':'+sec 
    })
    return(
        <View style={styles.container}>
            <View >
                <View style={{ flex: 1}}>
                    
                    <TouchableOpacity 
                        style={styles.box}
                        onPress={()=>{
                            
                            props.navigation.navigate('SaleDetails', {
                                id: props.id,
                                token: props.token,
                                sale: props.sale,
                                navigation: props.navigation
                            })
                            
                        }}
                        
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex:1}}>
                                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                    <Text style={styles.subtitle}>{props.sale.kiosk_name}</Text>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <MaterialCommunityIcons name="timer" size={18} color="white" />
                                        <Text style={styles.subtitle}>{time} </Text>
                                    </View>
                                    
                                </View>
                                
                                <Text style={styles.title}>{props.sale.keeper_name}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Text style={styles.subtitle}>{props.sale.product_name} X  {props.sale.quantity}</Text>
                                    <Text style={styles.title}>₹ {props.sale.total} -  {props.sale.payment_mode}</Text>
                                </View>
                                
                            </View>
                            {/* <View>
                                <FontAwesome5 name="edit" size={24} color="white" />
                            </View> */}
                        </View>
                        
                    </TouchableOpacity>
                      
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        marginVertical: 8,
    },
    title:{
        fontSize: 21,
        fontWeight: '900',
        color: colors.tilewhite
    },
    subtitle:{
        fontSize: 14,
        fontWeight: '400',
        color: colors.tilewhite
    },
    box:{ 
        padding: 24,
        justifyContent: 'center',
        height: 108,
        backgroundColor:colors.themeblue,
        borderRadius: 20,
        elevation:6
    },
   
})

export default SalesCard;