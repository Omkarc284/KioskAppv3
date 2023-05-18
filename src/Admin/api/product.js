import axios from 'axios';
import url from '../utils/url';
const productApi = (token) => 
    axios.create({
        baseURL: 'http://'+url+'/products',
        headers: {
            Authorization: `Bearer ` + token
        }
    })

export default productApi