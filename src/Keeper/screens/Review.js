import React, { useState } from "react";
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import { AirbnbRating } from 'react-native-ratings';
import ReviewPost from "../api/review";
import Modal from 'react-native-modal';
import { FontAwesome5 } from '@expo/vector-icons'; 
const {height, width} = Dimensions.get('window');

const RatingScreen = (props) => {
    const [rating,setRating] = useState(4);
    const [message, setMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('')
    const token = props.navigation.state.params.keeper.token
    const kiosk_name = props.navigation.state.params.kiosk.name
    const [error, setError] = useState(false)
    const [isvisible, setIsVisible] = useState(false)
    const ratingCompleted=(rating)=> {
        setRating(rating)
    }
    const onSubmitReview = async () => {
        try{
            const response = await ReviewPost(token).post('/new_review',{
                rating,
                message,
                kiosk_name
            });
            console.log(response.data.message)
            setResponseMessage(response.data.message)
            setError(false)
            setIsVisible(true)
        }catch(err){
            console.log("Error: ",err)
            setResponseMessage('Something went wrong! Try again!')
            setError(true)
            setIsVisible(true)
        }
    }
    return(
        <>
            <View style={{justifyContent:'space-evenly', alignItems:'center'}}>
                <Modal
                    animationType = 'fade'
                    isVisible = {isvisible}
                    backdropOpacity={0.8}
                    onBackButtonPress={()=>{props.navigation.navigate('Home')}}
                    onDismiss={()=>{props.navigation.navigate('Home')}}
                >
                    <View style={styles.modal}>
                        { error ? 
                            <FontAwesome5 name="times-circle" size={42} color="red" />
                            :
                            <FontAwesome5 name="check-circle" size={42} color="green" />
                        }
                        <Text style={{marginVertical: 18, fontSize: 20}}>{responseMessage}</Text>
                        <TouchableOpacity style={styles.submitButton} onPress={()=>{
                            setIsVisible(false);
                            setError(false);
                            props.navigation.navigate('Home');
                        }}>
                            <Text style={{color: '#FFFFFF', fontSize: 18, fontWeight:'600'}}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <View style={{marginVertical: 36}}>
                    <Text style={{color:'#000F4D', fontSize:32}}>Rate our Service!</Text>
                </View>
                <View style={{marginVertical: 36}}>
                    <View>
                        <AirbnbRating onFinishRating={ratingCompleted}
                            count={5}
                            reviews={["Terrible!! 😞", "Bad 😐", "Its Okay 🙂", "Good! 😁", "Loved it! 🤩"]}
                            defaultRating={4}
                            size={48}
                            reviewSize={48}
                        />
                    </View>
                    <View style={{margin:24}}>
                        <Text style={{color:'#000F4D', fontSize:18}}>Tell us how you like it or how can we serve you better!</Text>
                        <TextInput
                            style={{width: width*0.88, marginVertical: 18, fontSize: 18}}
                            mode='flat'
                            multiline
                            numberOfLines={7}
                            textColor='#000F4D'
                            label="Feedback"
                            onChangeText={(value) => {
                                setMessage(value)
                            }}
                        />
                    </View>
                    <View>
                    <TouchableOpacity style={styles.submitButton} onPress={onSubmitReview}>
                        <Text style={{color: '#FFFFFF', fontSize: 18, fontWeight:'600'}}>Submit review</Text>
                    </TouchableOpacity>
                    </View>
                    
                </View>
                
            </View>
        </>
       
    )
}

const styles = StyleSheet.create({
    submitButton:{
        backgroundColor:'#000F4D', 
        justifyContent:'center',
        alignSelf: 'center',
        height: 50,
        width: 180,
        borderRadius: 10,
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: '#000F4D',
        elevation: 15
    },
    modal:{
        backgroundColor: '#FFFFFF', 
        alignSelf: 'center',
        justifyContent:'center' ,
        alignItems:'center',      
        height: height / 3 ,  
        width: width * 0.75,  
        borderRadius:10,  
        borderWidth: 1,  
        borderColor: '#fff',      
    }
});

export default RatingScreen;