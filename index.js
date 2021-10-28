const connection = require("./config/connection");
const inquirer = require("inquirer");
const consTable = require("console.table");
const asciLogo = require("asciiart-logo");
const colors = require("colors");

// INTRO LOGO
connection.connect((err) => {
    if (err) throw err;
    const longText = "By, Cody Ktestakis";

    console.log(
        asciLogo({
            name: "Employee Management System",
            font: "Rectangles",
            lineChars: 3,
            padding: 2,
            margin: 3,
            borderColor: "white",
            logoColor: "yellow",
            textColor: "white",
        })
        .emptyLine()
        .right("version 1.0")
        .emptyLine()
        .center(longText)
        .render()
    );
    promptUser();
});
// PROMPT QUESTION
const promptUser = () => {
  inquirer
    .prompt([
      {
        name: "choices",
        type: "list",
        message: "Please select an option:",
        choices: [
          "View All Employees".blue,
          "View All Roles".blue,
          "View All Departments".blue,
          "View All Employees By Department".blue,
          "View Department Budgets".blue,
          "Update Employee Role".yellow,
          "Update Employee Manager".yellow,
          "Add Employee".green,
          "Add Role".green,
          "Add Department".green,
          "Remove Employee".red,
          "Remove Role".red,
          "Remove Department".red,
          "Exit".rainbow,
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;

      if (choices === "View All Employees".blue) {
        viewAllEmployees();
      }
      if (choices === "View All Roles".blue) {
        viewAllRoles();
      }
      if (choices === "View All Departments".blue) {
        viewAllDepartment();
      }
      if (choices === "View All Employees By Department".blue) {
        viewEmployeeByDepartment();
      }
      if (choices === "View Department Budgets".blue) {
        viewDepartmentBudget();
      }
      if (choices === "Update Employee Role".yellow) {
        updateEmployeeRole();
      }
      if (choices === "Update Employee Manager".yellow) {
        updateEmployeeManager();
      }
      if (choices === "Add Employee".green) {
        addEmployee();
      }
      if (choices === "Add Role".green) {
        addRole();
      }
      if (choices === "Add Department".green) {
        addDepartment();
      }
      if (choices === "Remove Employee".red) {
        removeEmployee();
      }
      if (choices === "Remove Role".red) {
        removeRole();
      }
      if (choices === "Remove Department".red) {
        removeDepartment();
      }
      if (choices === "Exit".rainbow) {
        connection.end();
      }
    });
};

// VIEW ALL EMPLOYEES
const viewAllEmployees = () => {
  let sql = `SELECT * FROM employee`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.log(`======================================================`.blue);
    console.table(response);
    console.log(`======================================================`.blue);

    promptUser();
  });
};

//VIEW ALL ROLES
const viewAllRoles = () => {
  const sql = `SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.log(`======================================================`.blue);
    response.forEach((role) => {
      console.log(role.title);
    });
    console.log(`======================================================`.blue);
    promptUser();
  });
};

//VIEW ALL DEPARTMENTS
const viewAllDepartment = () => {
  let sql = `SELECT department.id AS id, department.name AS department FROM department`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.log(`======================================================`.blue);
    console.table(response);
    console.log(`======================================================`.blue);
    promptUser();
  });
};

// VIEW ALL EMPLOYEES BY DEPARTMENT
const viewEmployeeByDepartment = () => {
  const sql = `SELECT employee.first_name, employee.last_name, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id`;
  connection.query(sql, (err, response) => {
    if (err) throw err;
    console.log(`======================================================`.blue);
    console.table(response);
    console.log(`======================================================`.blue);
    promptUser();
  });
};

//VIEW DEPARTMENT BY BUDGETS
const viewDepartmentBudget = () => {
  const sql = `SELECT department_id AS id, department.name AS department, SUM(salary) AS budget FROM role INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id;`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.log(`======================================================`.blue);
    console.table(response);
    console.log(`======================================================`.blue);
    promptUser();
  });
};

//UPDATE AN EMPLOYEE'S ROLE
const updateEmployeeRole = () => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                  FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
  connection.query(sql, (error, empresponse) => {
    if (error) throw error;
    let employeeNamesArray = [];
    empresponse.forEach((employees) => {
      employeeNamesArray.push(`${employees.first_name} ${employees.last_name}`);
    });

    let sql = `SELECT role.id, role.title FROM role`;
    connection.query(sql, (error, roleresponse) => {
      if (error) throw error;
      let rolesArray = [];
      roleresponse.forEach((role) => {
        rolesArray.push(role.title);
      });

      inquirer
        .prompt([
          {
            name: "chosenEmployee",
            type: "list",
            message: "Which employee has a new role?",
            choices: employeeNamesArray,
          },
          {
            name: "chosenRole",
            type: "list",
            message: "What is their new role?",
            choices: rolesArray,
          },
        ])
        .then((answer) => {
          let newTitleId, employeeId;

          roleresponse.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
            }
          });

          empresponse.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
          connection.query(sqls, [newTitleId, employeeId], (error) => {
            if (error) throw error;
            console.log(`Employee Role Updated`);
            promptUser();
          });
        });
    });
  });
};

//UPDATE AN EMPLOYEE'S MANAGER
const updateEmployeeManager = () => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id FROM employee`;
  connection.query(sql, (error, response) => {
    if (error) throw error; 
    let employeeNamesArray = [];
    response.forEach((employee) => {
      employeeNamesArray.push(`${employee.first_name}${employee.last_name}`);
    });
    inquirer
      .prompt([
        {
          name: "chosenEmployee",
          type: "list",
          message: "Which employee has a new manager?",
          choices: employeeNamesArray,
        },
        {
          name: "newManager",
          type: "list",
          message: "Who is their manager?",
          choices: employeeNamesArray,
        },
      ])
      .then((answer) => {
        let employeeId, managerId;
        response.forEach((employee) => {
          if (
            answer.chosenEmployee ===
            `${employee.first_name}${employee.last_name}`
          ) {
            employeeId = employee.id;
          }
          if (
            answer.newManager === `${employee.first_name}${employee.last_name}`
          ) {
            managerId = employee.id;
          }
        });
        if (answer.chosenEmployee === answer.newManager) {
          console.log(`Invalid Manger Selection`);
        } else {
          let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

          connection.query(sql, [managerId, employeeId], (error) => {
            if (error) throw error;
            console.log(`Employee Manger Updated`);
            promptUser();
          });
        }
      });
  });
};

