import { Router } from 'express';
import controller from './controllers/itens.js';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Cosmetico:
 *       type: object
 *       required: [nome, categoria, preco, quantidade]
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *           example: 1
 *         nome:
 *           type: string
 *           example: Batom Rosa
 *         marca:
 *           type: string
 *           example: DivaReal
 *         categoria:
 *           type: string
 *           example: Maquiagem
 *         descricao:
 *           type: string
 *           example: Batom de acabamento cremoso
 *         preco:
 *           type: number
 *           minimum: 0
 *           example: 25
 *         quantidade:
 *           type: integer
 *           minimum: 0
 *           example: 20
 *         imagem:
 *           type: string
 *           example: https://exemplo.com/imagem.jpg
 *     RespostaErro:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *         message:
 *           type: string
 */

/**
 * @openapi
 * /api/cosmeticos:
 *   get:
 *     tags: [Cosméticos]
 *     summary: Lista todos os cosméticos
 *     responses:
 *       '200':
 *         description: Lista consultada com sucesso
 *       '500':
 *         description: Erro ao acessar os dados
 */
router.get('/', controller.getAllCosmeticos);

/**
 * @openapi
 * /api/cosmeticos/{id}:
 *   get:
 *     tags: [Cosméticos]
 *     summary: Consulta um cosmético pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Cosmético encontrado
 *       '400':
 *         description: ID inválido
 *       '404':
 *         description: Registro não encontrado
 */
router.get('/:id', controller.getCosmeticoById);

/**
 * @openapi
 * /api/cosmeticos:
 *   post:
 *     tags: [Cosméticos]
 *     summary: Cadastra um novo cosmético
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cosmetico'
 *     responses:
 *       '201':
 *         description: Registro criado
 *       '400':
 *         description: Dados inválidos
 */
router.post('/', controller.createCosmetico);

/**
 * @openapi
 * /api/cosmeticos/{id}:
 *   put:
 *     tags: [Cosméticos]
 *     summary: Atualiza um cosmético existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cosmetico'
 *     responses:
 *       '200':
 *         description: Registro atualizado
 *       '400':
 *         description: Dados inválidos
 *       '404':
 *         description: Registro não encontrado
 */
router.put('/:id', controller.updateCosmetico);

/**
 * @openapi
 * /api/cosmeticos/{id}:
 *   delete:
 *     tags: [Cosméticos]
 *     summary: Exclui um cosmético
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Registro excluído
 *       '400':
 *         description: ID inválido
 *       '404':
 *         description: Registro não encontrado
 */
router.delete('/:id', controller.deleteCosmetico);

export default router;
