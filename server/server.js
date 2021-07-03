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

// PG setup
const Pool = pg.Pool;
const config = {
    database: 'weekend-to-do-app',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};

const pool = new Pool(config);

// For testing/debugging
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
    ORDER BY "id" DESC;
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
    INSERT INTO tasks (task)
    VALUES ($1);
    `;
pool.query(taskList, [newTask.task])
        .then(dbResponse => {
            res.sendStatus(201);
        })
        .catch(err => {
            console.log(`Error making query`, err);
            res.sendStatus(500);
        });
});

// DELETE route to delete tasks from database
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


// PUT route to update task status in database
app.put('/weekend-to-do-app/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    
    let updateTask = `UPDATE tasks SET "status"='Complete' WHERE id=$1;`;

    pool.query(updateTask, [taskId])
    .then(dbResponse => {
        console.log('Updated task with PUT', dbResponse);
        res.sendStatus(202);
    })
    .catch(err => {
        console.log('There was an error updating status', error);
        res.sendStatus(500);
    })
});

