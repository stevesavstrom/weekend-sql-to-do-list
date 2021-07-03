const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));
app.use(express.json());

const PORT = 5000;
app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

const Pool = pg.Pool;
const config = {
    database: 'weekend-to-do-app',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};

const pool = new Pool(config);

pool.on('connect', () => {
    console.log('Postgresql connected');
});

pool.on('error', () => {
    console.log('Error with PostgreSQL pool', error);
});

// GET route to send back all tasks in database
app.get('/tasks', (req, res) => {
    let taskList = `
    SELECT * FROM "tasks"
    ORDER BY "title" ASC;
    `;
    pool.query(taskList)
        .then((result) => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log('Error trying to get tasks from PostgreSQL', error);
            res.sendStatus(500);
        })
    console.log(`In /tasks GET`);
});

// POST route to add a task to database
app.post('/tasks', (req, res) => {
    const newTask = req.body;
    const taskList = `
    INSERT INTO tasks (task, status)
    VALUES ($1, $2);
    `;
pool.query(taskList, [newTask.task, newTask.status])
        .then(dbResponse => {
            res.sendStatus(201);
        })
        .catch(err => {
            console.log(`Error making query`, err);
            res.sendStatus(500);
        });
});

// DELETE route to delete tasks
app.delete('/weekend-to-do-app/tasks/:id', (req, res) => {
    console.log('Request URL: ', req.url);
    console.log('Request route parameters: ', req.params);
    const taskId = req.params.id;
    console.log(`Task id is working`);
  
    const deleteTask = `
      DELETE FROM "tasks" WHERE id = $1;
    `;
  
    pool.query(deleteTask, [taskId])
      .then(dbResponse => {
        console.log(`Delete task is working`);
        res.sendStatus(200);
      })
      .catch(error => {
        console.log(`Could not delete task`, error);
        res.sendStatus(500);
      });
  });
