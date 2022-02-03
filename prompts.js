const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

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
          'View all Departments',
          'View all Employees',
          'View all Roles',
          'View Employees by Department',
          'View Employees by Manager',
          'Add a Department',
          'Add an Employee',
          'Add a Role',
          'Update an Employee Role',
          'Update Employee Manager',
          'Quit',
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;

      switch (answers.choices) {
        case 'View all Departments':
          allDepartments();
          break;

        case 'View all Employees':
          allEmployees();
          break;

        case 'View all Roles':
          allRoles();
          break;

        case 'View Employees by Department':
          empByDept();
          break;

        case 'View Employees by Manager':
          empByManager();
          break;

        case 'Add a Department':
          addDept();
          break;

        case 'Add an Employee':
          addEmp();
          break;

        case 'Add a Role':
          addRole();
          break;

        case 'Update an Employee Role':
          updateRole();
          break;

        case 'Update Employee Manager':
          updateManager();
          break;

        case 'Quit':
          quit();
          break;
      }
    });
};

const allDepartments = () => {
  let sql = `SELECT department.id AS "ID", department.name AS "Department" FROM department`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};

const allEmployees = () => {
  let sql = `SELECT employee.id AS "ID", first_name AS "First Name", last_name AS "Last Name" FROM employee`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};

const allRoles = () => {
  let sql = `SELECT role.id AS "ID", role.title AS "Title", role.salary AS "Salary" FROM role`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};

const empByDept = () => {
  let sql = `SELECT department.name AS "Department", role.title AS "Role", employee.id AS "ID", first_name AS "First Name", last_name AS "Last Name" FROM employee LEFT JOIN role ON (role.id = employee.role_id) LEFT JOIN department ON department.id = role.department_id`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};

const empByManager = () => {
  let sql;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};

const addDept = () => {};

const addEmp = () => {};

const addRole = () => {};

const updateRole = () => {};

const updateManager = () => {};

const quit = () => db.end();

module.exports = connected;
