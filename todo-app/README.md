# Todo App — Flask + React + Docker + Jenkins

## Project Structure

```
todo-app/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   └── App.js        ← paste App.jsx content here
│   ├── package.json      ← created by create-react-app
│   └── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

---

## Run Locally (without Docker)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## Run with Docker

```bash
docker-compose up --build
```

- Frontend → http://localhost:3000
- Backend  → http://localhost:5000

---

## Jenkins Setup

1. Install Jenkins on your server
2. Install plugins: **Git**, **Docker**, **Pipeline**
3. Create a new **Pipeline** job
4. Under *Pipeline*, select **Pipeline script from SCM**
5. Set SCM to **Git** and enter your GitHub repo URL
6. Set script path to `Jenkinsfile`
7. Under your GitHub repo → Settings → Webhooks, add:
   ```
   http://YOUR_JENKINS_IP:8080/github-webhook/
   ```
8. Now every `git push` triggers the pipeline automatically

---

## How the Pipeline Works

```
Git Push → GitHub Webhook → Jenkins
                                ↓
                         1. Checkout code
                         2. Build backend Docker image
                         3. Build frontend Docker image
                         4. Run tests
                         5. Deploy with docker-compose
```
