import axios from 'axios';

const kioskApi = (token) => 
    axios.create({
        baseURL: 'http://68.183.89.222:3000/inventory',
        headers: {
            Authorization: `Bearer ` + token
        }
    })

export default kioskApi