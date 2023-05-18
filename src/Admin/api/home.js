import axios from 'axios';
import url from '../utils/url';
const kioskApi = (token) => 
    axios.create({
        baseURL: 'http://'+url+'/inventory',
        headers: {
            Authorization: `Bearer ` + token
        }
    })

export default kioskApi