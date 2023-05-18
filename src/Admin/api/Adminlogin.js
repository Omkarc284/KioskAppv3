import axios from 'axios';
import url from '../utils/url';

export default axios.create({
    baseURL: 'http://'+url+'/admin',
})