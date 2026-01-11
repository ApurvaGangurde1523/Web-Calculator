document.addEventListener("DOMContentLoaded", () => {

class AdvancedCalculator {
    constructor() {
        this.currentValue = '0';
        this.expression = '';
        this.history = [];
        this.lastResult = null;
        this.isScientificMode = false;

        this.currentDisplay = document.getElementById('currentValue');
        this.expressionDisplay = document.getElementById('expression');
        this.historyList = document.getElementById('historyList');

        this.initializeEventListeners();
        this.loadHistory();
    }

    initializeEventListeners() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.isScientificMode = e.target.dataset.mode === 'scientific';
                document.getElementById('scientificButtons')
                    .classList.toggle('active', this.isScientificMode);
            });
        });

        document.querySelectorAll('[data-number]').forEach(btn =>
            btn.addEventListener('click', () => this.appendNumber(btn.dataset.number))
        );

        document.querySelectorAll('[data-operator]').forEach(btn =>
            btn.addEventListener('click', () => this.appendOperator(btn.dataset.operator))
        );

        document.querySelectorAll('[data-bracket]').forEach(btn =>
            btn.addEventListener('click', () => this.appendBracket(btn.dataset.bracket))
        );

        document.querySelectorAll('[data-function]').forEach(btn =>
            btn.addEventListener('click', () => this.applyFunction(btn.dataset.function))
        );

        document.querySelector('[data-action="clear"]').addEventListener('click', () => this.clear());
        document.querySelector('[data-action="equals"]').addEventListener('click', () => this.calculate());
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());

        document.addEventListener('keydown', e => this.handleKeyboard(e));
    }

    appendNumber(num) {
        if (this.currentValue === '0' && num !== '.') this.currentValue = num;
        else if (num === '.' && this.currentValue.includes('.')) return;
        else this.currentValue += num;
        this.updateDisplay();
    }

    appendOperator(op) {
        this.expression += `${this.currentValue} ${op} `;
        this.currentValue = '';
        this.updateDisplay();
    }

    appendBracket(bracket) {
        if (this.currentValue !== '') {
            this.expression += this.currentValue;
            this.currentValue = '';
        }
        this.expression += bracket;
        this.updateDisplay();
    }

    applyFunction(func) {
        let v = parseFloat(this.currentValue) || 0;
        const fns = {
            sin: Math.sin(v * Math.PI / 180),
            cos: Math.cos(v * Math.PI / 180),
            tan: Math.tan(v * Math.PI / 180),
            log: Math.log10(v),
            ln: Math.log(v),
            sqrt: Math.sqrt(v),
            pow: Math.pow(v, 2),
            exp: Math.exp(v),
            pi: Math.PI,
            e: Math.E,
            abs: Math.abs(v),
            fact: this.factorial(Math.floor(v))
        };
        this.currentValue = String(fns[func]);
        this.updateDisplay();
    }

    factorial(n) {
        if (n <= 1) return 1;
        return n * this.factorial(n - 1);
    }

    calculate() {
        try {
            const result = eval(this.expression + this.currentValue);
            this.addToHistory(this.expression + this.currentValue, result);
            this.currentValue = String(result);
            this.expression = '';
            this.updateDisplay();
        } catch {
            this.currentValue = 'Error';
            this.updateDisplay();
        }
    }

    clear() {
        this.currentValue = '0';
        this.expression = '';
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentDisplay.textContent = this.currentValue;
        this.expressionDisplay.textContent = this.expression;
    }

    addToHistory(exp, res) {
        this.history.unshift({ exp, res });
        localStorage.setItem('history', JSON.stringify(this.history));
        this.renderHistory();
    }

    renderHistory() {
        this.historyList.innerHTML = this.history
            .map(h => `<div class="history-item">${h.exp} = ${h.res}</div>`)
            .join('');
    }

    clearHistory() {
        this.history = [];
        localStorage.clear();
        this.renderHistory();
    }

    loadHistory() {
        this.history = JSON.parse(localStorage.getItem('history')) || [];
        this.renderHistory();
    }

    handleKeyboard(e) {
        if (!isNaN(e.key)) this.appendNumber(e.key);
        if (['+', '-', '*', '/'].includes(e.key)) this.appendOperator(e.key);
        if (e.key === 'Enter') this.calculate();
        if (e.key === 'Escape') this.clear();
    }
}

window.calculator = new AdvancedCalculator();

});
