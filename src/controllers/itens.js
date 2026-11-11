import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const arquivo = path.join(__dirname, '../config/cosmeticos.json');
const campos = ['nome', 'marca', 'categoria', 'descricao', 'preco', 'quantidade', 'imagem'];
const obrigatorios = ['nome', 'categoria', 'preco', 'quantidade'];

function ler() {
  const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  if (!Array.isArray(dados)) throw new Error('O arquivo de cosméticos deve conter uma lista.');
  return dados;
}
function salvar(dados) {
  const temporario = `${arquivo}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporario, `${JSON.stringify(dados, null, 2)}\n`, 'utf8');
    fs.renameSync(temporario, arquivo);
  } finally {
    if (fs.existsSync(temporario)) fs.unlinkSync(temporario);
  }
}
function idValido(valor) {
  if (!/^[1-9]\d*$/.test(String(valor))) return null;
  const id = Number(valor);
  return Number.isSafeInteger(id) ? id : null;
}
function validar(body, parcial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Envie um objeto JSON válido.';
  const chaves = Object.keys(body);
  const desconhecidos = chaves.filter(campo => !campos.includes(campo));
  if (desconhecidos.length) return `Campos não permitidos: ${desconhecidos.join(', ')}. O ID é gerado automaticamente.`;
  if (parcial && chaves.length === 0) return 'Informe pelo menos um campo para atualizar.';
  if (!parcial) {
    const faltantes = obrigatorios.filter(campo => body[campo] === undefined || body[campo] === null || body[campo] === '');
    if (faltantes.length) return `Campos obrigatórios: ${faltantes.join(', ')}.`;
  }
  for (const campo of ['nome', 'marca', 'categoria', 'descricao', 'imagem']) {
    if (body[campo] !== undefined && (typeof body[campo] !== 'string' || !body[campo].trim())) {
      return `O campo "${campo}" deve ser um texto não vazio.`;
    }
  }
  if (body.preco !== undefined && (typeof body.preco !== 'number' || !Number.isFinite(body.preco) || body.preco < 0)) {
    return 'O preço deve ser um número maior ou igual a zero.';
  }
  if (body.quantidade !== undefined && (!Number.isInteger(body.quantidade) || body.quantidade < 0)) {
    return 'A quantidade deve ser um número inteiro maior ou igual a zero.';
  }
  return null;
}
function erroInterno(res, erro) {
  console.error('Erro ao acessar o catálogo:', erro);
  return res.status(500).json({ status: 500, message: 'Erro interno ao acessar os dados dos cosméticos.' });
}
function getAll(req, res) {
  try { return res.status(200).json({ status: 200, message: 'Lista consultada com sucesso.', data: ler() }); }
  catch (erro) { return erroInterno(res, erro); }
}
function getById(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ status: 400, message: 'ID inválido.' });
  try {
    const item = ler().find(produto => produto.id === id);
    if (!item) return res.status(404).json({ status: 404, message: 'Registro não encontrado.' });
    return res.status(200).json({ status: 200, data: item });
  } catch (erro) { return erroInterno(res, erro); }
}
function create(req, res) {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ status: 400, message: erro });
  try {
    const dados = ler();
    const novoId = dados.reduce((maior, item) => Math.max(maior, Number(item.id) || 0), 0) + 1;
    const novo = { id: novoId };
    for (const campo of campos) {
      if (req.body[campo] !== undefined) novo[campo] = typeof req.body[campo] === 'string' ? req.body[campo].trim() : req.body[campo];
    }
    dados.push(novo);
    salvar(dados);
    return res.status(201).json({ status: 201, message: 'Cosmético cadastrado com sucesso.', data: novo });
  } catch (erro) { return erroInterno(res, erro); }
}
function update(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ status: 400, message: 'ID inválido.' });
  const erro = validar(req.body, true);
  if (erro) return res.status(400).json({ status: 400, message: erro });
  try {
    const dados = ler();
    const indice = dados.findIndex(item => item.id === id);
    if (indice === -1) return res.status(404).json({ status: 404, message: 'Registro não encontrado.' });
    const atualizado = { ...dados[indice] };
    for (const [campo, valor] of Object.entries(req.body)) atualizado[campo] = typeof valor === 'string' ? valor.trim() : valor;
    const faltante = obrigatorios.find(campo => atualizado[campo] === undefined || atualizado[campo] === null || atualizado[campo] === '');
    if (faltante) return res.status(400).json({ status: 400, message: `O campo obrigatório "${faltante}" não pode ficar vazio.` });
    dados[indice] = atualizado;
    salvar(dados);
    return res.status(200).json({ status: 200, message: 'Cosmético atualizado com sucesso.', data: atualizado });
  } catch (erro) { return erroInterno(res, erro); }
}
function remove(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ status: 400, message: 'ID inválido.' });
  try {
    const dados = ler();
    const indice = dados.findIndex(item => item.id === id);
    if (indice === -1) return res.status(404).json({ status: 404, message: 'Registro não encontrado.' });
    const [removido] = dados.splice(indice, 1);
    salvar(dados);
    return res.status(200).json({ status: 200, message: 'Cosmético excluído com sucesso.', data: removido });
  } catch (erro) { return erroInterno(res, erro); }
}
export default {
  getAllCosmeticos: getAll,
  getCosmeticoById: getById,
  createCosmetico: create,
  updateCosmetico: update,
  deleteCosmetico: remove
};
