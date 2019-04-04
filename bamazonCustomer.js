// Dependencies 
var inquirer = require("inquirer");
var mysql = require("mysql");
// require("console.table");
var colors = require("colors");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
    
});

function displayItems(){
    
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        console.log("\nItems available for purchase:\n");
        // console.table(res);

        for (var i = 0; i < res.length; i++) {
            console.log("Item Id: " + res[i].item_id + " || " + res[i].product_name + " || " + "Price: " + "$" + res[i].price);
        }

        promptUser();
    });    
}

function promptUser() {
    inquirer.prompt([
        {
            type: "input",
            name: "item_id",
            message: "Please enter the item_id for the item(s) you'd like to purchase."
        },
        {
            type: "input",
            name: "quantity",
            message: "Enter the quantity you would like to purchase."
        }
    ]).then(function(response) {
        connection.query("SELECT * FROM products WHERE item_id=" + response.item_id, function(err, res) {
            if (err) throw err;
            
            var stock = res[0].stock_quantity;
            var perPrice = res[0].price;
            
            if (response.quantity <= stock) {
                
                var quantity = parseInt(response.quantity);
                var newQuantity = stock - quantity;
            
                connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newQuantity
                    },
                    {
                        item_id: response.item_id
                    }
                ], function(err, res) {
                    if (err) throw err; 

                    var total = (quantity) * perPrice;
                    console.log("\nYour total cost is $" + total + ".");
                    displayItems();
                })
            } else {
                console.log("\nInsufficient quantity on hand.\nPlease modify your quantity.\n".red);
                displayItems();
            }
        })
    });
}

connection.connect(function(err) {
    if (err) throw err;
    displayItems();
});