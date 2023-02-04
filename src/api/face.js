import axios from 'axios';

const faceApi = () => 
    axios.create({
        baseURL: 'http://192.168.0.106:3000/face',
    })

export default faceApi