# DivaReal — loja e API de cosméticos

## Requisitos
- Node.js 19.3.0 ou superior (para este pacote de compatibilidade; Node.js 22 LTS é recomendado)
- npm

## Como executar
1. Extraia a pasta do projeto.
2. Abra o terminal dentro da pasta `cosmeticos-corrigido`.
3. Execute `npm install` (o `package.json` fixa versões compatíveis com Node.js 19.3.0).
4. Execute `npm start`.
5. Abra `http://localhost:3001` para a loja.
6. Abra `http://localhost:3001/api-docs` para a documentação Swagger.

A porta pode ser alterada pela variável de ambiente `PORT`. O Swagger usa uma URL relativa, então acompanha a porta configurada.

## Endpoints
| Método | Caminho | Função |
|---|---|---|
| GET | `/api/cosmeticos` | Lista os cosméticos |
| GET | `/api/cosmeticos/:id` | Consulta um cosmético |
| POST | `/api/cosmeticos` | Cadastra um cosmético |
| PUT | `/api/cosmeticos/:id` | Atualiza um cosmético |
| DELETE | `/api/cosmeticos/:id` | Exclui um cosmético |

## Exemplo de cadastro
Envie para `POST /api/cosmeticos` com `Content-Type: application/json`:

```json
{
  "nome": "Gloss Rosa",
  "marca": "DivaReal",
  "categoria": "Maquiagem",
  "descricao": "Gloss labial com brilho",
  "preco": 22.5,
  "quantidade": 10,
  "imagem": "https://exemplo.com/gloss.jpg"
}
```

Os dados são armazenados em `src/config/cosmeticos.json`. Faça uma cópia desse arquivo antes de testar operações de cadastro, atualização ou exclusão se quiser preservar o catálogo original.

O botão de finalizar pedido no frontend é apenas demonstrativo: não processa pagamento nem cria pedido no backend.


## Compatibilidade com Node.js 19.3.0
Este projeto fixa `swagger-jsdoc` em `6.2.8` e limita as dependências transitivas
`glob`, `lru-cache` e `path-scurry` a versões compatíveis com o Node.js 19.3.0.
Isso evita a chamada a `diagnostics_channel.tracingChannel`, que não existe nessa
versão do Node.js. O Node.js 19 está fora de suporte oficial; para uso contínuo,
prefira atualizar para Node.js 22 LTS.
