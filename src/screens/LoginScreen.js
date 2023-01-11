import React, { useContext, useState } from "react";
import { Text, StyleSheet, View, ImageBackground, Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import { NavigationEvents } from "react-navigation";
import { TouchableOpacity } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const { height, width } = Dimensions.get('window');

const LoginScreen = props => {
    const { state, login, clearErrorMessage } = useContext(AuthContext)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('')
    const [isPasswordSecure, setIsPasswordSecure] = useState(true);

    // const loginApi = async () => {
    //     const response = await login.post('/login', {
    //         "username": username,
    //         "password": password
    //     });
    //     // console.log(response.data)
    //     if(response.status === 200){
    //         props.navigation.navigate('Home',{
    //             data: response.data
    //         })
    //     }else{
    //         console.log("Error: ", response)
    //     }
        
    // }

    return(
        <View style={{flex: 1}}>
            <NavigationEvents onWillBlur={clearErrorMessage} />
            <View style={{flex: 1}}>
                <View style={styles.pictureView}>
                    <ImageBackground source={require('../../assets/loginbg.png')} resizeMode="cover" style={styles.image}>
                        
                    </ImageBackground>
                </View>
                <View style={styles.loginView}>
                    
                    <Text style={styles.welcomeStyle}>Welcome</Text>
                    <Text style={styles.subtext}>Continue with your User ID and Password</Text>
                    {
                        state.errorMessage ? 
                        <View>
                            <Text style={styles.errorMessage}>{state.errorMessage}</Text>
                        </View> : null}
                    <View style={{margin: 18}} >
                        <TextInput style={styles.textinput} underlineColor="transparent" placeholderTextColor={'#626262'} placeholder="Username" onChangeText={(value)=>setUsername(value)}/>
                        <TextInput 
                            style={styles.textinput} 
                            underlineColor="transparent" 
                            placeholder="Password" 
                            placeholderTextColor={'#626262'}
                            secureTextEntry={isPasswordSecure}
                            keyboardType='numeric'
                            right={
                                <TextInput.Icon
                                    icon={ isPasswordSecure ? 'eye' : 'eye-off'} // where <Icon /> is any component from vector-icons or anything else
                                    onPress={() => { isPasswordSecure ? setIsPasswordSecure(false) : setIsPasswordSecure(true) }}
                                    color='black'
                                    size={35}
                                />
                            }
                            onChangeText={(value)=>setPassword(value)}
                            
                        />
                        <TouchableOpacity 
                            style={styles.loginButton}
                            onPress={async () => await login({username, password})}
                        >
                            <Text style={{ color: '#fff',fontSize: 20, fontWeight:'bold' }}>Login</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </View>
            
        </View>
        
        
    )
};

const styles = StyleSheet.create({
    welcomeStyle: {
        fontSize: 36,
        color: '#1182AE',
        fontWeight: 'bold',
        paddingTop: 24
    },
    loginView: {
        marginHorizontal: 28,
        flex: 0.6,
        zIndex: 1,
        alignItems: "center",
        
    },
    pictureView: {
        flex: 0.4,
        zIndex: -1,
        overflow: 'hidden'
    },
    image: {
        flex: 1,
        justifyContent: "center",
        
    },
    subtext: {
        fontSize: 18,
        color: '#1182AE',
    },
    textinput: {
        fontSize: 20,
        marginBottom: 16,
        height: 80,
        width: 330,
        borderRadius: 20,
        borderTopStartRadius:20,
        borderTopEndRadius:20,
        elevation: 15
    },
    loginButton: {
        marginTop: 18,
        padding: 10,
        backgroundColor: '#000F4D',
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        width: 330,
        borderRadius: 40,
        elevation: 15
    },
    errorMessage: {
        fontSize: 20,
        color: 'red',
        fontWeight: '700'
    }
});

export default LoginScreen;

