// BUDGET CONTROLLER
var budgetController = (function() {

    let Expense = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

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

            // return the new element
            return newitem;
        },

        deleteItem: function(type, id) {

            let ids, index;

            ids = data.allitems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);
            if (index !== -1) {
                data.allitems[type].splice(index, 1);
            }
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

        calculatePercentages: function() {

            data.allitems.exp.forEach(function(current) {
                current.calcPercentage(data.total.inc);
            })
        },

        getPercentages: function() {

            let allPerc = data.allitems.exp.map(function(current) {
                return current.getPercentage();
            })

            return allPerc;
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