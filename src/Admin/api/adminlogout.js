import axios from 'axios';
import url from '../utils/url';
const adminlogout = (token) => 
    axios.create({
        baseURL: 'http://'+url+'/admin',
        headers: {
            Authorization: `Bearer ` + token
        }
    })


export default adminlogout;