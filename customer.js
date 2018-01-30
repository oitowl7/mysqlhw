var mysql = require("mysql");
var inquirer = require("inquirer");
var addfxns = require("./additionalfunctions.js")
var landing = require("./landing.js");
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
            connector();
        },
        getInitialInformation: function(){
            getInitialInformation();
        }, quit: function(){
            connection.end();
            return;
        }
    }
]

var connector = () => {
    connection.connect((err)=>{
        if (err) throw err;
        getInitialInformation();
    })
}

var getInitialInformation = () => {
    connection.query("SELECT product_name, id FROM products", function(err, res){
        if (err) throw err;
        console.log("\n**********************")
        var questionData = [];
        for (var i = 0; i < res.length; i++){
            questionData[i] = res[i].id + ". " + res[i].product_name;
        }
        questionData.push("Return to Start");
        questionData.push("Quit");
        var question = [
            {
                type: "list",
                message: "What would you like to look at today?",
                choices: questionData,
                name: "selection"
            }
        ]
        inquirer.prompt(question).then((answer) => {
            if (answer.selection === "Return to Start") {
                landing.directory[0].start("customer");
            } else if (answer.selection === "Quit") {
                connection.end();
                return;
            } else {
                var selectionId = answer.selection.split(".")[0];
                moreInfo(selectionId);
            }
        })
    })
}

var moreInfo = (selectionId) =>{
    connection.query("SELECT*FROM products WHERE ?",
    {
        id: selectionId
    },
     function(err, res){
        console.log("**********************")
        console.log("You have chosen:");
        console.log("Product: " + res[0].product_name);
        console.log("Department: " + res[0].department_name);
        console.log("Price: $" + res[0].price);
        console.log("Number in stock: " + res[0].stock);
        console.log("Description: " + res[0].description);
        console.log("**********************")
        taskToPerform(res);
    })
}

var taskToPerform = (res)=> {
    // console.log(res);
    var question = [
        {
            type: "list",
            message: "How would you like to proceed?",
            choices: ["Purchase", "Go Back", "Return to Start", "Quit"],
            name: "selection"
        }
    ]
    inquirer.prompt(question).then((answer) => {
        console.log(answer.selection);
        if (answer.selection === "Purchase"){
            purchaseScreen(res);
        } else if (answer.selection === "Go Back") {
            // connection.end();
            console.log("**********************")
            getInitialInformation();
        } else if (answer.selection === "Return to Start") {
            landing.directory[0].start("customer");
        } else {
            connection.end();
            // console.log("return");
            return
        }
    })
}
var purchaseScreen = (res) => {
    var question = [
        {
            type: "input",
            message: "How many would you like?",
            validate: function(input){
                if (isNaN(input) || input < 1 || input % 1 != 0){
                    console.log("\nPlease select a positive whole number");
                    console.log(input % 1)
                    return false;
                } else {
                    if (input > res[0].stock) {
                        console.log("\nCannot complete order. Not enough in stock");
                        return false
                    } else {
                        return true
                    }
                }
            },
            name: "selection"
        }
    ]
    inquirer.prompt(question).then((answer) => {
        var selection = answer.selection;
        var price = selection * res[0].price;
        var pennies = price * 100;
        console.log("\n**********************")
        console.log("That will be $" + price + " or " + pennies + " pennies.");
        console.log("Please pay with pennies as their mineral value is worth more than their face value and I have a scheme to get rich.");
        console.log("**********************\n")
        updateTableAfterPurchase(res, selection, price);
    })
}

var updateTableAfterPurchase = (result, count, price) => {
    // console.log(res);
    var newCount = result[0].stock - count;
    var newSales = parseFloat(result[0].product_sales) + price;
    console.log(newSales);
    connection.query("UPDATE products set ?, ? where ?",
    [
        {
            stock: newCount
        },
        {
            product_sales: newSales
        },
        {
            id: result[0].id            
        }
    ],
    function(err, res) {
    })
    connection.query("SELECT stock FROM products where ?", 
    [
        {
            id: result[0].id
        }
    ],
    function(err, res){
        console.log("There are now " + res[0].stock + " in stock. Not that you care. This is for me...selfish sommabich. Not everything is about you.")
        console.log("**********************")
        landing.directory[0].start();
    })
}