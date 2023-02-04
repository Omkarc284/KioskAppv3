import axios from 'axios';
import url from '../utils/url';
const locationApi = () => 
    axios.create({
        baseURL: 'http://'+url+'/location',
    })

export default locationApi