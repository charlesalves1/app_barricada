# 🧭 App Barricada

Sistema de mapeamento colaborativo de barricadas, permitindo que usuários registrem e visualizem ocorrências de forma simples e anônima através de um mapa interativo.

---

## 🚀 Funcionalidades

* 📍 Visualização de mapa interativo
* ➕ Registro de barricadas com um clique
* 🗺️ Exibição de pontos no mapa em tempo real
* 💬 Popup com informações básicas
* 🔄 Atualização dinâmica dos dados

---

## 🧱 Tecnologias utilizadas

### 🔹 Backend

* Python
* FastAPI
* Uvicorn

### 🔹 Frontend

* JavaScript
* React
* Leaflet
* OpenStreetMap

---

## 📂 Estrutura do projeto

```
app_barricada/
│
├── backend/
│   ├── main.py
│   └── venv/
│
├── frontend/
│   ├── src/
│   └── package.json
│
└── .gitignore
```

---

## ⚙️ Como rodar o projeto

### 🔹 1. Clonar o repositório

```bash
git clone https://github.com/charlesalves1/app_barricada.git
cd app_barricada
```

---

## 🔹 2. Rodar o BACKEND

Abra um terminal:

```bash
cd backend
```

Ativar ambiente virtual:

```bash
source venv/Scripts/activate
```

Instalar dependências (se necessário):

```bash
pip install fastapi uvicorn
```

Rodar servidor:

```bash
uvicorn main:app --reload
```

👉 Backend rodando em:

```
http://127.0.0.1:8000
```

---

## 🔹 3. Rodar o FRONTEND

Abra outro terminal:

```bash
cd frontend
```

Instalar dependências:

```bash
npm install
```

Rodar aplicação:

```bash
npm start
```

👉 Frontend rodando em:

```
http://localhost:3000
```

---

## 🔗 Endpoints da API

* `GET /reports` → Lista todas as barricadas
* `POST /report` → Cria um novo registro

---

## 📌 Status do projeto

✅ MVP funcional concluído
🔄 Em evolução

---

## 🔮 Próximas melhorias

* ⏱️ Tempo de criação das ocorrências
* 👍 Sistema de confirmação de barricadas
* 📱 Versão mobile
* ☁️ Deploy em produção
* 🗄️ Banco de dados (persistência)

---

## 💡 Sobre o projeto

Este projeto foi desenvolvido como prática de desenvolvimento fullstack, integrando backend em Python com frontend em React e manipulação de dados geográficos em tempo real.

---

## 👨‍💻 Autor

Charles Alves
GitHub: https://github.com/charlesalves1
