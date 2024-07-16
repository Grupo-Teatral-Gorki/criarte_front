const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.grupogorki.com.br', // URL da sua API
      changeOrigin: true,
    })
  );
};
