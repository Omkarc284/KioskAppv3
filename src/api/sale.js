import axios from 'axios';

const ConfirmSale = (token) => 
    axios.create({
        baseURL: 'http://68.183.89.222:3000/sales',
        headers: {
            Authorization: `Bearer ` + token
        }
    })


export default ConfirmSale;