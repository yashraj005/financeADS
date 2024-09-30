// Data Structures
const transactions = [];
const financialSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    tax: 0,
    netSavings: 0,
    budget: 0,
    spent: 0,
    vehicleDetails: null,
};

// DOM Elements
const totalIncomeEl = document.getElementById('annualIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const taxEl = document.getElementById('tax');
const netSavingsEl = document.getElementById('netSavings');
const spentDisplay = document.getElementById('spentDisplay');
const budgetDisplay = document.getElementById('budgetDisplay');
const transactionsListEl = document.getElementById('transactionsList');
const insuranceTimeLeftEl = document.getElementById('insuranceTimeLeft');

// Chart.js Setup
const ctx = document.getElementById('financialChart').getContext('2d');
const financialChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Placeholder for dates
        datasets: [
            {
                label: 'Income',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            },
            {
                label: 'Expenses',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            },
            {
                label: 'Savings',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Tax Calculation Based on Income (Indian Tax Slabs for 2024)
function calculateTax(income) {
    let tax = 0;
    if (income <= 250000) {
        tax = 0;
    } else if (income <= 500000) {
        tax = (income - 250000) * 0.05;
    } else if (income <= 1000000) {
        tax = 12500 + (income - 500000) * 0.2;
    } else {
        tax = 112500 + (income - 1000000) * 0.3;
    }
    return tax;
}

// Monthly Income Form Handler
document.getElementById('monthlyIncomeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
    financialSummary.totalIncome = monthlyIncome * 12;
    
    // Update Tax and Savings
    financialSummary.tax = calculateTax(financialSummary.totalIncome);
    financialSummary.netSavings = financialSummary.totalIncome - (financialSummary.totalExpenses + financialSummary.tax);
    
    updateUI();
});

// Add Transaction
document.getElementById('transactionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    const transaction = { description, amount, category, date: new Date() };
    transactions.push(transaction);

    if (category === 'Income') {
        financialSummary.totalIncome += amount;
    } else {
        financialSummary.totalExpenses += amount;
        financialSummary.spent += amount;
    }

    financialSummary.netSavings = financialSummary.totalIncome - (financialSummary.totalExpenses + financialSummary.tax);

    // Update UI
    updateUI();
    updateChart(transaction);

    // Reset form
    this.reset();
});

// Update UI Function
function updateUI() {
    totalIncomeEl.textContent = financialSummary.totalIncome.toFixed(2);
    totalExpensesEl.textContent = financialSummary.totalExpenses.toFixed(2);
    taxEl.textContent = financialSummary.tax.toFixed(2);
    netSavingsEl.textContent = financialSummary.netSavings.toFixed(2);
    spentDisplay.textContent = financialSummary.spent.toFixed(2);
    budgetDisplay.textContent = financialSummary.budget.toFixed(2);
    
    // Show transactions
    showTransactions();
}

// Show Transactions
function showTransactions() {
    transactionsListEl.innerHTML = '';
    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.textContent = `${transaction.date.toLocaleDateString()}: ${transaction.description} - ₹${transaction.amount}`;
        transactionsListEl.appendChild(li);
    });
}

// Update Chart
function updateChart(transaction) {
    const dateLabel = transaction.date.toLocaleDateString();

    // Update the chart data
    financialChart.data.labels.push(dateLabel);
    financialChart.data.datasets[0].data.push(financialSummary.totalIncome);
    financialChart.data.datasets[1].data.push(financialSummary.totalExpenses);
    financialChart.data.datasets[2].data.push(financialSummary.netSavings);

    financialChart.update();
}

// Vehicle Form Handler
document.getElementById('vehicleForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const carName = document.getElementById('carName').value;
    const carPrice = parseFloat(document.getElementById('carPrice').value);
    const purchaseDate = new Date(document.getElementById('purchaseDate').value);
    const insuranceExpiryDate = new Date(document.getElementById('insuranceExpiry').value);

    const today = new Date();
    const timeLeftInDays = Math.floor((insuranceExpiryDate - today) / (1000 * 60 * 60 * 24));

    insuranceTimeLeftEl.textContent = `Time left for insurance expiry: ${timeLeftInDays} days`;

    financialSummary.vehicleDetails = {
        carName,
        carPrice,
        purchaseDate,
        insuranceExpiryDate
    };
});

// Toggle Vehicle Details
document.querySelectorAll('input[name="vehicle"]').forEach(input => {
    input.addEventListener('change', function() {
        document.getElementById('vehicleDetails').style.display = this.value === 'Yes' ? 'block' : 'none';
    });
});

// Budget Form Handler
document.getElementById('budgetForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const budgetAmount = parseFloat(document.getElementById('budgetAmount').value);
    financialSummary.budget = budgetAmount;
    budgetDisplay.textContent = financialSummary.budget.toFixed(2);
    this.reset();
});
