// --- Authentication State ---
const validCard = "1234";
const validPin = "0000";

// --- ATM State Variables ---
let currentAction = null;
let inputValue = "";
let accountBalance = 5000;
let isBalanceVisible = false;

// --- DOM Elements ---
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const screenMsg = document.getElementById('screen-message');
const screenInput = document.getElementById('screen-input');
const loginMsg = document.getElementById('login-msg');

// ==========================================
// 1. LOGIN & LOGOUT LOGIC
// ==========================================
function attemptLogin() {
    const cardInput = document.getElementById('card-number').value;
    const pinInput = document.getElementById('pin-number').value;

    if (cardInput === validCard && pinInput === validPin) {
        // Success: Hide login, show dashboard
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        resetATM(); 
    } else {
        // Fail: Show error on the login screen
        loginMsg.innerHTML = "<span style='color: #ff4444;'>INVALID CARD OR PIN.</span><br>Try Card: 1234, PIN: 0000";
    }
}

function logout() {
    // Hide dashboard, show login
    dashboardSection.style.display = 'none';
    loginSection.style.display = 'block';
    
    // Clear inputs
    document.getElementById('card-number').value = "";
    document.getElementById('pin-number').value = "";
    loginMsg.innerHTML = "WELCOME TO SECURE BANK<br><br>Please enter your details to continue.";
    
    // Reset state
    accountBalance = 5000;
}

// ==========================================
// 2. DASHBOARD FEATURE LOGIC
// ==========================================
function selectAction(action) {
    currentAction = action;
    inputValue = "";
    screenInput.innerHTML = "";
    isBalanceVisible = false;

    switch(action) {
        case 'withdraw':
            screenMsg.innerHTML = "ENTER AMOUNT TO WITHDRAW:<br>(Multiple of 100)";
            break;
        case 'deposit':
            screenMsg.innerHTML = "ENTER AMOUNT TO DEPOSIT:";
            break;
        case 'balance':
            showBalanceScreen();
            break;
        case 'statement':
            showMiniStatement();
            break;
        case 'pin':
            screenMsg.innerHTML = "ENTER NEW 4-DIGIT PIN:";
            break;
    }
}

// ==========================================
// 3. KEYPAD LOGIC
// ==========================================
function pressKey(num) {
    if (currentAction === 'withdraw' || currentAction === 'deposit') {
        inputValue += num;
        screenInput.innerHTML = "₹" + inputValue;
    } else if (currentAction === 'pin') {
        if(inputValue.length < 4) {
            inputValue += num;
            screenInput.innerHTML = "*".repeat(inputValue.length); 
        }
    }
}

function clearInput() {
    inputValue = "";
    screenInput.innerHTML = "";
}

function resetATM() {
    currentAction = null;
    inputValue = "";
    isBalanceVisible = false;
    screenMsg.innerHTML = "WELCOME, CERO<br>Please select a transaction";
    screenInput.innerHTML = "";
}

function submitInput() {
    if (!currentAction || inputValue === "") return;

    let amount = parseInt(inputValue);

    if (currentAction === 'withdraw') {
        if (amount > accountBalance) {
            screenMsg.innerHTML = "<span style='color: #ff4444;'>INSUFFICIENT FUNDS</span>";
            screenInput.innerHTML = "";
        } else if (amount % 100 !== 0) {
            screenMsg.innerHTML = "<span style='color: #ff4444;'>PLEASE ENTER MULTIPLES OF 100</span>";
            screenInput.innerHTML = "";
        } else {
            accountBalance -= amount;
            screenMsg.innerHTML = `<span style='color: #00ff00;'>MONEY WITHDRAWN SUCCESSFULLY.</span><br>Please collect your cash.`;
            screenInput.innerHTML = "";
        }
    } 
    else if (currentAction === 'deposit') {
        accountBalance += amount;
        screenMsg.innerHTML = `<span style='color: #00ff00;'>₹₹{amount} DEPOSITED SUCCESSFULLY.</span>`;
        screenInput.innerHTML = "";
    }
    else if (currentAction === 'pin') {
        if(inputValue.length === 4) {
            screenMsg.innerHTML = "<span style='color: #00ff00;'>PIN CHANGED SUCCESSFULLY.</span>";
            screenInput.innerHTML = "";
        }
    }
    
    inputValue = ""; 
    currentAction = null; 
}

// ==========================================
// 4. BALANCE & STATEMENT LOGIC
// ==========================================
function showBalanceScreen() {
    renderBalance();
    screenInput.innerHTML = "";
}

function toggleBalance() {
    isBalanceVisible = !isBalanceVisible;
    renderBalance();
}

function renderBalance() {
    const displayAmount = isBalanceVisible ? `₹₹{accountBalance}` : "****";
    const iconClass = isBalanceVisible ? "fa-eye-slash" : "fa-eye";
    
    screenMsg.innerHTML = `AVAILABLE BALANCE:<br><br>
        <span style="font-size: 2rem;">${displayAmount}</span> 
        <i class="fas ${iconClass} eye-icon" onclick="toggleBalance()" title="Show/Hide Balance"></i>`;
}

function showMiniStatement() {
    screenMsg.innerHTML = `
        <table class="statement-table">
            <tr><th>Date</th><th>Type</th><th>Amount</th></tr>
            <tr><td>12-Oct</td><td>WDL</td><td>₹200</td></tr>
            <tr><td>10-Oct</td><td>DEP</td><td>₹1000</td></tr>
            <tr><td>05-Oct</td><td>WDL</td><td>₹50</td></tr>
        </table>
        <br>Available Bal: ₹₹{accountBalance}
    `;
    screenInput.innerHTML = "";
}
