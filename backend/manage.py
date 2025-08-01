#!/usr/bin/env python3
"""
Management script for the Civic Report application.
Provides commands for administrative tasks like creating superusers.
"""

import os
import sys
import getpass
import click
from werkzeug.security import generate_password_hash
from app import create_app
from app.db import get_db
from app.db.queries.users import get_user_by_email, create_user

@click.group()
def cli():
    """Civic Report Management Commands"""
    pass

@cli.command()
@click.option('--name', prompt='Superuser name', help='Name of the superuser')
@click.option('--email', prompt='Superuser email', help='Email of the superuser')
@click.option('--password', prompt=True, hide_input=True, confirmation_prompt=True, help='Password for the superuser')
def createsuperuser(name, email, password):
    """Create a new superuser (admin) account."""
    app = create_app()
    
    with app.app_context():
        # Check if user already exists
        existing_user = get_user_by_email(email)
        if existing_user:
            click.echo(f"Error: User with email '{email}' already exists.")
            sys.exit(1)
        
        # Hash the password
        password_hash = generate_password_hash(password)
        
        try:
            # Create the superuser with admin role
            create_user(name=name, email=email, password_hash=password_hash, role='admin')
            click.echo(f"Superuser '{name}' ({email}) created successfully!")
        except Exception as e:
            click.echo(f"Error creating superuser: {e}")
            sys.exit(1)

@cli.command()
def list_users():
    """List all users in the system."""
    app = create_app()
    
    with app.app_context():
        db = get_db()
        users = db.execute("""
            SELECT users.id, users.name, users.email, roles.name as role
            FROM users 
            JOIN roles ON users.role_id = roles.id
            ORDER BY users.id
        """).fetchall()
        
        if not users:
            click.echo("No users found.")
            return
        
        click.echo("Users in the system:")
        click.echo("-" * 60)
        for user in users:
            click.echo(f"ID: {user['id']}, Name: {user['name']}, Email: {user['email']}, Role: {user['role']}")

@cli.command()
@click.option('--email', prompt='User email', help='Email of the user to promote')
def promote_to_admin(email):
    """Promote an existing user to admin role."""
    app = create_app()
    
    with app.app_context():
        # Check if user exists
        user = get_user_by_email(email)
        if not user:
            click.echo(f"Error: User with email '{email}' not found.")
            sys.exit(1)
        
        # Check if user is already admin
        db = get_db()
        current_role = db.execute("""
            SELECT roles.name 
            FROM users 
            JOIN roles ON users.role_id = roles.id 
            WHERE users.id = ?
        """, (user['id'],)).fetchone()
        
        if current_role and current_role['name'] == 'admin':
            click.echo(f"User '{email}' is already an admin.")
            return
        
        try:
            # Update user role to admin
            db.execute("""
                UPDATE users 
                SET role_id = (SELECT id FROM roles WHERE name = 'admin' LIMIT 1)
                WHERE id = ?
            """, (user['id'],))
            db.commit()
            click.echo(f"User '{email}' promoted to admin successfully!")
        except Exception as e:
            click.echo(f"Error promoting user: {e}")
            sys.exit(1)

if __name__ == '__main__':
    cli() 