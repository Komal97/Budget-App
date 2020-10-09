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
        container: '.container',
        dateLabel: '.budget__title--month',
        expensesPercentLabel: '.item__percentage'
    };

    let formatNumber = function(num, type) {

        let numSplit, int, decimal;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        decimal = numSplit[1];

        return (type == 'exp' ? '-' : '+') + ' ' + int + '.' + decimal;

    };

    let nodelistForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

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
                html = '<div class = "item clearfix" id = "inc-%id%" ><div class = "item__description"> %description% </div> <div class = "right clearfix"><div class = "item__value" > %value% </div> <div class = "item__delete" ><button class = "item__delete--btn"> <i class = "ion-ios-close-outline"> </i></button ></div> </div> </div>';
            } else if (type == 'exp') {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id = "exp-%id%"><div class="item__description"> %description% </div><div class="right clearfix"><div class="item__value"> %value% </div><div class="item__percentage"> 21% </div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert the HTML in the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorId) {

            let element = document.getElementById(selectorId)
            element.parentNode.removeChild(element);
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

            let type;
            obj.budget >= 0 ? type = 'inc' : type = 'exp'

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).innerHTML = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).innerHTML = '---';
            }

            document.querySelector(DOMStrings.budgetLabel).innerHTML = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).innerHTML = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).innerHTML = formatNumber(obj.totalExp, 'exp');
        },

        displayPercentages: function(percentages) {

            let fields = document.querySelectorAll(DOMStrings.expensesPercentLabel);

            nodelistForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.innerHTML = percentages[index] + '%';
                } else {
                    current.innerHTML = '---';
                }
            });
        },

        displayMonth: function() {

            let now, month, year, months;

            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                'October', 'November', 'December'
            ]
            document.querySelector(DOMStrings.dateLabel).innerHTML = months[month] + ', ' + year;
        },

        changeType: function() {

            let fields = document.querySelectorAll(
                DOMStrings.inputType + ', ' +
                DOMStrings.inputDesc + ', ' +
                DOMStrings.inputValue);

            nodelistForEach(fields, function(curr) {
                curr.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    }
})();