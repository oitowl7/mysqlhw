var mysql = require("mysql");
var inquirer = require("inquirer");
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
            connection.connect((err)=>{
                if (err) throw err;
                managerOptions();
            })
        },
        managerOptions: function(){
            managerOptions();
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

var managerOptions = ()=> {
    console.log("**********************")
    var question = [
        {
            type: "list",
            message: "Whatcha wanna do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Return to Start", "Quit"],
            name: "selection"
        }
    ]
    inquirer.prompt(question).then((answer) => {
        console.log("\n**********************")
        if(answer.selection === "View Products for Sale"){
            viewProductsForSale();
        } else if(answer.selection === "View Low Inventory") {
            viewLowInventory();
        } else if(answer.selection === "Add to Inventory") {
            addToInventory();
        } else if (answer.selection === "Add New Product"){
            addNewInventory();
        } else if (answer.selection === "Quit") {
            return;
            connection.end();
        } else {
            landing.directory[0].start("manager");
        }
    })
}

var viewProductsForSale = () => {
    connection.query("SELECT * FROM products", function (err, res){
        for (var i = 0; i < res.length; i++) {
            console.log("**********************");
            console.log("Product: " + res[i].product_name);
            console.log("Product ID: " + res[i].id);
            console.log("Department: " + res[i].department);
            console.log("Price: " + res[i].price);
            console.log("Stock: " + res[i].stock);
            console.log("**********************");
        }
        managerOptions();
    })
}

var viewLowInventory = () => {
    console.log("\n**********************");
    console.log("Low inventory is considered any item with under 10 units remaining");
    connection.query("Select product_name, stock FROM products Where stock < " + 10,
    function(err, res){
        for(var i = 0; i < res.length; i++) {
            console.log("**********************");
            console.log("Product: " + res[i].product_name);
            console.log("Stock: " + res[i].stock);
        }
        managerOptions();
    })
}

var addToInventory = () => {
    connection.query("SELECT product_name, stock, id FROM products", function(err, res){
        console.log("\n**********************");
        var questionData = [];
        for (var i = 0; i < res.length; i++){
            var tempString = res[i].id + ". " + res[i].product_name + " || STOCK: " + res[i].stock;
            questionData.push(tempString);
        }
        questionData.push("Return to Menu", "Quit");
        var question = [
            {
                type: "list",
                message: "What would you like to add inventory to?",
                choices: questionData,
                name: "selection"
            },
            {
                type: "input",
                message: "How many would you like to add?",
                validate: function(input){
                    if (isNaN(input) || input < 1 || input % 1 != 0){
                        console.log("\nPlease select a positive whole number");
                        console.log(input % 1)
                        return false;
                    } else {
                        return true;
                    }
                },
                name: "amount"
            }
        ]
        inquirer.prompt(question).then((answer) => {
            var selectionId = answer.selection.split(".")[0];
            var newAmount = parseInt(answer.amount) + parseInt(res[selectionId - 1].stock);
            connection.query("UPDATE products SET ? WHERE?",
            [
                {
                    stock: newAmount
                },
                {
                    id: parseInt(selectionId)
                }
            ], (err, res) =>{
                connection.query("SELECT * FROM products WHERE id = " + selectionId, (err, res1) => {
                    console.log("**********************");
                    console.log("The new stock on " + res1[0].product_name + " is: "  + res1[0].stock);
                    console.log("**********************");
                    managerOptions();
                })
            })
        })
    })
}

var addNewInventory = () => {
    var question = [
        {
            type: "input",
            message: "What is the name of the product you would like to add?",
            name: "product_name",
            validate: function(input){
                if (input && input.length > 1){
                    return true;
                } else {
                    console.log("Please enter a longer value");
                    return false;
                }
            }
        },
        {
            type: "input",
            message: "How many would you like to add to inventory?",
            name: "stock",
            validate: function(input){
                if (isNaN(input) || input < 1 || input % 1 != 0){
                    console.log("\nPlease select a positive whole number");
                    console.log(input % 1)
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "What is the price of the item?",
            name: "price",
            validate: function(input){
                if (isNaN(input) || input < 1){
                    console.log("\nPlease select a positive number");
                    console.log(input % 1)
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: "list",
            message: "What is the department of the product you would like to add?",
            name: "department_name",
            choices: ["Housewares", "Furniture", "Gadgets", "Electronics", "Fashion"]
        },
        {
            type: "input",
            message: "Please write a brief description: ",
            name: "description"
        }
    ];
    inquirer.prompt(question).then((answer) => {
        connection.query("INSERT INTO products set ?", 
        {
            product_name: answer.product_name,
            department_name: answer.department_name,
            price: answer.price,
            stock: answer.stock,
            description: answer.description
        }, (err, res) => {
            console.log("**********************");
            console.log(answer.product_name + " has been added with a stock of " + answer.stock);
            managerOptions();
        })
    })
}