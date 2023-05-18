import axios from 'axios';
import url from '../utils/url';

function newAbortSignal(timeoutMs) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);
    console.log("aborted")
    return abortController.signal;
}
const locationApi = () => 
    
    axios.create({
        baseURL: 'http://'+url+'/location',
    },{signal: newAbortSignal(5000)})

export default locationApi