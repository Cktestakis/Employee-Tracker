const { connect } = require("http2");
const mysql = require("mysql");
const inquirer =("inquirer");
require("console.table");
require("dotenv").config();

//Connecting to database
var connection = mysql.createConnection(
    {
        host: "localhost",
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    console.log("Connected to the employee_trackerDB database.\n")
);

//Run the start function after the connection is made to prompt the user
connection.connect(function(err) {
    if (err) throw err;
    firstPrompt();
});

//Function to prompt the user for an action to view/manipulate the database
function firstPrompt() {
    inquirer
        .prompt({
            type: "list",
            name: "task",
            message: "Would you like to do?",
            choices: [
                "View All Employees",
                "Add Employee",
                "Updated Employee Role",
                "View All Departments",
                "Add Department",
                "End",
            ],
        })
        .then(function ({ task }) {
            switch (task) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updatedEmployeeRole();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Role":
                    andRole();
                    break;
                case "View All Departments":
                    vewAllDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "End":
                    connection.end();
                    break;
            }
        });
}

//View All Employees Function
function viewEmployees() {
    console.log("Viewing all employees\n");

    //Query to display a table with employee id, first and last name, title, department, salary, and manager
    var query = 
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(e.first_name, ' ' ,e.last_name) AS manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id";

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Employees viewed!\n");

        firstPrompt();
    });
}

//Add an Employee Section
//Creating role array
var roleArr = [];
function selectRole() {
    //Query to display role table
    var query = "SELECT * FROM role";

    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }
    });
    return roleArr;
}

//Creating managers array
var managersArr = [];
function selectManager() {
    //Query to display managers
    var query = 
        "SELECT first_name, last_name FROM employee WHERE manager_id is NULL";

    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name);
        }
    });
    return managersArr;
}

//Function to add an employee
function addEmployee() {
    //prompts to collect data for employee
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "Enter their first name ",
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter their last name ",
            },
            {
                name: "role",
                type: "list",
                message: "What is their role? ",
                choices: selectRole(),
            },
            {
                name: "manager",
                type: "rawlist",
                message: "Whats their managers name?",
                choices: selectManager(),
            }
        ])
        //Inserting data from answers in to the database
        .then(function(val) {
            var roleId = selectRole().indexOf(val.choice) + 1;

            
        })
}