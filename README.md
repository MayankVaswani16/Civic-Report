# Civic Report  

A civic reporting application with a React frontend and Flask backend.

## Quick Deploy

### Backend Deployment

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies with uv:**

    ```bash
    pip install uv
    ```

   ```bash
   uv sync
   ```

3. **Run the Flask application:**
   ```bash
   uv run python run.py
   ```

The backend will be available at `http://localhost:5000`

### Frontend Deployment

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies with npm:**
   ```bash
   npm install
   ```

3. **Build for production:**
   ```bash
   npm run dev
   ```


The frontend will be available at `http://localhost:5173`

## Development

### Backend Development

```bash
cd backend
uv sync
uv run python run.py
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Requirements

- **Backend:** Python 3.13+, uv package manager
- **Frontend:** Node.js, npm

## Project Structure

- `backend/` - Flask API server
- `frontend/` - React TypeScript application 
