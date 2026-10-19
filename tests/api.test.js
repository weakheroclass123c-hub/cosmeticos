import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { app } from '../server.js';
const arquivo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/config/cosmeticos.json');
const inicial = fs.readFileSync(arquivo, 'utf8');
const raiz = "/api/cosmeticos";
const entrada = {"nome": "Hidratante facial", "marca": "Marca Exemplo", "categoria": "Cuidados com a pele", "descricao": "Hidratante para uso diário", "preco": 39.9, "quantidade": 12, "imagem": "https://example.com/hidratante.jpg"};

test('CRUD completo, erros e Swagger', async () => {
  const servidor = app.listen(0);
  await new Promise(resolve => servidor.once('listening', resolve));
  const url = `http://127.0.0.1:${servidor.address().port}`;
  const chamar = (rota, opcoes) => fetch(url + rota, opcoes);
  try {
    let r = await chamar(raiz); assert.equal(r.status, 200);
    assert.ok(Array.isArray((await r.json()).data));
    r = await chamar(raiz + '/abc'); assert.equal(r.status, 400);
    r = await chamar(raiz + '/999999'); assert.equal(r.status, 404);
    r = await chamar(raiz, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }); assert.equal(r.status, 400);
    r = await chamar(raiz, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(entrada) }); assert.equal(r.status, 201);
    const criado = (await r.json()).data;
    r = await chamar(raiz + '/' + criado.id); assert.equal(r.status, 200);
    r = await chamar(raiz + '/' + criado.id, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ preco: 0 }) }); assert.equal(r.status, 200);
    r = await chamar(raiz + '/' + criado.id, { method: 'DELETE' }); assert.equal(r.status, 200);
    r = await chamar(raiz + '/' + criado.id); assert.equal(r.status, 404);
    r = await chamar('/api-docs/'); assert.equal(r.status, 200);
  } finally {
    fs.writeFileSync(arquivo, inicial);
    await new Promise(resolve => servidor.close(resolve));
  }
});
