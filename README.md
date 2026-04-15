![CI/CD](https://github.com/MatheusBenedikt/desafio-fullstack-merito/actions/workflows/deploy.yml/badge.svg)

# desafio-fullstack-merito

Dashboard de Investimentos — desafio técnico Full Stack Jr para a Mérito.

Permite cadastrar fundos de investimento, registrar aportes e resgates, e acompanhar o saldo da carteira em tempo real.

---

## Tecnologias

| Camada    | Tecnologia              |
|-----------|-------------------------|
| Backend   | Node.js + Express       |
| Frontend  | React (Next.js)         |
| Banco     | PostgreSQL               |
| Container | Docker / Docker Compose |
| CI/CD     | GitHub Actions          |

---

## Estrutura do projeto

```
desafio-fullstack-merito/
├── backend/
│   ├── src/
│   │   ├── __tests__/          # Testes automatizados
│   │   ├── controllers/        # Entrada e saída HTTP
│   │   ├── services/           # Regras de negócio
│   │   ├── repositories/       # Acesso ao banco de dados
│   │   ├── routes/             # Definição das rotas
│   │   ├── middleware/         # Tratamento de erros
│   │   ├── database/           # Conexão e migração
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/
├── docker-compose.yml
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org)
- [Docker e Docker Compose](https://docs.docker.com/get-docker/)

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/desafio-fullstack-merito.git
cd desafio-fullstack-merito
```

### 2. Suba a infraestrutura (Banco e Backend) com Docker

```bash
docker compose up -d
```

Isso sobe um PostgreSQL na porta `5433`, sobe o Backend automaticamente na porta `3001` e executa as migrações e prepara o banco de dados.

### 4. Inicie o frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend sobe em `http://localhost:3000`.

---

## Rotas da API

Todas as respostas seguem o padrão:

```json
{ "sucesso": true, "dados": { ... } }
{ "sucesso": false, "erro": "mensagem de erro" }
```

### Fundos

| Método | Rota               | Descrição              |
|--------|--------------------|------------------------|
| GET    | /api/fundos        | Lista todos os fundos  |
| GET    | /api/fundos/:id    | Busca um fundo pelo id |
| POST   | /api/fundos        | Cria um fundo          |
| PUT    | /api/fundos/:id    | Atualiza um fundo      |
| DELETE | /api/fundos/:id    | Remove um fundo        |

**Corpo para POST/PUT:**
```json
{
  "nome": "Fundo Renda Fixa",
  "ticker": "RF01",
  "tipo": "Renda Fixa",
  "valorCota": 10.50
}
```

### Movimentações

| Método | Rota                    | Descrição                   |
|--------|-------------------------|-----------------------------|
| GET    | /api/movimentacoes      | Lista todas as movimentações|
| POST   | /api/movimentacoes      | Registra aporte ou resgate  |
| DELETE | /api/movimentacoes/:id  | Remove uma movimentação     |

**Corpo para POST:**
```json
{
  "fundoId": 1,
  "tipo": "APORTE",
  "valor": 1000.00,
  "data": "2024-01-15"
}
```

> `tipo` aceita `"APORTE"` ou `"RESGATE"`

### Carteira

| Método | Rota          | Descrição                          |
|--------|---------------|------------------------------------|
| GET    | /api/movimentacoes/carteira | Retorna saldo e posição por fundo  |

**Resposta:**
```json
{
  "sucesso": true,
  "dados": {
    "carteira": {
      "saldo": 900.00,
      "totalInvestido": 1000.00,
      "totalResgatado": 100.00,
      "totalCotas": 85.714285
    },
    "posicoes": [
      {
        "fundoId": 1,
        "nome": "Fundo Renda Fixa",
        "ticker": "RF01",
        "tipo": "Renda Fixa",
        "valorCota": 10.50,
        "quantidadeCotas": 85.714285,
        "valorTotal": 900.00
      }
    ]
  }
}
```

---

## Como testar as APIs manualmente

### Via curl

```bash
# Criar um fundo
curl -X POST http://localhost:3001/api/fundos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Fundo Teste","ticker":"TST01","tipo":"Renda Fixa","valorCota":10}'

# Listar fundos
curl http://localhost:3001/api/fundos

# Registrar um aporte (substitua fundoId pelo id retornado acima)
curl -X POST http://localhost:3001/api/movimentacoes \
  -H "Content-Type: application/json" \
  -d '{"fundoId":1,"tipo":"APORTE","valor":500,"data":"2024-01-20"}'

# Ver carteira
curl http://localhost:3001/api/movimentacoes/carteira
```

### Via Postman

1. Importe uma nova coleção
2. Crie requests com as rotas da tabela acima
3. Base URL: `http://localhost:3001`
4. Nos requests de POST/PUT, selecione `Body > raw > JSON`

---

## Testes automatizados

Os testes rodam contra um banco PostgreSQL real (o mesmo do Docker Compose).

```bash
cd backend

# Garanta que o banco está rodando
docker compose up -d

# Rodar todos os testes
npm test

# Rodar em modo watch (re-executa ao salvar)
npm run test:watch
```

Os testes cobrem:

- Criação, listagem, atualização e remoção de fundos
- Validações: ticker duplicado, valorCota zero, campos obrigatórios
- Criação de aportes e resgates com cálculo automático de cotas
- Bloqueio de resgate com cotas insuficientes
- Bloqueio de exclusão que geraria saldo inconsistente
- Cálculo de saldo e posições da carteira

---

## CI/CD com GitHub Actions

O workflow em `.github/workflows/deploy.yml` executa automaticamente a cada push ou pull request na branch `main`:

1. **Testes** — sobe um PostgreSQL temporário e roda `npm test`
2. **Build Docker** — constrói a imagem do backend (só executa se os testes passarem)
3. **Deploy** — simulação de deploy (ponto de extensão para deploy real)

O status aparece na aba **Actions** do repositório no GitHub.
