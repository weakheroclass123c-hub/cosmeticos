import swaggerJsdoc from 'swagger-jsdoc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API DivaReal - Cosméticos',
      version: '1.0.0',
      description: 'API para listar, cadastrar, consultar, atualizar e excluir produtos cosméticos.'
    },
    // URL relativa: funciona na mesma porta em que o servidor estiver rodando.
    servers: [{ url: '/', description: 'Servidor atual' }],
    tags: [{ name: 'Cosméticos', description: 'Gerenciamento do catálogo de cosméticos' }]
  },
  apis: [path.join(__dirname, 'src', 'routes.js')]
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
