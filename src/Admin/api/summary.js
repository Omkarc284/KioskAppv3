import axios from 'axios';
import url from '../utils/url';
const summaryApi = (token) => 
    axios.create({
        baseURL: 'http://'+url+'/summary',
        headers: {
            Authorization: `Bearer ` + token
        }
    })

export default summaryApi