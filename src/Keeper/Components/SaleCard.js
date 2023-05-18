import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'; 
import SaleModal from './SaleModal';

const SaleCard = props => {
    const [isVisible, setIsVisible] = useState(false)
    const [product, setProduct] = useState({
        product_id: props.id,
        product_name: props.name,
        product_price: props.price,
        count: props.count,
        token: props.token,
        summary: props.summary,
    });
    useEffect(()=> {
        setIsVisible(false)
    },[])
    return(
        <View style={styles.container}>
            <SaleModal product={product} isVisible={isVisible} navigation={props.navigation} setVisible={()=>{setIsVisible(!isVisible)}} />
            <View style={styles.box}>
                <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{justifyContent: 'center'}}>
                        <View style={styles.icon}>
                            <View style={{padding: 12}}>
                            <Entypo name="shopping-bag" size={54} color="black" />
                            </View>
                            
                        </View>
                    </View>
                    <View style={{flex: 1, justifyContent:'center', marginHorizontal: 24}}>
                        <Text style={styles.title}>{props.name}</Text>
                        <Text style={styles.subtitle}>{props.count} units</Text>
                    </View>
                    <View style={{justifyContent: 'center', alignItems:'center'}}>
                        <TouchableOpacity 
                            style={styles.next}
                            onPress={()=>{
                                setIsVisible(true)
                            }}
                        >
                            <MaterialIcons style={{padding: 13,alignSelf:'center'}} name="navigate-next" size={42} color="black" />
                            
                        </TouchableOpacity>
                    </View>  
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        marginVertical: 15,
        
    },
    title:{
        fontSize: 24,
        fontWeight: '900',
        color: '#4A4B4D'
    },
    subtitle:{
        fontSize: 14,
        fontWeight: '400',
        color: '#4A4B4D'
    },
    box:{
        flexDirection: 'row',
        paddingVertical: 15,
        justifyContent: 'center',
        marginLeft: 100,
        marginRight: 54,
        height: 120,
        backgroundColor:'#FFFFFF',
        borderRadius: 20
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
    },
    
})

export default SaleCard;