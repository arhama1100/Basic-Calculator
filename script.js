document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.output');
    const buttons = document.querySelectorAll('.button');

    let currentInput = '0';
    let operator = null;
    let previousInput = '';
    let resetDisplay = false;

    function updateDisplay() {
        if (currentInput === 'Error') {
            display.textContent = 'Error';
            return;
        }

        const displayValue = currentInput.replace(/,/g, '');
        const parts = displayValue.split('.');
        
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        display.textContent = parts.join('.').slice(0, 15);
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;

            // Ignore empty buttons
            if (button.classList.contains('empty')) {
                return;
            }

            // Handle Number and Dot Input
            if ((value >= '0' && value <= '9') || value === '.') {
                if (resetDisplay) {
                    currentInput = value === '.' ? '0.' : value;
                    resetDisplay = false;
                } else if (currentInput === '0' && value !== '.') {
                    currentInput = value;
                } else if (value === '.' && currentInput.includes('.')) {
                
                } else {
                    currentInput += value;
                }
            } 
            // Handle Equals
            else if (value === '=') {
                if (operator && previousInput !== '') {
                    const num1 = parseFloat(previousInput.replace(/,/g, ''));
                    const num2 = parseFloat(currentInput.replace(/,/g, ''));
                    currentInput = String(operate(num1, num2, operator));
                    operator = null;
                    previousInput = '';
                    resetDisplay = true;
                }
            } 
            // Handle Operators
            else if (value === '+' || value === '-' || value === '*' || value === '/') {
                if (previousInput && operator && !resetDisplay) {
                    const num1 = parseFloat(previousInput.replace(/,/g, ''));
                    const num2 = parseFloat(currentInput.replace(/,/g, ''));
                    currentInput = String(operate(num1, num2, operator));
                    updateDisplay(); 
                }
                previousInput = currentInput.replace(/,/g, ''); 
                operator = value;
                resetDisplay = true;
            } 

            else if (value === 'del') {
                if (!resetDisplay) {
                    let tempInput = currentInput.replace(/,/g, '');
                    tempInput = tempInput.slice(0, -1);
                    currentInput = tempInput;
                }
                
                if (currentInput === '' || currentInput === '-') { 
                    currentInput = '0';
                }
                resetDisplay = false;
            }

            updateDisplay();
        });
    });

    function operate(a, b, op) {
        let result;
        switch (op) {
            case '+':
                result = a + b;
                break;
            case '-':
                result = a - b;
                break;
            case '*':
                result = a * b;
                break;
            case '/':
                if (b === 0) return 'Error'; 
                result = a / b;
                break;
            default:
                result = b;
        }
        return parseFloat(result.toFixed(8));
    }
    updateDisplay();
});