import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './src/routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

// Loja (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Documentação da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'DivaReal | Documentação da API'
}));

// Rotas da API
app.use('/api/cosmeticos', routes);

// Verificação simples do servidor
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'API DivaReal funcionando.',
    docs: '/api-docs',
    produtos: '/api/cosmeticos'
  });
});

// 404 em JSON para caminhos da API e texto para os demais
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ status: 404, message: 'Rota não encontrada.' });
  }
  return res.status(404).send('Página não encontrada.');
});

// Tratamento centralizado de erros
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ status: 400, message: 'JSON inválido.' });
  }
  console.error(err);
  return res.status(500).json({ status: 500, message: 'Erro interno do servidor.' });
});

const port = Number(process.env.PORT) || 3001;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Loja: http://localhost:${port}`);
    console.log(`API: http://localhost:${port}/api/cosmeticos`);
    console.log(`Swagger: http://localhost:${port}/api-docs`);
  });
}
