var mysql = require("mysql");
var inquirer = require("inquirer");
var addfxns = require("./additionalfunctions.js")
var landing = require("./landing.js");
var mangagerFile = require('./manager.js')
var supervisorFile = require('./supervisor.js');

exports.directory = [
    {
        managerOrSupervisor: function(){
            managerOrSupervisor();
        }
    }
];

var managerOrSupervisor = (initialized)=>{
    var guesses = 0;
    var question1 = [
        {
            type: "list",
            message: "Are you a manager or supervisor?",
            choices: ["Manager", "Supervisor"],
            name: "selection"
        }
    ];
    inquirer.prompt(question1).then((answer1) => {
        validation(answer1.selection, initialized);
    })
}

var validation = (answer1, initialized) => {
    var password = "a"
    var guessesRemaining = 3;
    var question = [
        {
            type: "input",
            message: "Please enter your password (hint: it's a): ",
            validate: function(input){
                if (input != password) {
                    guessesRemaining--
                    if (guessesRemaining === 0){
                        return true;
                    }
                    console.log("\nThat is not the correct password. You have " + guessesRemaining + " guesses left")
                    return false;
                } else {
                    return true;
                }
            },
            name: "selection"
        }
    ]
    inquirer.prompt(question).then((answer2) => {
        if (guessesRemaining === 0){
            console.log("\nYou are out of guesses");
            return
        }
        if (answer1 === "Manager"){
            if (initialized){
                mangagerFile.directory[0].managerOptions();
            } else {
                mangagerFile.directory[0].connector();
            }
        } else{
            if (initialized){
                supervisorFile.directory[0].managerOptions();
            } else {
                supervisorFile.directory[0].connector();
            }
        }
    })
}

var supervisorFunction = () => {
    console.log("supervisor function");
}