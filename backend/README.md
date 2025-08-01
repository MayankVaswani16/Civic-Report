# Backend - Civic Report API

Flask-based REST API for the Civic Report application.

## Quick Deploy

### Option 1: Docker Compose (Recommended)

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

#### Docker Installation Guide


**Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

#### Deployment Steps with Docker

1. **Build and start the application:**
   ```bash
   docker-compose up --build
   ```

2. **Run in background (detached mode):**
   ```bash
   docker-compose up -d --build
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

5. **Seed the database (first time only):**
   ```bash
   docker-compose exec backend python seed_database.py
   ```

The API will be available at `http://localhost:5000`

### Option 2: Local Development

#### Prerequisites

- Python 3.13 or higher
- [uv](https://docs.astral.sh/uv/) package manager

#### Deployment Steps

1. **Install dependencies:**
   ```bash
   uv sync
   ```

2. **Run the application:**
   ```bash
   uv run python run.py
   ```

The API will be available at `http://localhost:5000`

## Development

### Install Dependencies

```bash
uv sync
```

#### Run Development Server

```bash
uv run python run.py
```

### Database Setup

The application uses SQLite by default. The database file will be created automatically at `instance/complaints.db`.

To seed the database with initial data:


**With Local Environment:**
```bash
uv run python seed_database.py
```



## API Endpoints

- `GET /api/complaints` - List all complaints
- `POST /api/complaints` - Create a new complaint
- `GET /api/complaints/<id>` - Get complaint details
- `PUT /api/complaints/<id>` - Update complaint
- `DELETE /api/complaints/<id>` - Delete complaint

## Configuration

The application configuration is in `app/config.py`. Default settings use SQLite database and development mode.



