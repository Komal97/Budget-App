// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    let setupEventListeners = function() {

        let DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which == 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

    let updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        let budget = budgetCtrl.getBudget();

        // 3. Display the budget on UI
        UICtrl.displayBudget(budget);
    };

    let updatePercentage = function() {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        let percentages = budgetCtrl.getPercentages();

        // 3. Update UI with new percentages
        UICtrl.displayPercentages(percentages);
    }

    let ctrlAddItem = function() {

        let input, newitem;

        // 1. Get the filled input data
        input = UICtrl.getInput();

        if (input.desc !== "" && !isNaN(input.val) && input.val > 0) {
            // 2. Add the item to budget controller
            newitem = budgetCtrl.addItem(input.type, input.desc, input.val);

            // 3. Add the item to UI
            UICtrl.addListItem(newitem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and display the budget
            updateBudget();

            // 6. calculate and update percentages
            updatePercentage();
        }
    }

    let ctrlDeleteItem = function(event) {

        let itemId, splitId, type, Id;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            Id = parseInt(splitId[1]);

            // 1. delete item from data structure
            budgetCtrl.deleteItem(type, Id);

            // 2. delete the item from UI
            UICtrl.deleteListItem(itemId);

            // 3. update and show new budget
            updateBudget();

            // 4. calculate and update percentages
            updatePercentage();
        }
    };

    return {
        init: function() {
            UICtrl.displayMonth();
            UICtrl.displayBudget(budgetCtrl.getBudget());
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();