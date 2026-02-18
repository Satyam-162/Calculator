let currentInput = '0';
let previousInput = '';
let operator = null;
let waitingForSecondOperand = false;

const displayElement = document.getElementById('display');
const historyElement = document.getElementById('history');

function updateDisplay() {
    displayElement.innerText = currentInput;

    // Update history display
    if (operator != null) {
        historyElement.innerText = `${previousInput} ${operator}`;
    } else {
        historyElement.innerText = '';
    }
}

function appendNumber(number) {
    if (waitingForSecondOperand) {
        currentInput = number;
        waitingForSecondOperand = false;
    } else {
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else {
            // Prevent multiple decimals
            if (number === '.' && currentInput.includes('.')) return;
            // Limit length
            if (currentInput.length > 12) return;
            currentInput += number;
        }
    }
    updateDisplay();
}

function appendOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        updateDisplay();
        return;
    }

    if (previousInput == '') {
        previousInput = currentInput;
    } else if (operator) {
        const result = calculate(parseFloat(previousInput), inputValue, operator);
        currentInput = String(result);
        previousInput = String(result);
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
    updateDisplay();
}

function calculate(first, second, op) {
    if (op === '+') return first + second;
    if (op === '-') return first - second;
    if (op === '*') return first * second;
    if (op === '/') return second === 0 ? 'Error' : first / second;
    if (op === '%') return first % second;
    return second;
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

function deleteLast() {
    if (waitingForSecondOperand) return;

    currentInput = currentInput.toString().slice(0, -1);
    if (currentInput === '') currentInput = '0';
    updateDisplay();
}

function calculateResult() {
    if (operator === null || waitingForSecondOperand) return;

    const inputValue = parseFloat(currentInput);
    const result = calculate(parseFloat(previousInput), inputValue, operator);

    // Check for float precision issues and errors
    if (result === 'Error' || !isFinite(result)) {
        currentInput = 'Error';
    } else {
        // Fix precision (e.g. 0.1 + 0.2)
        currentInput = parseFloat(result.toFixed(8)).toString();
    }

    operator = null;
    previousInput = '';
    waitingForSecondOperand = true; // Reset so next number starts new
    updateDisplay();
}

// Keyboard Support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if ((key >= 0 && key <= 9) || key === '.') {
        appendNumber(key);
    }
    if (key === 'Backspace') {
        deleteLast();
    }
    if (key === 'Escape') {
        clearDisplay();
    }
    if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
        appendOperator(key);
    }
    if (key === 'Enter' || key === '=') {
        calculateResult();
    }
});
