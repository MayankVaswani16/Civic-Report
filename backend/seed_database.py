
import sqlite3
import os
from pathlib import Path


def seed_database():
    """Execute the seed.sql file against the SQLite database."""
    
    # Define paths
    script_dir = Path(__file__).parent
    seed_file = script_dir / "app" / "db" / "seed.sql"
    db_file = script_dir / "instance" / "complaints.db"
    
    # Check if files exist
    if not seed_file.exists():
        print(f"Error: Seed file not found at {seed_file}")
        return False
    
    if not db_file.exists():
        print(f"Error: Database file not found at {db_file}")
        return False
    
    try:
        # Read the seed.sql file, excluding the last line (PowerShell command)
        with open(seed_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Remove the last line which contains the PowerShell command
        sql_content = ''.join(lines[:-1])
        
        # Connect to the database
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        # Execute the SQL commands
        cursor.executescript(sql_content)
        
        # Commit the changes
        conn.commit()
        
        print("Database seeded successfully!")
        
        # Close the connection
        conn.close()
        
        return True
        
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False


if __name__ == "__main__":
    success = seed_database()
    if not success:
        exit(1) 