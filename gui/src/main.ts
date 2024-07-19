import { createApp } from 'vue';
import App from './App.vue';
import vuetify from '@/plugins/vuetify.ts';
import router from '@/router';
import { createApiClient } from '@/api';
import urlJoin from 'url-join';

const app = createApp(App);

app.use(vuetify);

app.use(router);

const apiClient = createApiClient({
  baseURL: urlJoin(import.meta.env.VITE_APP_ENDPOINT, 'api'),
});

app.use(apiClient);

app.mount('#app');
