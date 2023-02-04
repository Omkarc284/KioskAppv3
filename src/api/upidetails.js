import axios from 'axios';
import url from '../utils/url';
const upidetails = (token) => 
    axios.create({
        baseURL: 'http://'+url+'/upi',
        headers: {
            Authorization: `Bearer ` + token
        }
    })


export default upidetails;