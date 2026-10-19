import { Router } from 'express';
import controller from './controllers/itens.js';

const router = Router();

router.get('/', controller.getAllCosmeticos);
router.get('/:id', controller.getCosmeticoById);
router.post('/', controller.createCosmetico);
router.put('/:id', controller.updateCosmetico);
router.delete('/:id', controller.deleteCosmetico);

export default router;
