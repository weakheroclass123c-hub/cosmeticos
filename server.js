import express from 'express';
import routes from './src/routes.js';
import { swaggerUi, swaggerSpec } from './docs/swagger.js';

export const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (req, res) => res.json({ mensagem: 'API Cosméticos', rotas: '/api/cosmeticos', swagger: '/api-docs' }));
app.use('/api/cosmeticos', routes);
app.use((req, res) => res.status(404).json({ status: 404, message: 'Rota não encontrada.' }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ status: 400, message: 'JSON inválido.' });
  console.error(err);
  return res.status(500).json({ status: 500, message: 'Erro interno.' });
});

if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => console.log(`API: http://localhost:${port} | Swagger: http://localhost:${port}/api-docs`));
}
