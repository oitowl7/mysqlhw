var inquirer = require("inquirer");
var employeePortal = require("./employeeportal.js");
var customerFile = require("./customer.js");
var managerFile = require("./manager.js");
var mysql = require("mysql");
var supervisorFile = require('./supervisor.js');
var landing = require("./landing.js");
const {table} = require('table');
var departmentArray = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})

var DepartmentConstructor = function(key, name, overhead, sales, profit) {
    this.departmentId = key;
    this.name = name;
    this.overhead = overhead;
    this.sales = sales;
    this.profit = profit;
    this.array = [key, name, overhead, sales, profit]
}

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
        }, 
        quit: function(){
            connection.end();
            return;
        }
    }
]

var connector = () => {
    connection.connect((err)=>{
        if (err) throw err;
        tableMaker();
    })
}

var supervisorOptions = () => {
    console.log("**********************");
    var question = [
        {
            type: "list",
            message: "Whatcha Wanna Do?",
            choices: ["View Department Information", "Add New Department", "Return to Start", "Quit"],
            name: "selection"
        }
    ];
    inquirer.prompt(question).then((answer) => {
        if (answer.selection === "View Department Information"){
            connection.query("select * from departments left join products on products.department_name = departments.department_name", (err, res) =>{
                departmentArray.length = 0;
                departmentKeyLooper(res);
                tableMaker();
            })
        } else if (answer.selection === "Add New Department") {
            addDepartment();
        } else if (answer.selection === "Quit") {
            connection.end();
            return;
        } else {
            landing.directory[0].start("supervisor");
        }
    })
}

var departmentKeyLooper = (res) => {
    var departmentKeyArray = [];
    for (var i = 0; i < res.length; i++){
        var departmentKey = res[i].department_id;
        var used = false;
        for (var j = 0; j < departmentKeyArray.length; j++){
            if(parseInt(departmentKey) === parseInt(departmentKeyArray[j])){
                used = true;
            }
        }
        if (!used){
            departmentKeyArray.push(departmentKey);
        } 
    }
    for (var i = 0; i < departmentKeyArray.length; i++){
        departmentInfoLooper(departmentKeyArray, res, i);        
    }
}

var departmentInfoLooper = (keys, res, i) => {
    var departmentKey = keys[i];
    var departmentName;
    var overheadCosts = 0;
    var productSales = 0;
    var profits = 0;
    for (var j = 0; j < res.length; j++){
        if (res[j].department_id === departmentKey){
            departmentName = res[j].department_name;
            overheadCosts = parseFloat(res[j].over_head_costs);
            break;
        }
    }
    if (departmentName === null){
        departmentName = "This dept. has no products";
        productSales = 0;
        profits = overheadCosts * (-1);
    } else {
        for (var j = 0; j < res.length; j++){
            if (res[j].department_id === departmentKey){
                productSales = parseFloat(productSales) + parseFloat(res[j].product_sales);
            }
        }
        profits = productSales - overheadCosts;
    }
    departmentArray.push(new DepartmentConstructor(departmentKey, departmentName, overheadCosts, productSales, profits));
}

var tableMaker = (res) => {
    let data,
    output,
    options;
    var headerArray = ['Department Id', 'Department Name', 'Overhead Costs($)', 'Sales($)', 'Profit/Loss($)']
    var dataArray = []
    dataArray.push(headerArray);
    for (var i = 0; i < departmentArray.length; i++) {
        dataArray.push(departmentArray[i].array);
    }
    data = dataArray;

    options = {

        drawHorizontalLine: (index, size) => {
            return index === 0 || index === 1  || index === size;
        }
    };
    output = table(data, options);
    console.log(output);
    supervisorOptions();
}

var addDepartment = () =>{
    console.log("**********************");
    var question = [
        {
            type: "input",
            message: "What is the name of the Department?",
            name: "name",
            validate: function(input){
                if (input){
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: "input",
            message: "What are the overhead operating costs?",
            name: "overhead",
            validate: function(input){
                if (isNaN(input) || !input || input < 1){
                    console.log("\n Please enter a positive number");
                    return false;
                } else {
                    return true;
                }
            }
        }
    ];
    inquirer.prompt(question).then((answer) => {
        connection.query("INSERT INTO departments SET ?",
        {
            department_name: answer.name,
            over_head_costs: parseFloat(answer.overhead)
        }, (err, res) => {
            console.log("**********************");
            console.log(answer.name + " has been added");
            supervisorOptions();
        })
    })
}