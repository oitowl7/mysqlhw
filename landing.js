var inquirer = require("inquirer");
var employeePortal = require("./employeeportal.js");
var customerFile = require("./customer.js");
var managerFile = require("./manager.js");
var mysql = require("mysql");
var supervisorFile = require('./supervisor.js');
//this varible is used to direct the user to the correct file where the initial connection happened so that it can quit. This would probably be avoided if all the functions were in one single file
var initializeLocation;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})

//exports is used for all the other files to come back to the opening page if selected
exports.directory = [
    {
        start: function(initialized){
            start(initialized);
        }
    }
]
//function to direct the user to either the shoppers page or the employee portal page
var start = (initialized) => {
    var question = [
        {
            type: "list",
            choices: ["Buy Something", "Employee Portal", "Quit"],
            message: "What would you like to do?",
            name: "selection"
        }
    ];
    inquirer.prompt(question).then(function(answer){
        if (answer.selection === "Buy Something"){
            if (!initialized){
                customerFile.directory[0].connector();
            } else {
                customerFile.directory[0].getInitialInformation();
            }
            return
        } else if (answer.selection === "Employee Portal") {
            employeePortal.directory[0].managerOrSupervisor(initialized);
            return
        } else {
            //confusing way of doing this...certainly there must be a better way. Basically, if the connection hasn't been initialized...it just quits. Otherwise...it runs the 
            if (!initialized){
                return
            } else if(initialized === "customer") {
                customerFile.directory[0].quit();
            } else if (initialized === "manager") {
                managerFile.directory[0].quit();
            } else {
                supervisorFile.directory[0].quit();
            }
        }
    })
}

start();