// ADD A NEW EMPLOYEE
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's First Name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's Last Name?",
      },
    ])
    .then((answer) => {
      const crit = [answer.firstName, answer.lastName];
      const roleSql = `SELECT role.id, role.title FROM role`;
      connection.query(roleSql, (error, data) => {
        if (error) throw error;
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            crit.push(role);
            const managerSql = `SELECT * FROM employee`;
            connection.query(managerSql, (error, data) => {
              if (error) throw error;
              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manger?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  crit.push(manager);
                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                  connection.query(sql, crit, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!");
                    viewAllEmployees();
                  });
                });
            });
          });
      });
    });
};

//ADD A NEW DEPARTMENT
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "What is the name of your new Department?",
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO department (name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        console.log(answer.newDepartment + ` Department Successfully Created!`);
        viewAllDepartment();
      });
    });
};

//ADD A NEW ROLE
const addRole = () => {
  const sql = `SELECT * FROM department`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    let departmentArray = [];
    response.forEach((department) => {
      departmentArray.push(department.name);
    });
    departmentArray.push("Create Department");
    inquirer
      .prompt([
        {
          name: "departmentName",
          type: "list",
          message: "Which department is this new role for?",
          choices: departmentArray,
        },
      ])
      .then((answer) => {
        if (answer.departmentName === "Create Department") {
          this.addDepartment();
        } else {
          addRoleResume(answer);
        }
      });
    const addRoleResume = (departmentData) => {
      inquirer
        .prompt([
          {
            name: "newRole",
            type: "input",
            message: "What is the name of your new Role?",
          },
        ])
        .then((answer) => {
          let createRole = answer.newRole;
          let departmentId;
          response.forEach((department) => {
            if (departmentData.departmentName === department.name) {
              departmentId = department.id;
            }
          });
          let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?,?)`;
          let crit = [createRole, answer.salary, departmentId];

          connection.query(sql, crit, (error) => {
            if (error) throw error;
            console.log(`Role Successfully Created!`);
            viewAllRoles();
          });
        });
    };
  });
};

//DELETE AN EMPLOYEE
const removeEmployee = () => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

  connection.query(sql, (error, response) => {
    if (error) throw error;
    let employeeNamesArray = [];
    response.forEach((employee) => {
      employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);
    });

    inquirer
      .prompt([
        {
          name: "chosenEmployee",
          type: "list",
          message: "Which employee would you like to remove?",
          choices: employeeNamesArray,
        },
      ])
      .then((answer) => {
        let employeeId;

        response.forEach((employee) => {
          if (
            answer.chosenEmployee ===
            `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }
        });

        let sql = `DELETE FROM employee WHERE employee.id = ?`;
        connection.query(sql, [employeeId], (error) => {
          if (error) throw error;
          console.log(`Employee Successfully Removed`);
          viewAllEmployees();
        });
      });
  });
};

//DELETE AN ROLE
const removeRole = () => {
  let sql = `SELECT role.id, role.title FROM role`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    let roleNameArray = [];
    response.forEach((role) => {
      roleNameArray.push(role.title);
    });
    inquirer
      .prompt([
        {
          name: "chosenRole",
          type: "list",
          message: "Which role would you like to remove?",
          choices: roleNameArray,
        },
      ])
      .then((answer) => {
        let roleId;
        response.forEach((role) => {
          if (answer.chosenRole === role.title) {
            roleId = role.id;
          }
        });
        let sql = `DELETE FROM role WHERE role.id = ?`;
        connection.query(sql, [roleId], (error) => {
          if (error) throw error;
          console.log(`Role Successfully Removed`);
          viewAllRoles();
        });
      });
  });
};

//DELETE AN DEPARTMENT
const removeDepartment = () => {
  let sql = `SELECT department.id, department.name FROM department`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    let departmentNamesArray = [];
    response.forEach((department) => {
      departmentNamesArray.push(department.name);
    });
    inquirer
      .prompt([
        {
          name: "chosenDept",
          type: "list",
          message: "Which department would you like to remove?",
          choices: departmentNamesArray,
        },
      ])
      .then((answer) => {
        let departmentId;
        response.forEach((department) => {
          if (answer.chosenDept === department.name) {
            departmentId = department.id;
          }
        });
        let sql = `DELETE FROM department WHERE department.id = ?`;
        connection.query(sql, [departmentId], (error) => {
          if (error) throw error;
          console.log(`Department Successfully Removed`);
          viewAllDepartment();
        });
      });
  });
};