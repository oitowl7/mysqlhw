# My MYSQL/Node Homework

This app serves 3 purposes. It acts as a place for customers to go when they want to buy something. It acts as a place managers can go to view end edit inventories. Finally it allows district supervisors to view and create new departments.


## Landing

![alt text](./img/landing.jpg "Landing Page")

This is what is shown when the user first starts the app. It directs them to either the **customer** side of the app or the **employee** side of the app, which will later branch into a *manager* or *supervisor* part. It uses inquirer to get responses from the user.
***
***

## Customer

![alt text](./img/customerselection1.jpg "Customer Selection")
![alt text](./img/customerselection2.jpg "Customer Selection")

Upon landing on the customer landing site, the logic for which is contained in the *customer.js* file, the list of all products for sale is put on the screen as well as a return (which returns to original landing) and a quit command. The user then selects which product they would like to view more information about.

***

![alt text](./img/customerprepurchase.jpg "Customer Selection")

After selecting their item, the user is shown information about the item and is given the option to purchase it, go back to the previous screen, return to the main landing, or quit.

***

![alt text](./img/customerpostpurchase.jpg "Customer Selection")


