import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import colors from '../utils/colors';

const KioskCard = props => {
    const token = props.token
    const [expanded, setExpanded] = React.useState(false)
    const getboxcolor = () =>{
        if(props.kiosk.operational){
            return colors.themeblue
        }else{
            return '#660000'
        }
    }
    return(
        <View style={styles.container}>
            <View >
                <View style={{ flex: 1}}>
                    
                    <TouchableOpacity 
                        style={[styles.box, {backgroundColor: getboxcolor()}]}
                        onPress={()=>{
                            
                            props.navigation.navigate('KioskDetails', {
                                id: props.id,
                                token: token,
                                kiosk: props.kiosk,
                                title: props.title,
                                navigation: props.navigation
                            })
                            
                        }}
                        
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex:1}}>
                                <Text style={styles.title}>{props.title}</Text>
                                {
                                    (props.kiosk.operational) ? 
                                    <Text style={styles.subtitle}> Operational </Text> :
                                    <Text style={styles.subtitle}> Closed </Text>
                                }
                                
                            </View>
                            <View>
                                <FontAwesome5 name="edit" size={24} color="white" />
                            </View>
                        </View>
                        
                    </TouchableOpacity>
                      
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        marginVertical: 12,
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
        padding: 18,
        justifyContent: 'center',
        height: 108,
        backgroundColor:colors.themeblue,
        borderRadius: 20,
        elevation:6
    },
    icon:{
        marginLeft: -40,
        alignSelf: 'flex-start',
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        backgroundColor:'#FFFFFF'
    },
    next:{
        marginRight: -36,
        alignItems: 'center',
        alignSelf:'flex-end',
        width: 72,
        height: 72,
        borderRadius: 72 / 2,
        shadowColor:'black',
        shadowOpacity: 0.5,
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 20,
        elevation: 13,
        backgroundColor:'#FFFFFF'
    }
})

export default KioskCard;