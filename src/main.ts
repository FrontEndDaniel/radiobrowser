import { createApp } from 'vue';
import App from './App.vue';
import fontawesome from '@/plugins/fontawesome'; // Importa o Font Awesome como plugin
import './plugins/axios'; // Axios
import './assets/tailwind.css';

const app = createApp(App);

fontawesome(app); // Usa o plugin Font Awesome

app.mount('#app');
