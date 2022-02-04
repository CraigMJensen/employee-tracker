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
          'Delete a Department',
          'Delete an Employee',
          'Delete a Role',
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

        case 'Delete a Department':
          deleteDept();
          break;

        case 'Delete an Employee':
          deleteEmp();
          break;

        case 'Delete a Role':
          deleteRole();
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
        console.info('');
        console.info(`Added ${newDept} to Departments!`);
        console.info('');

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
          console.info('Please enter a first name');
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
          console.info('Please enter a last name');
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

                  let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUE (?,?,?,?)`;
                  db.query(sql, newEmp, (err, res) => {
                    if (err) throw err;
                    console.info('');
                    console.info('New Employee added!');
                    console.info('');

                    allEmployees();
                  });
                });
            });
          });
      });
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'addRole',
        message: 'What is the title of the new Role?',
        validate: (confirmAddRole) => {
          if (confirmAddRole) {
            return true;
          }
          console.info('Please enter a role');
          return false;
        },
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the new Role?',
        validate: (confirmSalary) => {
          if (!isNaN(confirmSalary)) {
            return true;
          }
          console.info('Please enter a salary');
          return false;
        },
      },
    ])
    .then((answers) => {
      const newRole = [answers.addRole, answers.salary];

      const roleSql = `SELECT name, id FROM department`;

      db.query(roleSql, (err, res) => {
        if (err) throw err;

        const dept = res.map(({ name, id }) => ({ name: name, value: id }));

        inquirer
          .prompt([
            {
              type: 'list',
              name: 'department',
              message:
                'What department would you like the new Role associated?',
              choices: dept,
            },
          ])
          .then((deptChoice) => {
            const dept = deptChoice.department;

            newRole.push(dept);

            const sql = `INSERT INTO role (title, salary, department_id)
                        VALUES (?,?,?)`;

            db.query(sql, newRole, (err, res) => {
              if (err) throw err;
              console.info('');
              console.info('Added ' + answers.addRole + ' to Roles!');
              console.info('');

              allRoles();
            });
          });
      });
    });
};

const updateRole = () => {
  const empSql = `SELECT * FROM employee`;

  db.query(empSql, (err, res) => {
    if (err) throw err;

    const employees = res.map(({ id, first_name, last_name }) => ({
      name: first_name + ' ' + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'empName',
          message: 'Which Employee would you like to update?',
          choices: employees,
        },
      ])
      .then((answer) => {
        const employee = answer.empName;
        const updatedEmp = [];
        updatedEmp.push(employee);

        const roleSql = `SELECT * FROM role`;

        db.query(roleSql, (err, res) => {
          if (err) throw err;

          const roles = res.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: 'list',
                name: 'role',
                message: 'What is the Employees updated Role?',
                choices: roles,
              },
            ])
            .then((answer) => {
              const newRole = answer.role;
              updatedEmp.push(newRole);

              let employee = updatedEmp[0];
              updatedEmp[0] = newRole;
              updatedEmp[1] = employee;

              const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

              db.query(sql, updatedEmp, (err, res) => {
                if (err) throw err;
                console.info('');
                console.info('Employee has been Updated!');
                console.info('');

                allEmployees();
              });
            });
        });
      });
  });
};

const deleteDept = () => {
  const deptSql = `SELECT * FROM department`;

  db.query(deptSql, (err, res) => {
    if (err) throw err;

    const dept = res.map(({ name, id }) => ({ name: name, value: id }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'confirmDelete',
          message: `** WARNING **\n This action will delete all Roles and Employees in the associated Department.  Are you certain you would like to continue?`,
          choices: ['NO', 'YES'],
        },
      ])
      .then((answer) => {
        if (answer.confirmDelete === 'NO') {
          return promptUser();
        } else {
          inquirer
            .prompt([
              {
                type: 'list',
                name: 'dept',
                message: 'What Department would you like to delete?',
                choices: dept,
              },
            ])
            .then((answer) => {
              const deptDel = answer.dept;
              const sql = `DELETE FROM department
                    WHERE id = ?`;

              db.query(sql, deptDel, (err, res) => {
                if (err) throw err;
                console.info('');
                console.info('Successfully deleted!');
                console.info('');

                allDepartments();
              });
            });
        }
      });
  });
};

const deleteEmp = () => {
  const empSql = `SELECT * FROM employee`;
  const empToDelete = [];

  db.query(empSql, (err, res) => {
    if (err) throw err;

    const employees = res.map(({ first_name, last_name, id }) => ({
      name: first_name + ' ' + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'empList',
          message: 'Which Employee record is to be Delete?',
          choices: employees,
        },
      ])
      .then((answer) => {
        const empDeletion = answer.empList;
        empToDelete.push(empDeletion);
      })
      .then(() => {
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'confirmEmp',
              message: 'Is this the correct Employee file to delete?',
              choices: ['NO', 'YES'],
            },
          ])
          .then((answer) => {
            if (answer.confirmEmp === 'NO') {
              return deleteEmp();
            } else {
              const deleteSql = `DELETE FROM employee
                                WHERE id = ${empToDelete}`;
              db.query(deleteSql, empToDelete, (err, res) => {
                if (err) throw err;
                console.info('');
                console.info(`Employee #${empToDelete} has been Deleted!`);
                console.info('');

                allEmployees();
              });
            }
          });
      });
  });
};

const deleteRole = () => {
  const roleSql = `SELECT * FROM role`;
  const roleToDelete = [];

  db.query(roleSql, (err, res) => {
    if (err) throw err;

    const roles = res.map(({ title, id }) => ({
      name: title,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'roleList',
          message: 'Which Role is to be Delete?',
          choices: roles,
        },
      ])
      .then((answer) => {
        const roleDeletion = answer.roleList;
        roleToDelete.push(roleDeletion);
      })
      .then(() => {
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'confirmRole',
              message: 'Is this the correct Role to delete?',
              choices: ['NO', 'YES'],
            },
          ])
          .then((answer) => {
            if (answer.confirmRole === 'NO') {
              return deleteRole();
            } else {
              const deleteSql = `DELETE FROM role
                                WHERE id = ${roleToDelete}`;
              db.query(deleteSql, roleToDelete, (err, res) => {
                if (err) throw err;
                console.info('');
                console.info(`The Role has been Deleted!`);
                console.info('');

                allRoles();
              });
            }
          });
      });
  });
};

const quit = () => db.end();

module.exports = connected;
