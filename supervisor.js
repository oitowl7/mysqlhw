var inquirer = require("inquirer");
var employeePortal = require("./employeeportal.js");
var customerFile = require("./customer.js");
var managerFile = require("./manager.js");
var mysql = require("mysql");
var supervisorFile = require('./supervisor.js');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})


exports.directory = [
    {
        connector: function(){
            connection.connect((err)=>{
                if (err) throw err;
                supervisorOptions();
            })
        },
        supervisorOptions: function(){
            supervisorOptions();
        }, quit: function(){
            connection.end();
            return;
        }
    }
]

var connector = () => {
    connection.connect((err)=>{
        if (err) throw err;
        managerOptions();
    })
}

var supervisorOptions = () => {
    console.log("this ran");
}