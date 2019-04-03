// Dependencies 
var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "",
    database: "bamazon_db"
    
});

function displayItems(){
    console.log("\nItems available for purchase:\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        
    });
}

function promptUser() {
    inquirer.prompt([
        {
            type: "input",
            name: "item_id",
            message: "Please enter the item_id for the item(s) you'd like to purhcase."
        },
        {
            type: "input",
            name: "quantity",
            message: "Enter the quantity you would like to purchase."
        }
    ]).then(function(response) {
        connection.query("SELECT * FROM products WHERE item_id=" + response.id, function(err, res) {
            if (err) throw err;
            
            var stock = res[0].stock_quantity;
            var perPrice = res[0].price;

            if (response.quantity <= stock) {
                var newQuantity = stock - response.quantity;
                connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newQuantity
                    },
                    {
                        item_id: response.id
                    }
                ], function(err, res) {
                    if (err) throw err; 

                    var total = response.quantity * 
                }
                
                )
            } else {
                console.log("\nInsufficient quantity on hand.");
                displayItems();
            }
        })
    });
}

connection.connect(function(err) {
    if (err) throw err;
    displayItems();
});