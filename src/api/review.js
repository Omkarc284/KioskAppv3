import axios from 'axios';

const ReviewPost = (token) => 
    axios.create({
        baseURL: 'http://68.183.89.222:3000/ratings',
        headers: {
            Authorization: `Bearer ` + token
        }
    })


export default ReviewPost;