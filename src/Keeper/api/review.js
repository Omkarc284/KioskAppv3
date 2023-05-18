import axios from 'axios';
import url from '../utils/url';
const ReviewPost = (token) => 
    axios.create({
        baseURL: 'http://'+url+'/ratings',
        headers: {
            Authorization: `Bearer ` + token
        }
    })


export default ReviewPost;