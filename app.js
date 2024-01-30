const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '$Rainbow206$',
    database: 'company_database'
});

db.connect((err) => {
    if (err) throw err;
    console.log(`Connected to database.`);
    startApp();
});

function startApp() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Please select from the following menu.',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Exit',
                ],
            },
        ])
        .then((answer) => {
            switch (answer.action) {
                case 'View all departments':
                    viewDepartments();
                    break;

                case 'View all roles':
                    viewRoles();
                    break;

                case 'View all employees':
                    viewEmployees();
                    break;

                case 'Add a department':
                    addDepartment();
                    break;

                case 'Add a role':
                    addRole();
                    break;

                case 'Add an employee':
                    addEmployee();
                    break;

                case 'Update an employee role':
                    updateEmployeeRole();
                    break;

                case 'Exit':
                    db.end();
                    console.log('Goodbye.');
                    break;
            }
        });
}

function viewDepartments() {
    const query = 'SELECT * FROM Departments';
    db.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

function viewRoles() {
    const query = 'SELECT * FROM Roles';
    db.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

function viewEmployees() {
    const query = 'SELECT * FROM Employees';
    db.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Enter the name of the department.',
            },
        ])
        .then((answer) => {
            const query = 'INSERT INTO Departments (department_name) VALUES (?)';
            db.query(query, [answer.departmentName], (err) => {
                if (err) throw err;
                console.log('Department successfully added.');
                startApp();
            });
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'Enter the title of the role.',
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'Enter the salary for the role.',
            },
            {
                type: 'input',
                name: 'departmentId',
                message: 'Enter the department ID for the role.',
            },
        ])
        .then((answer) => {
            const query = 'INSERT INTO Roles (title, salary, department_id) VALUES (?, ?, ?)';
            db.query(query, [answer.roleTitle, answer.roleSalary, answer.departmentId], (err) => {
                if (err) throw err;
                console.log('Role successfully added.');
                startApp();
            });
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeFirstName',
                message: 'Enter the first name of the employee.',
            },
            {
                type: 'input',
                name: 'employeeLastName',
                message: 'Enter the last name of the employee.',
            },
            {
                type: 'input',
                name: 'roleId',
                message: 'Enter the role ID for the employee.',
            },
            {
                type: 'input',
                name: 'managerId',
                message: 'Enter the manager ID for the employee.',
            },
        ])
        .then((answer) => {
            const query = 'INSERT INTO Employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            db.query(query, [answer.employeeFirstName, answer.employeeLastName, answer.roleId, answer.managerId], (err) => {
                if (err) throw err;
                console.log('Employee successfully added.');
                startApp();
            });
        });
}

function updateEmployeeRole() {
    const employeeListQuery = 'SELECT employee_id, CONCAT(first_name, " ", last_name) AS employee_name FROM Employees';
    db.query(employeeListQuery, (err, employees) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select the employee to update:',
                    choices: employees.map(employee => ({
                        name: employee.employee_name,
                        value: employee.employee_id
                    })),
                },
                {
                    type: 'input',
                    name: 'newRoleId',
                    message: 'Enter the new role ID for the employee:',
                },
            ])
            .then((answer) => {
                const updateQuery = 'UPDATE Employees SET role_id = ? WHERE employee_id = ?';
                db.query(updateQuery, [answer.newRoleId, answer.employeeId], (err) => {
                    if (err) throw err;
                    console.log('Employee role successfully updated.');
                    startApp();
                });
            });
    });
}