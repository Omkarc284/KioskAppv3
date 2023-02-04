import axios from 'axios';
import url from '../utils/url';
const logout = (token) => 
    axios.create({
        baseURL: 'http://'+url+'/keeperauth',
        headers: {
            Authorization: `Bearer ` + token
        }
    })


export default logout;