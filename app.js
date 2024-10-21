// Data Structures
const financialData = {
    income: 0,
    expenses: 0,
    savings: 0,
    tax: 0,
};

// DOM Elements
const incomeDisplay = document.getElementById('incomeDisplay');
const expensesDisplay = document.getElementById('expensesDisplay');
const savingsDisplay = document.getElementById('savingsDisplay');
const taxDisplay = document.getElementById('taxDisplay');
const taxDueDate = document.getElementById('taxDueDate');
const taxCountdown = document.getElementById('taxCountdown');
const taxPaidButton = document.getElementById('taxPaidButton');
const carDetailsList = document.getElementById('carDetailsList');

// Chart.js Setup
const ctx = document.getElementById('financialChart').getContext('2d');
const financialChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Placeholder for months or data points
        datasets: [
            {
                label: 'Income',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Expenses',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Savings',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
                borderWidth: 2,
                tension: 0.4
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '₹' + value;
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            }
        }
    }
});

// Indian Tax Slabs for 2024 (For Annual Income)
function calculateTax(income) {
    let annualIncome = income * 12;  // Convert monthly income to annual
    let tax = 0;
    if (annualIncome <= 250000) {
        tax = 0;
    } else if (annualIncome <= 500000) {
        tax = (annualIncome - 250000) * 0.05;
    } else if (annualIncome <= 750000) {
        tax = 12500 + (annualIncome - 500000) * 0.1;
    } else if (annualIncome <= 1000000) {
        tax = 37500 + (annualIncome - 750000) * 0.15;
    } else if (annualIncome <= 1250000) {
        tax = 75000 + (annualIncome - 1000000) * 0.2;
    } else if (annualIncome <= 1500000) {
        tax = 125000 + (annualIncome - 1250000) * 0.25;
    } else {
        tax = 187500 + (annualIncome - 1500000) * 0.3;
    }
    return tax;
}

// Input Form Submission for Income and Expenses
document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
    const monthlyExpenses = parseFloat(document.getElementById('monthlyExpenses').value);

    financialData.income = monthlyIncome;
    financialData.expenses = monthlyExpenses;
    financialData.tax = calculateTax(monthlyIncome);

    financialData.savings = monthlyIncome - monthlyExpenses - financialData.tax;

    // Update Displays
    incomeDisplay.textContent = financialData.income.toFixed(2);
    expensesDisplay.textContent = financialData.expenses.toFixed(2);
    savingsDisplay.textContent = financialData.savings.toFixed(2);
    taxDisplay.textContent = financialData.tax.toFixed(2);

    // Update Chart
    financialChart.data.labels.push(new Date().toLocaleString('default', { month: 'long' }));
    financialChart.data.datasets[0].data.push(financialData.income);
    financialChart.data.datasets[1].data.push(financialData.expenses);
    financialChart.data.datasets[2].data.push(financialData.savings);
    financialChart.update();

    // Handle Tax Countdown
    handleTaxCountdown();
});

// Tax Payment Countdown
let countdownInterval;
const taxPaymentDates = {
    individual: new Date(new Date().getFullYear(), 6, 31),  // July 31
    audit: new Date(new Date().getFullYear(), 9, 31)       // October 31
};

function handleTaxCountdown() {
    const now = new Date();
    const nextDueDate = now < taxPaymentDates.audit ? taxPaymentDates.individual : taxPaymentDates.audit;

    taxDueDate.textContent = `Next Tax Payment Due Date: ${nextDueDate.toLocaleDateString()}`;
    
    // Clear any existing countdown
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const now = new Date();
        const distance = nextDueDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        taxCountdown.textContent = `Countdown: ${days}d ${hours}h ${minutes}m ${seconds}s`;

        // Check if the countdown is finished
        if (distance < 0) {
            clearInterval(countdownInterval);
            taxCountdown.textContent = "Tax Due Date has passed!";
        }
    }, 1000);
}

// Mark Tax as Paid
taxPaidButton.addEventListener('click', function() {
    clearInterval(countdownInterval);
    taxCountdown.textContent = "Tax has been marked as paid. No countdown.";
});

// Car Details Input
document.getElementById('carForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const carName = document.getElementById('carName').value;
    const purchasingPrice = parseFloat(document.getElementById('purchasingPrice').value);
    const insuranceExpiry = new Date(document.getElementById('insuranceExpiry').value);
    
    // Add Car Details to the List
    const carDetailItem = document.createElement('div');
    carDetailItem.innerHTML = `<p>Car Name: ${carName}, Purchasing Price: ₹${purchasingPrice.toFixed(2)}, Insurance Expiry: ${insuranceExpiry.toLocaleDateString()}</p>`;
    
    // Calculate days left for insurance expiry
    const now = new Date();
    const daysLeft = Math.floor((insuranceExpiry - now) / (1000 * 60 * 60 * 24));
    const expiryText = daysLeft >= 0 ? `Days left for insurance expiry: ${daysLeft}` : "Insurance has expired!";
    
    carDetailItem.innerHTML += `<p>${expiryText}</p>`;
    carDetailsList.appendChild(carDetailItem);

    // Reset the form
    document.getElementById('carForm').reset();
});
