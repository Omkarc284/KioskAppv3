import axios from 'axios';

const upidetails = (token) => 
    axios.create({
        baseURL: 'http://68.183.89.222:3000/upi',
        headers: {
            Authorization: `Bearer ` + token
        }
    })


export default upidetails;