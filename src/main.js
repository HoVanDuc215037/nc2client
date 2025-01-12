import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/router';
//const cookieParser = require('cookie-parser');

const app = createApp(App);
app.use(router); // Đảm bảo sử dụng Vue Router
app.mount('#app');
//app.use(cookieParser);
