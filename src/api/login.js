import axios from 'axios';


export default axios.create({
    baseURL: 'http://68.183.89.222:3000/keeperauth',
})