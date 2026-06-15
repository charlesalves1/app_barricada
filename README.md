# 🚧 Tem Barricada Aí?

Aplicação colaborativa para monitoramento e visualização de barricadas em ruas, bairros e regiões.

O sistema permite que qualquer usuário informe anonimamente a existência de uma barricada através do mapa. As informações passam por validação administrativa antes de serem exibidas para os demais usuários.

---

## 🎯 Objetivo

Ajudar a população a identificar regiões com barricadas, fornecendo uma ferramenta simples, colaborativa e acessível através de navegador ou instalação como aplicativo (PWA).

---

# 🚀 Funcionalidades

### Usuário

* 📍 Localização em tempo real via GPS
* 🗺️ Visualização de mapa interativo
* 🚧 Registro anônimo de barricadas
* 📌 Exibição de barricadas aprovadas
* ⚠️ Alerta visual de proximidade de barricadas
* 📱 Compatível com dispositivos móveis
* 📲 Instalação como aplicativo (PWA)

### Administração

* 📋 Visualização de barricadas pendentes
* ✅ Aprovação de barricadas
* ❌ Rejeição de barricadas
* 🗑️ Remoção de barricadas ativas
* 🔄 Atualização dinâmica dos registros

---

# 🧱 Tecnologias Utilizadas

## Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Uvicorn

## Frontend

* React
* React Router DOM
* Google Maps API
* JavaScript
* CSS

## PWA

* Web App Manifest
* Service Worker

---

# 📂 Estrutura do Projeto

```text
app_barricada/

├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   ├── manifest.json
│   │   ├── service-worker.js
│   │   ├── logo192.png
│   │   └── logo512.png
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   ├── MapPage.js
│   │   │   └── Admin.js
│   │   │
│   │   ├── components/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── serviceWorkerRegistration.js
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Como Executar o Projeto

## 1. Clonar o Repositório

```bash
git clone https://github.com/charlesalves1/app_barricada.git

cd app_barricada
```

---

## 2. Executar o Backend

```bash
cd backend
```

Criar/ativar ambiente virtual:

### Windows

```bash
venv\Scripts\activate
```

Instalar dependências:

```bash
pip install -r requirements.txt
```

Executar servidor:

```bash
uvicorn main:app --reload
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend disponível em:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

## 3. Executar o Frontend

```bash
cd frontend
```

Instalar dependências:

```bash
npm install
```

Executar aplicação:

```bash
npm start
```

Frontend disponível em:

```text
http://localhost:3000
```

---

# 🔗 API

## Barricadas Ativas

```http
GET /reports
```

---

## Barricadas Pendentes

```http
GET /reports/pending
```

---

## Registrar Barricada

```http
POST /report
```

---

## Aprovar Barricada

```http
PUT /reports/{id}/approve
```

---

## Rejeitar Barricada

```http
PUT /reports/{id}/reject
```

---

## Remover Barricada

```http
PUT /reports/{id}/remove
```

---

# 📱 Progressive Web App (PWA)

O projeto pode ser instalado em dispositivos Android e Desktop diretamente pelo navegador.

Recursos disponíveis:

* Instalação como aplicativo
* Ícones personalizados
* Tela standalone
* Service Worker
* Estrutura preparada para cache e futuras funcionalidades offline

---

# 📌 Status do Projeto

## MVP em Desenvolvimento Ativo

### Concluído

* Geolocalização em tempo real
* Cadastro anônimo de barricadas
* Painel administrativo
* Aprovação de registros
* Remoção de barricadas
* Navegação entre telas
* Responsividade inicial
* Estrutura PWA

### Em Desenvolvimento

* Melhorias de responsividade
* Alertas sonoros
* Melhor experiência mobile
* Melhorias visuais do mapa

### Planejado para versões futuras

* Login administrativo
* Controle de permissões
* Confirmação comunitária de barricadas
* Histórico de ocorrências
* Dashboard administrativo
* Notificações push
* Deploy em produção
* Banco de dados em nuvem

---

# 👨‍💻 Autor

Charles Alves

GitHub:
https://github.com/charlesalves1

---

# 📄 Licença

Projeto desenvolvido para fins educacionais e de estudo.
