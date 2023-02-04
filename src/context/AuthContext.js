import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import loginApi from "../api/login";
import logoutApi from "../api/logout";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
    switch (action.type) {
        case 'add_error' :
            return { ...state, errorMessage: action.payload };
        case 'login' :
            return { ...state, token: action.payload, errorMessage: ''};
        case 'clear_error_messsage' :
            return {...state, errorMessage: ''};
        case 'signout' :
            return { token: null, errorMessage: ''};
        default: 
            return state;
    }
}



const clearErrorMessage = dispatch => () => {
    dispatch({type: 'clear_error_message'})
}

const tryLocalLogin = dispatch => async () => {
    var k = await AsyncStorage.getItem('kiosk');
    const kiosk = JSON.parse(k);
    const token = await AsyncStorage.getItem('token');
    const data = await AsyncStorage.getItem('data');
    if(token && data ) {
        dispatch({ type: 'login', payload: token});
        navigate('Home', {
            data: JSON.parse(data),
            kiosk: kiosk
        })
    }else {
        navigate('Welcome');
    }
}

const login = (dispatch) => async ({username, password}) => {
    try {
        var k = await AsyncStorage.getItem('kiosk');
        const kiosk = JSON.parse(k);
        const response = await loginApi.post('/login', {username, password, kiosk});
        await AsyncStorage.setItem('token', response.data.token)
        await AsyncStorage.setItem('tokenExpiration', response.data.expiresIn.toString());
        await AsyncStorage.setItem('data', JSON.stringify(response.data))
        dispatch({type: 'login', payload: response.data.token})
        navigate('Home',{
            data: response.data,
            kiosk: kiosk
        })
    } catch (err) {
        console.log('Login Error:', err)
        dispatch({type: 'add_error', payload: 'Something went wrong!'})
    }
}


const logout = (dispatch) => async () => {
    try{
        var k = await AsyncStorage.getItem('kiosk');
        const kiosk = JSON.parse(k);
        const token = await AsyncStorage.getItem('token')
        const response = await logoutApi(token).post('/logout', {
            kiosk: kiosk
        });
        // console.log(response)
        if(response.status === 200) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('data');
            await AsyncStorage.removeItem('tokenExpiration');
            await AsyncStorage.removeItem('kiosk');
            dispatch({type: 'signout'})
            navigate('Welcome')
        }else{
            console.log("Something is wrong")
            return
        }
    } catch (err) {
        console.log("Error logout:", err)
    }
}
const logout0 = async () => {
    try{
        var k = await AsyncStorage.getItem('kiosk');
        const kiosk = JSON.parse(k);
        const token = await AsyncStorage.getItem('token')
        const response = await logoutApi(token).post('/logout', {
            kiosk: kiosk
        })
        if(response.status === 200) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('data');
            await AsyncStorage.removeItem('tokenExpiration');
            await AsyncStorage.removeItem('kiosk');
            navigate('Welcome')
        }else{
            return
        }
    } catch (err) {
        
    }
}

const checkTokenExpiration = async () => {
    try {
        const expirationTime = await AsyncStorage.getItem('tokenExpiration');
        const expTime = new Date(expirationTime).getTime() ;
        const now = new Date().getTime()
      if (expirationTime && (now > expTime)) {
        // Token has expired, so log the user out
        logout0();
      }
    } catch (error) {
      console.log(error);
    }
};
  
  
  
setInterval(checkTokenExpiration, 60000); // Run the check every 60 seconds
export const { Provider, Context } = createDataContext(
    authReducer,
    {login, logout, clearErrorMessage, tryLocalLogin },
    { token: null, errorMessage:'', data: null}
)