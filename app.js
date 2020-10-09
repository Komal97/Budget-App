// BUDGET CONTROLLER
var budgetController = (function() {

    let Expense = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    let Income = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    let data = {
        allitems: {
            inc: [],
            exp: []
        },
        total: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };

    let calculateTotal = function(type) {
        let sum = 0;

        data.allitems[type].forEach((current) => {
            sum += current.value;
        });

        data.total[type] = sum;
    }

    return {
        addItem: function(type, des, val) {
            let newitem, ID;

            // create new ID
            if (data.allitems[type].length > 0) {
                ID = data.allitems[type][data.allitems[type].length - 1].id + 1; // ID = last id + 1
            } else {
                ID = 0;
            }

            // create new item based on 'inc' and 'exp' type
            if (type === 'exp') {
                newitem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newitem = new Income(ID, des, val);
            }

            // push it into our data structure
            data.allitems[type].push(newitem);
            data.total[type] += val;

            // return the new element
            return newitem;
        },

        calculateBudget: function() {

            // calculate total income and expenses 
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate budget
            data.budget = data.total.inc - data.total.exp;

            // calculate the percentage of income that we spent
            if (data.total.inc > 0) {
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            }
        },

        testing: function() {
            return data;
        }
    }
})();

// UI CONTROLLER
var UIController = (function() {

    let DOMStrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                desc: document.querySelector(DOMStrings.inputDesc).value,
                val: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        addListItem: function(obj, type) {

            let html, newHtml, element;

            // create HTML string with placeholder string 
            if (type == 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class = "item clearfix" id = "income-%id%" ><div class = "item__description"> %description% </div> <div class = "right clearfix"><div class = "item__value" > +%value% </div> <div class = "item__delete" ><button class = "item__delete--btn"> <i class = "ion-ios-close-outline"> </i></button ></div> </div> </div>';
            } else if (type == 'exp') {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description"> %description% </div><div class="right clearfix"><div class="item__value"> - %value% </div><div class="item__percentage"> 21% </div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert the HTML in the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            let fields;

            fields = document.querySelectorAll(DOMStrings.inputDesc + ', ' + DOMStrings.inputValue);
            let fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach((currentValue, index, array) => {
                currentValue.value = '';
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).innerHTML = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).innerHTML = '---';
            }

            document.querySelector(DOMStrings.budgetLabel).innerHTML = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).innerHTML = '+ ' + obj.totalInc;
            document.querySelector(DOMStrings.expenseLabel).innerHTML = '- ' + obj.totalExp;


        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    }
})();

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
    };

    let updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        let budget = budgetCtrl.getBudget();

        // 3. Display the budget on UI
        UICtrl.displayBudget(budget);
    };

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
        }
    }

    let ctrlDeleteItem = function(event) {
        console.log(event);
        console.log(event.target);
    };

    return {
        init: function() {
            UICtrl.displayBudget(budgetCtrl.getBudget());
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();