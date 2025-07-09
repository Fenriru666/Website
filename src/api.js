import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:5000', // URL của backend
     timeout: 5000, // Thời gian chờ tối đa 5 giây
   });

   export default api;