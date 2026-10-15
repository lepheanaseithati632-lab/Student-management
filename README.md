# Student Management System (React + Node.js + MySQL)

## Requirements
- Node.js LTS and npm
- MySQL Server and MySQL Workbench
- VS Code (recommended)

## 1. Create the SQL database
Open MySQL Workbench, connect to your local server, open a SQL tab, and run the contents of `database.sql`. If you run the sample INSERT section more than once, sample rows will be duplicated; remove those INSERT statements if you don't want sample rows.

## 2. Install packages
Open a terminal in this project folder and run:

```bash
npm install
```

## 3. Configure the database password
Copy `.env.example` to a new file named `.env` in the project root. Change `DB_PASSWORD` to the password for your MySQL user. Do not upload `.env` to GitHub.

## 4. Start the backend
In terminal 1:

```bash
npm run server
```

Expected output: `Connected to MySQL successfully.` and `API running at http://localhost:5000`.

Test `http://localhost:5000/api/health` in your browser.

## 5. Start React
In terminal 2, in the project folder:

```bash
npm start
```

Open `http://localhost:3000`.

## SQL API routes
- `GET /api/students` — list students
- `POST /api/students` — add student
- `PUT /api/students/:id` — edit student
- `DELETE /api/students/:id` — delete student
- `GET /api/health` — check SQL connection

## Deployment
The frontend and backend need hosted URLs, and the backend needs access to a hosted MySQL database for an online deployment. Set `REACT_APP_API_URL` to the hosted backend's `/api/students` URL before building the frontend. Configure database settings in the backend host's private environment variables. Never commit `.env` or publish database credentials.
