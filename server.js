const inquirer = require('inquirer');

const cTable = require('console.table');

const db = require('./db/connection');

const PORT = process.env.PORT || 3001;

db.connect((err) => {
  if (err) throw err;
  console.info('Database connected.');
  connected();
});

connected = () => {
  console.info('\n+------------------------------+');
  console.info('|                              |');
  console.info('|       EMPLOYEE MANAGER       |');
  console.info('|                              |');
  console.info('+------------------------------+\n');
  promptUser();
};

const promptUser = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choices',
        message: 'What would you like to do?',
        choices: [
          'Add an Employee',
          'Add a Department',
          'Add a Role',
          'View all Employees',
          'View all Roles',
          'View all Departments',
          'View Employees by Role',
          'View Employees by Department',
          'View Employees by Manager',
          'Update an Employee Role',
          "Update an Employee's Department",
          "Update an Employee's Manager",
          'Delete an Employee',
          'Delete a Role',
          'Delete a Department',
          'Delete a Manager',
          'Quit',
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;
    });
};
