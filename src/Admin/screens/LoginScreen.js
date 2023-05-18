import React, { useContext, useState } from "react";
import { Text, StyleSheet, View, ImageBackground, Dimensions, BackHandler } from "react-native";
import { TextInput } from "react-native-paper";
import { NavigationEvents } from "react-navigation";
import { TouchableOpacity } from "react-native";
import { Context as AuthContext } from "../../Keeper/context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";

const {height, width} = Dimensions.get("window");
const LoginScreen = props => {
    const { state, Alogin, clearErrorMessage } = useContext(AuthContext)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('')
    const [isPasswordSecure, setIsPasswordSecure] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null)
    const [spinner, setSpinner] = useState(false);
    
    // console.log(props.navigation.router)
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
    // React.useEffect(() => {
       
    //     const backAction = () => {
    //       props.navigation.navigate('Welcome')
    //     };
    
    //     const backHandler = BackHandler.addEventListener(
    //       'hardwareBackPress',
    //       backAction,
    //     );
    
    //     return () => backHandler.remove();
    //   },[]);
    return(
        <>

            <View style={{flex: 1}}>
                <Spinner
                    visible={spinner}
                    textContent={'Loading...'}
                    overlayColor='rgba(0, 0, 0, 0.75)'
                    textStyle={styles.spinnerTextStyle}
                />
                <NavigationEvents onWillBlur={clearErrorMessage} onDidBlur={clearErrorMessage}/>
                <View style={{flex: 1}}>
                    <View style={styles.pictureView}>
                        <ImageBackground source={require('../../../assets/loginbg.png')} resizeMode="cover" style={styles.image}>
                            
                        </ImageBackground>
                    </View>
                    <View style={styles.loginView}>
                        <View style={{flex:1}}>
                            <Text style={styles.welcomeStyle}>Welcome Admin!</Text>
                            <Text style={styles.subtext}>Continue with your User ID and Password</Text>
                            {
                                state.errorMessage ? 
                                <View>
                                    <Text style={styles.errorMessage}>{state.errorMessage}</Text>
                                </View> : <View><Text style={styles.errorMessage}> </Text></View>
                            }
                            <View style={{marginTop: 24, alignItems:'center', justifyContent:'center'}} >
                                <TextInput style={styles.textinput} underlineColor="transparent" placeholderTextColor={'#626262'} placeholder="Username" onChangeText={(value)=>setUsername(value)}/>
                                <TextInput 
                                    style={styles.textinput} 
                                    underlineColor="transparent" 
                                    placeholder="Password" 
                                    placeholderTextColor={'#626262'}
                                    secureTextEntry={isPasswordSecure}
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
                            </View>
                        </View>
                        <View style={{justifyContent: 'flex-end', marginBottom: height*0.036}}>
                            <TouchableOpacity 
                                style={styles.loginButton}
                                onPress={async () => {
                                    setSpinner(true);
                                    await Alogin({username, password})
                                    // props.navigation.navigate('HomeAdmin')
                                }}
                            >
                                <Text style={{ color: '#fff',fontSize: 20, fontWeight:'bold' }}>Login</Text>
                            </TouchableOpacity>

                        </View>
                        
                    </View>
                    
                </View>
                
            </View>
        </>
        
    )
};

const styles = StyleSheet.create({
    
    welcomeStyle: {
        fontSize: 36,
        color: '#1182AE',
        fontWeight: 'bold',
        paddingTop: 24,
        textAlign: 'center'
    },
    loginView: {
        padding:24,
        flex: 1,
        zIndex: 1,
        alignItems: "center",
    },
    pictureView: {
        flex: 0.8,
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
        textAlign:'center'
    },
    textinput: {
        fontSize: 20,
        marginBottom: 16,
        height: 80,
        width: width*0.8,
        borderRadius: 20,
        borderTopStartRadius:20,
        borderTopEndRadius:20,
        elevation: 15
    },
    loginButton: {
        padding: 10,
        backgroundColor: '#000F4D',
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        width: width*0.8,
        borderRadius: 40,
        elevation: 15
    },
    errorMessage: {
        fontSize: 20,
        color: 'red',
        fontWeight: '700',
        textAlign:'center'
    }
});

export default LoginScreen;

