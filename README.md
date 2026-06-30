# 🚧 Tem Barricada Aí?

Aplicativo colaborativo para informar, visualizar e evitar barricadas em ruas, bairros e regiões.

O objetivo do projeto é permitir que usuários reportem barricadas em tempo real e consultem informações atualizadas sobre obstáculos urbanos, aumentando a segurança e melhorando o planejamento de deslocamentos.

---

# 📱 Demonstração

Frontend:
https://SEU-PROJETO.vercel.app

Backend:
https://app-barricada.onrender.com

---

# 🚀 Funcionalidades

## 🗺️ Mapa Interativo

- Visualização das barricadas em mapa Google Maps.
- Atualização automática dos dados.
- Marcadores personalizados para barricadas.

---

## 📍 Geolocalização

- Obtém a localização atual do usuário.
- Exibe posição em tempo real.
- Botão para centralizar novamente no usuário.

---

## 🚨 Alertas de Proximidade

Quando uma barricada estiver próxima:

- Alerta visual em laranja.
- Alerta crítico em vermelho.
- Distância calculada em tempo real.

---

## ➕ Reporte de Barricadas

Usuários podem:

- Selecionar um ponto no mapa.
- Criar uma nova ocorrência.
- Atualizar automaticamente todos os usuários.

---

## 📱 Compatibilidade Mobile

Testado em dispositivos Android:

- Permissões de GPS.
- Navegação por toque.
- Arraste do mapa com um dedo.
- Responsividade da interface.

---

## 🔎 Pesquisa de Destino

Integração com Google Places API.

Permite:

- Buscar endereços.
- Buscar bairros.
- Buscar cidades.

Exemplos:

- Madureira
- Copacabana
- Barra da Tijuca

---

## 🌐 Funcionamento Offline

Caso a conexão seja perdida:

- Exibe aviso de modo offline.
- Utiliza dados armazenados localmente.
- Mantém acesso às últimas barricadas carregadas.

---

# 🛠️ Tecnologias Utilizadas

## Frontend

- React
- React Router DOM
- Google Maps JavaScript API
- Places API
- PWA

## Backend

- Node.js
- Express

## Banco de Dados

- PostgreSQL

## Deploy

- Vercel (Frontend)
- Render (Backend)

---

# 📂 Estrutura do Projeto

frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── App.js
│
backend/
├── routes/
├── controllers/
├── database/
└── server.js

---

# ⚙️ Instalação

## Frontend

```bash
cd frontend
npm install
npm start
```

## Backend

```bash
cd backend
npm install
npm start
```

---

# 🔑 Variáveis de Ambiente

Frontend (.env)

```env
REACT_APP_GOOGLE_MAPS_API_KEY=SUA_CHAVE
```

---

# 📌 Roadmap

## MVP Atual

- [x] Mapa Google Maps
- [x] Geolocalização
- [x] Cadastro de barricadas
- [x] Alerta de proximidade
- [x] Botão "Minha Localização"
- [x] Busca por destinos
- [x] Compatibilidade Android
- [x] Funcionamento Offline

---

## Próximas Funcionalidades

### Rotas Inteligentes

- [ ] Directions API
- [ ] Exibir rota até destino
- [ ] Exibir distância e tempo
- [ ] Destacar barricadas na rota

### Sistema Colaborativo

- [ ] Confirmar barricada
- [ ] Remover barricada inexistente
- [ ] Níveis de confiabilidade

### Administração

- [ ] Dashboard
- [ ] Estatísticas
- [ ] Heatmap

### Segurança

- [ ] Login de usuários
- [ ] Controle de permissões

---

# 🎯 Objetivo

Criar uma plataforma colaborativa semelhante ao Waze, focada na identificação e prevenção de áreas com barricadas, auxiliando moradores, motoristas, entregadores e serviços públicos.

---

# 👨‍💻 Equipe

Projeto desenvolvido como MVP acadêmico para validação de conceito e evolução futura para plataforma de monitoramento colaborativo urbano.

---

# 📄 Licença

Projeto desenvolvido para fins acadêmicos e de pesquisa.