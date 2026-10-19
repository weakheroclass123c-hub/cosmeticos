# Backend Cosméticos

Projeto independente, feito com Node.js, Express e Swagger, com a mesma arquitetura básica do Projeto-Final fornecido.

## Requisitos
Node.js 18 ou superior e npm.

## Como executar
```powershell
npm.cmd install
npm.cmd start
```
No PowerShell do Windows, `npm.cmd` contorna o bloqueio de execução do arquivo `npm.ps1` sem mudar a política de segurança.

API: http://localhost:3001/api/cosmeticos

Swagger: http://localhost:3001/api-docs

Para executar com reinício automático: `npm.cmd run dev`.

Para testar: `npm.cmd test`.

## Endpoints
| Método | URL | Ação |
|---|---|---|
| GET | /api/cosmeticos | Listar todos |
| GET | /api/cosmeticos/:id | Buscar por ID |
| POST | /api/cosmeticos | Criar |
| PUT | /api/cosmeticos/:id | Atualizar campos |
| DELETE | /api/cosmeticos/:id | Excluir |

Exemplo de corpo para POST:
```json
{
  "nome": "Hidratante facial",
  "marca": "Marca Exemplo",
  "categoria": "Cuidados com a pele",
  "descricao": "Hidratante para uso diário",
  "preco": 39.9,
  "quantidade": 12,
  "imagem": "https://example.com/hidratante.jpg"
}
```

Para PUT, envie somente os campos que deseja alterar. O ID é gerado automaticamente e não deve ser enviado. Os registros estão em `src/config/cosmeticos.json`, com dados fictícios iniciais que podem ser substituídos. GET devolve `data: []` quando não há registros. Respostas incluem códigos HTTP 200, 201, 400, 404 e 500.

**Observação:** a persistência em JSON é adequada para projetos de estudo, mas não foi projetada para gravações concorrentes em produção. Não possui autenticação nem banco de dados externo.
