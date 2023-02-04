import axios from 'axios';
import url from '../utils/url';
const ConfirmSale = (token) => 
    axios.create({
        baseURL: 'http://'+url+'/sales',
        headers: {
            Authorization: `Bearer ` + token
        }
    })


export default ConfirmSale;