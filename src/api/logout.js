import axios from 'axios';

const logout = (token) => 
    axios.create({
        baseURL: 'http://68.183.89.222:3000/keeperauth',
        headers: {
            Authorization: `Bearer ` + token
        }
    })


export default logout;