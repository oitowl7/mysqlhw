var inquirer = require("inquirer");
var employeePortal = require("./employeeportal.js");
var customerFile = require("./customer.js");
var managerFile = require("./manager.js");
var mysql = require("mysql");
var supervisorFile = require('./supervisor.js');
const {table} = require('table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})

var departmentLooper = (res) => {
    var usedArray = [];
    var departmentKeyArray = [];
    for (var i = 0; i < res.length; i++){
        var departmentKey = res[i].department_id;
        var used = false;
        for (var j = 0; j < usedArray.length; j++){
            if(parseInt(departmentKey) === parseInt(usedArray[j])){
                console.log("this ran")
                used = true;
            }
        }
        console.log(used);
        if (!used){
            departmentKeyArray.push(departmentKey);
            usedArray.push(departmentKey);
        } 
    }
    console.log(usedArray);
    console.log(departmentKeyArray);
}

var DepartmentConstructor = function(res) {
    this.departmentId
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
            tableMaker();
        }, quit: function(){
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
    connection.query("select * from departments left join products on departments.department_name = products.department_name", (err, res) =>{
            console.log(res);
            departmentLooper(res);
            // console.log(res);
            // tableMaker(res)
    })
    // tableMaker();
}

var tableMaker = (res) => {
    console.log("this happened");
    for (var i = 0; i < res.length; i++) {

    }
    let data,
    output,
    options;

    data = [
        ['Department Id', 'Department Name', 'Overhead Costs', 'Sales', 'Profit/Loss'],
        ['1A', '1B', '1C','1C','1C'],
        ['2A', '2B', '2C','1C','1C'],
        ['3A', '3B', '3C','1C','1C'],
        ['4A', '4B', '4C','1C','1C']
    ];

    options = {

        drawHorizontalLine: (index, size) => {
            return index === 0 || index === 1  || index === size;
        }
    };
    output = table(data, options);

    console.log(output);
}