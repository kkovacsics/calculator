'use strict';

const operators = ['+', '−', '×', '÷'];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const stack = [];
const operations = {
    '+': (a, b) => parseFloat(a) + parseFloat(b),
    '−': (a, b) => a - b,
    '×': (a, b) => a * b,
    '÷': (a, b) => a / b,
}

const display = document.querySelector('.display');

const buttons = document.querySelectorAll('.operator, .number, .equals');
buttons.forEach(item => item.addEventListener('click', function () {
    display.classList.remove('error');
    if (operators.includes(this.textContent))
        handleOperator(this.textContent);
    else if (numbers.includes(this.textContent))
        handleNumber(this.textContent);
    else if (this.textContent === 'C')
        handleClear();
    else
        handleEquals();
}));

function handleOperator(buttonTxt) {
    display.classList.remove('computed');
    if (stack.length > 0) {
        if (!operators.includes(stack[stack.length - 1]))      // the last item NOT operator
            stack.push(buttonTxt);
        else
            stack[stack.length - 1] = buttonTxt;      // the last item IS operator => change it
    }
    stackToDisplay();
}

function handleNumber(buttonTxt) {
    if(display.classList.contains('computed')){     // computed value in it
        stack.length = 0;                           // empty the stack
        display.classList.remove('computed');
    }
    if (stack.length == 0 || operators.includes(stack[stack.length - 1])) { // stack is empty OR last item IS operator
        if (buttonTxt === '.')
            buttonTxt = '0.';
        stack.push(buttonTxt);
    } else {                            // stack is not empty AND last item IS number
        if (!(buttonTxt === '0' && stack[stack.length - 1] === '0' ||       // not only 0
            buttonTxt === '.' && stack[stack.length - 1].includes('.')))    // not float
            stack[stack.length - 1] += buttonTxt;
    }
    stackToDisplay();
}

function handleClear() {
    stack.length = 0;
    display.classList.remove('computed');
    stackToDisplay();
}

function handleEquals() {
    if (stack.length > 0 && stack.length % 2 === 0)    // need 1 less operation then number
        display.classList.add('error');
    else {
        let accumulator = stack.shift();
        while(stack.length>=2){
            accumulator = operations[stack.shift()](accumulator, stack.shift());
        }
        stack.push(accumulator);
        display.classList.add('computed');
        stackToDisplay();
    }
}

function stackToDisplay() {
    display.textContent = stack.join('');
    if(display.textContent.length<=26)
        display.classList.remove('medium', 'mini');
    else if(display.textContent.length<=46){
        display.classList.remove('mini');
        display.classList.add('medium');
    }
    else
        display.classList.add('mini');
}