-- roles
INSERT INTO roles (name) VALUES ('user'), ('admin');

-- statuses
INSERT INTO statuses (name) VALUES ('Pending'), ('In Progress'), ('Resolved'), ('Rejected');

-- categories
INSERT INTO categories (name) VALUES ('Roads'), ('Garbage'), ('Water'), ('Electricity');

-- insert into complaint_search
INSERT INTO complaint_search(rowid, title, description)
SELECT id, title, description FROM complaints;
