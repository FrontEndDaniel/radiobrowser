import { createApp } from 'vue';
import App from './App.vue';
import fontawesome from '@/plugins/fontawesome'; 
import './plugins/axios'; 
import './assets/tailwind.css';
import router from '@/router';  

const app = createApp(App);

fontawesome(app); 

app.use(router);  

app.mount('#app');
