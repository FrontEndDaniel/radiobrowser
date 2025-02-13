import axios from 'axios';

let config = {
  // Sua configuração do axios
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Aqui, você pode adicionar algo antes de enviar a requisição
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

_axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// Não definir App diretamente, pois ele não está acessível aqui ainda
const Plugin = {
  install(app) {
    app.config.globalProperties.$axios = _axios;
  }
};

export default Plugin;
