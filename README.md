# My MYSQL/Node Homework

This app serves 3 purposes. It acts as a place for customers to go when they want to buy something. It acts as a place managers can go to view end edit inventories. Finally it allows district supervisors to view and create new departments.


## Landing

![alt text](https://imgur.com/6XP96ys.jpg "Landing Page")

This is what is shown when the user first starts the app. It directs them to either the **customer** side of the app or the **employee** side of the app, which will later branch into a *manager* or *supervisor* part. It uses inquirer to get responses from the user.

***
## Customer

![alt text](https://imgur.com/7Ni0rMY.jpg "Customer Selection")
![alt text](https://imgur.com/VMcB3dW.jpg "Customer Selection")

Upon landing on the customer landing site, the logic for which is contained in the *customer.js* file, the list of all products for sale is put on the screen as well as a return (which returns to original landing) and a quit command. The user then selects which product they would like to view more information about.

![alt text](https://imgur.com/58hw9tY.jpg "Pre Purchase")

After selecting their item, the user is shown information about the item and is given the option to purchase it, go back to the previous screen, return to the main landing, or quit.

![alt text](https://imgur.com/PE5t8TK.jpg "Post Purchase")

After Purchase, the purchase is confirmed with what they bought and how much it will cost. After this is displayed, the app returns back to the original landing page.

***

## Employee Portal

![alt text](https://imgur.com/8XvJvmt.jpg "Manager/Supervisor Selection")

If the user chooses the employee portal at the landing page, they are asked whether they are a **manager** or **supervisor**. They are then routed, after logging in, to the correct menu for their job. The user is allowed three guesses at the password before the app auto-closes. 

***

## Manager

![alt text](https://imgur.com/i3C7N3h.jpg "Manager Login and Landing")

If the user selects manager, they are shown a menu containing four tasks which it can perform, as well as return to start or quit. The tasks are:
+ View Products for Sale

![alt text](https://imgur.com/SMGeMf8.jpg "Product Table")

This table shows a list of all products for sale pulled from a MYSQL database table called departments. It displays The product key, name, department, price, stock, and description in table form.

+ View Low Inventory (10 or less)

![alt text](https://imgur.com/veJv9Bx.jpg "View Low Stock")

This table simply displays the item name of any item that has stock lower than 10.

+ Add Inventory to Existing Products

![alt text](https://imgur.com/FV6FlB3.jpg "Add Inventory")

This just adds inventory to an object that already is being sold. The user is shown a list of items (similar to the customer portal list). After selecting what they want to add to must choose an amount to add. This information is then pushed to the database for storage.

+ Add New Product

![alt text](https://imgur.com/mUmttto.jpg "Add Item")

This option allows the user to add an item to the database to be sold. It prompts the user for a product name, number to be added, price, department, and a brief description of the item for customers to look at.

***

## Supervisor

![alt text](https://imgur.com/tHbXioe.jpg "Supervisor Menu")

If supervisor was selected in the employee portal, then the user is directed to a menu with tasks that can be performed, as well as returning to start or quit. The two tasks are: 

+ View Department Info

![alt text](https://imgur.com/sJteZs3.jpg "View Departments")

This table displays each department that currently has an item that can be sold inside of it. It desplays the department id, name, overhead cost, sales, and total loss/profit. This information is all taken from two databases on our SQL database and combined to gather this information.

+ Add New Department

![alt text](https://imgur.com/Jsv79lb.jpg "View Departments")

This option allows the supervisor to add a whole new department. It prompts the user to enter the name of the department as well as the overhead cost to run that department. In order for this department to display properly in the "View Departments" menu option, it must have an item that is associated for it for sale. To do that, the manager must add an item.

![alt text](https://imgur.com/Y7llmWu.jpg "Add New Department Item")

As you can see in this screen cap, the department list has updated to include the "Ketchup" that was added in the previous screen cap. Once it is added, the ketchup department will display correctly as seen in the next photo.

![alt text](https://imgur.com/u7m5p7q.jpg "View Departments")


