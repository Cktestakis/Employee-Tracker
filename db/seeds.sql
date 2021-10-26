USE employeeTrackerDB
INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO role (title, salary, deparment_id)
VALUES ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, deparment_id)
VALUES ("Salesperson", 80000, 1);
INSERT INTO role (title, salary, deparment_id)
VALUES ("Lead Engineer", 150000, 1);
INSERT INTO role (title, salary, deparment_id)
VALUES ("Sfotwaree Engineer", 120000, 1);
INSERT INTO role (title, salary, deparment_id)
VALUES ("Account Manager", 160000, 1);
INSERT INTO role (title, salary, deparment_id)
VALUES ("Accountant", 125000, 1);
INSERT INTO role (title, salary, deparment_id)
VALUES ("Legal Team Lead", 250000, 1);
INSERT INTO role (title, salary, deparment_id)
VALUES ("Lawyer", 190000, 1);

INSERT INTO employee (first_name, last_name, rolde_id, manager_id)
VALUES ("John", "Doe", 1, null);
INSERT INTO employee (first_name, last_name, rolde_id, manager_id)
VALUES ("Mike", "Chan", 2, 1);
INSERT INTO employee (first_name, last_name, rolde_id, manager_id)
VALUES ("Alfred", "Johnson", 3, null);
INSERT INTO employee (first_name, last_name, rolde_id, manager_id)
VALUES ("Scotty", "Martinez", 4, 3);
INSERT INTO employee (first_name, last_name, rolde_id, manager_id)
VALUES ("Dwayne", "Johnson", 6, null);
INSERT INTO employee (first_name, last_name, rolde_id, manager_id)
VALUES ("Kevin", "Hart", 6, 5);
INSERT INTO employee (first_name, last_name, rolde_id, manager_id)
VALUES ("Jimmy", "Lopez", 7, null);
INSERT INTO employee (first_name, last_name, rolde_id, manager_id)
VALUES ("Sione", "Malaga", 8, 7);