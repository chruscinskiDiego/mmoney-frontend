# MMoney — interface de finanças pessoais

Interface web para organização de finanças pessoais, integrada à API MMoney.

## Funcionalidades

- Telas de login e cadastro.
- Gerenciamento de bancos, contas, categorias e despesas.
- Gráficos de despesas e visão por categorias.
- Rotas protegidas e envio de token nas chamadas à API.

## Tecnologias

React, TypeScript e Vite. As bibliotecas e versões estão em [package.json](package.json).

## Executar localmente

Requer Node.js e npm.

```bash
git clone https://github.com/chruscinskiDiego/mmoney-frontend.git
cd mmoney-frontend
npm ci
# Configure o arquivo .env antes de iniciar
npm run dev
```

### Configuração

Defina VITE_SERVER_ADDRESS no arquivo .env com a URL do backend. Confira também as opções de HTTPS e a origem permitida pelo CORS do servidor.

## Comandos

- `npm run dev`: servidor de desenvolvimento.
- `npm run build`: verificação TypeScript e build.
- `npm run preview`: prévia do build.
- `npm run lint`: análise estática.

## Integração

Backend: [mmoney-backend](https://github.com/chruscinskiDiego/mmoney-backend).

## Escopo

Projeto pessoal com dependência do backend para autenticação e dados. O ambiente local usa configurações específicas de HTTPS que devem ser alinhadas entre cliente e servidor.

