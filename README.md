# Habit Tracker

Fullstack веб-додаток для відстеження щоденних звичок.  
Побудований як частина портфоліо для демонстрації навичок fullstack розробки.

---

## Про проект

Habit Tracker дозволяє користувачам створювати звички і відмічати їх виконання щодня.  
Графік виконання відображається у вигляді таблиці днів — схожо на GitHub contributions.

Проект демонструє вміння працювати з повним циклом розробки:  
від проектування бази даних і REST API до побудови React інтерфейсу.

---

## Функціонал

- Реєстрація та авторизація (JWT)
- Додавання та видалення звичок
- Відмітка виконання по днях
- Графік виконання за останні 30 днів
- Захищені роути — дані доступні тільки авторизованому користувачу

---

## Стек технологій

**Backend**

- Node.js
- Express
- PostgreSQL
- JWT (jsonwebtoken)
- bcryptjs

**Frontend**

- React
- Vite
- React Router DOM
- Axios
- Context API

---

## Структура проекту

```
habit-tracker/
├── backend/      — REST API сервер
└── frontend/     — React клієнт
```

---

## Запуск локально

### Вимоги

- Node.js v18+
- PostgreSQL

### 1. Клонувати репозиторій

```bash
git clone https://github.com/ViktorPro1/habit-tracker.git
cd habit-tracker
```

### 2. Налаштувати backend

```bash
cd backend
npm install
```

Створи файл `.env`:

```
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=habit_tracker_db
DB_USER=postgres
DB_PASSWORD=твій_пароль
JWT_SECRET=твій_секретний_ключ
```

Створи базу даних і таблиці — SQL схема в файлі `backend/README.md`.

Запусти сервер:

```bash
npm run dev
```

### 3. Налаштувати frontend

```bash
cd frontend
npm install
```

Створи файл `.env`:

```
VITE_API_URL=http://localhost:5001/api
```

Запусти:

```bash
npm run dev
```

Відкрий `http://localhost:5173`

---

## База даних

### Таблиця `users`

| Поле       | Тип                 | Опис                     |
| ---------- | ------------------- | ------------------------ |
| id         | SERIAL PRIMARY KEY  | Унікальний ідентифікатор |
| name       | VARCHAR(100)        | Ім'я користувача         |
| email      | VARCHAR(100) UNIQUE | Email                    |
| password   | VARCHAR(255)        | Хешований пароль         |
| created_at | TIMESTAMP           | Дата реєстрації          |

### Таблиця `habits`

| Поле        | Тип                | Опис                     |
| ----------- | ------------------ | ------------------------ |
| id          | SERIAL PRIMARY KEY | Унікальний ідентифікатор |
| user_id     | INTEGER            | Зовнішній ключ на users  |
| name        | VARCHAR(255)       | Назва звички             |
| description | TEXT               | Опис звички              |
| created_at  | TIMESTAMP          | Дата створення           |

### Таблиця `habit_logs`

| Поле      | Тип                | Опис                     |
| --------- | ------------------ | ------------------------ |
| id        | SERIAL PRIMARY KEY | Унікальний ідентифікатор |
| habit_id  | INTEGER            | Зовнішній ключ на habits |
| user_id   | INTEGER            | Зовнішній ключ на users  |
| date      | DATE               | Дата виконання           |
| completed | BOOLEAN            | Виконано чи ні           |

---

## API ендпоінти

### Auth

| Метод | URL                | Опис       |
| ----- | ------------------ | ---------- |
| POST  | /api/auth/register | Реєстрація |
| POST  | /api/auth/login    | Логін      |

### Habits

| Метод  | URL                    | Опис                |
| ------ | ---------------------- | ------------------- |
| GET    | /api/habits            | Отримати всі звички |
| POST   | /api/habits            | Створити звичку     |
| DELETE | /api/habits/:id        | Видалити звичку     |
| POST   | /api/habits/:id/toggle | Відмітити виконання |
| GET    | /api/habits/:id/logs   | Логи за 30 днів     |
| GET    | /api/habits/:id/stats  | Статистика          |

---

## Автор

**Viktor** — self-taught fullstack розробник.  
Активно будую портфоліо і шукаю першу комерційну практику або Junior позицію.  
Стек: React, Node.js, Express, PostgreSQL, Docker, Git.

GitHub: [github.com/ViktorPro1](https://github.com/ViktorPro1)
