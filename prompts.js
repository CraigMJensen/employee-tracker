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

        case 'Quit':
          quit();
          break;
      }
    });
};

const returnPromptUser = () => {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirmReturn',
        message: 'Return to the Main Menu?',
        default: true,
      },
    ])
    .then((answer) => {
      if (answer.confirmReturn) {
        return promptUser();
      }
      return db.end();
    });
};

const allDepartments = () => {
  let sql = `SELECT department.id AS ID, department.name AS Department FROM department`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    returnPromptUser();
  });
};

const allEmployees = () => {
  let sql = `SELECT employee.id AS ID, concat(employee.first_name, ' ', employee.last_name) AS 'Employee Name', role.title AS Role 
            FROM employee 
            LEFT JOIN role 
            ON (role.id = employee.role_id)`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    returnPromptUser();
  });
};

const allRoles = () => {
  let sql = `SELECT role.id AS ID, role.title AS "Title", role.salary AS Salary 
            FROM role`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    returnPromptUser();
  });
};

const empByDept = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'departments',
        message: 'Which Department would you like to access?',
        choices: ['Engineering', 'Finance', 'Legal', 'Management', 'Sales'],
      },
    ])
    .then((answer) => {
      if (
        answer.departments === 'Engineering' ||
        answer.departments === 'Finance' ||
        answer.departments === 'Legal' ||
        answer.departments === 'Management' ||
        answer.departments === 'Sales'
      ) {
        let department = answer.departments;

        let sql = `SELECT employee.id AS ID, concat(employee.first_name, ' ', employee.last_name) AS 'Employee Name', department.name AS Department, role.title AS Role 
                  FROM employee 
                  LEFT JOIN role 
                  ON (role.id = employee.role_id) 
                  LEFT JOIN department 
                  ON department.id = role.department_id 
                  WHERE department.name = "${department}"`;
        db.query(sql, (err, res) => {
          if (err) throw err;
          console.table(res);
          returnPromptUser();
        });
      }
    });
};

const empByManager = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'departments',
        message: "Which Manager's Team would you like to access?",
        choices: ['Engineering', 'Finance', 'Legal', 'Sales'],
      },
    ])
    .then((answer) => {
      if (
        answer.departments === 'Engineering' ||
        answer.departments === 'Finance' ||
        answer.departments === 'Legal' ||
        answer.departments === 'Sales'
      ) {
        let department = answer.departments;

        let sql = `SELECT concat(m.first_name, ' ', m.last_name) AS Manager, concat(e.first_name, ' ', e.last_name) AS 'Employee Name', e.id AS ID, role.title AS Role, department.name AS Department 
                  FROM employee e
                  LEFT JOIN employee m
                  ON e.manager_id = m.id
                  LEFT JOIN role
                  ON (role.id = e.role_id)
                  LEFT JOIN department 
                  ON department.id = role.department_id
                  WHERE department.name = "${department}"
                  `;
        db.query(sql, (err, res) => {
          if (err) throw err;
          console.table(res);
          returnPromptUser();
        });
      }
    });
};

const addDept = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'addDept',
        message: 'Enter the name of the new Department',
      },
    ])
    .then((answer) => {
      let newDept = answer.addDept;
      let sql = `INSERT INTO department (name)
                VALUES (?)`;
      db.query(sql, newDept, (err, res) => {
        if (err) throw err;
        console.info(`Added ${newDept} to Departments!`);
        allDepartments();
      });
    });
};

const addEmp = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "Enter the new Employee's first name",
        validate: (namePresent) => {
          if (namePresent) {
            return true;
          }
          console.log('Please enter a first name');
          return false;
        },
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Enter the new Employee's last name",
        validate: (namePresent) => {
          if (namePresent) {
            return true;
          }
          console.log('Please enter a last name');
          return false;
        },
      },
    ])
    .then((answers) => {
      const newEmp = [answers.first_name, answers.last_name];

      const getRoleSql = `SELECT id, role.title FROM role`;

      db.query(getRoleSql, (err, data) => {
        if (err) throw err;

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer
          .prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the new Employee's role?",
              choices: roles,
            },
          ])
          .then((answer) => {
            const role = answer.role;
            newEmp.push(role);

            const newManagerSql = `SELECT * FROM employee`;

            db.query(newManagerSql, (err, data) => {
              if (err) throw err;

              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + ' ' + last_name,
                value: id,
              }));
              const managerChoice = managers.slice(0, 4);

              inquirer
                .prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: 'Which Manager will the new Employee be under?',
                    choices: managerChoice,
                  },
                ])
                .then((answer) => {
                  const manager = answer.manager;
                  newEmp.push(manager);
                  console.log(newEmp);

                  let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUE (?,?,?,?)`;
                  db.query(sql, newEmp, (err, res) => {
                    if (err) throw err;
                    console.info('New Employee added!');
                    allEmployees();
                  });
                });
            });
          });
      });
    });
};

const addRole = () => {};

const updateRole = () => {};

const quit = () => db.end();

module.exports = connected;
