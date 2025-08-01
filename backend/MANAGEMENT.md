# Management Commands

This document describes the available management commands for the Civic Report application.

## Prerequisites

Make sure you have the required dependencies installed:

```bash
uv sync
```

## Available Commands

### Create Superuser

Create a new admin user account:

```bash
python manage.py createsuperuser
```

This will prompt you for:
- Name of the superuser
- Email address
- Password (with confirmation)

Example:
```bash
$ python manage.py createsuperuser
Superuser name: Admin User
Superuser email: admin@example.com
Password: 
Repeat for confirmation: 
Superuser 'Admin User' (admin@example.com) created successfully!
```

### List Users

View all users in the system:

```bash
python manage.py list-users
```

This will display all users with their ID, name, email, and role.

### Promote User to Admin

Promote an existing user to admin role:

```bash
python manage.py promote-to-admin --email user@example.com
```

This will change the user's role from 'user' to 'admin'.

## Command Help

To see all available commands:

```bash
python manage.py --help
```

To see help for a specific command:

```bash
python manage.py createsuperuser --help
python manage.py list-users --help
python manage.py promote-to-admin --help
```

## Notes

- All commands require the database to be initialized (run `python seed_database.py` first if needed)
- The management script uses the same database connection as the main application
- Passwords are automatically hashed using Werkzeug's security functions
- Email addresses must be unique in the system 