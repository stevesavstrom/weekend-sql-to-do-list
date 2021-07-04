-- Create a SQL database called `weekend-to-do-app`
-- I used Postico as as a PostgreSQL client for Mac
-- Create a table called `tasks` using the command below.

CREATE TABLE tasks (
    "id" serial PRIMARY KEY,
    "task" varchar(300),
    "status" varchar(50) DEFAULT 'Incomplete'
);