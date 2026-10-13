// --- Authentication State ---
const validCard = "1234";
const validPin = "0000";

// --- ATM State Variables ---
let currentAction = null;
let inputValue = "";
let accountBalance = 50000; // Increased to 50,000 for better INR testing
let isBalanceVisible = false;

// --- DOM Elements ---
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const screenMsg = document.getElementById('screen-message');
const screenInput = document.getElementById('screen-input');
const loginMsg = document.getElementById('login-msg');
const loginBtn = document.getElementById('login-btn');

// ==========================================
// 1. ADVANCED LOGIN LOGIC
// ==========================================
function attemptLogin() {
    const cardInput = document.getElementById('card-number').value;
    const pinInput = document.getElementById('pin-number').value;

    // Loading Simulation Effect
    loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> VERIFYING...';
    loginBtn.style.pointerEvents = 'none';

    setTimeout(() => {
        if (cardInput === validCard && pinInput === validPin) {
            // Success
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            resetATM(); 
        } else {
            // Fail
            loginMsg.innerHTML = "<span style='color: #ed4c67;'>AUTH FAILED.</span><br>Verify credentials.<br><span style='font-size:0.9rem; color:#888;'>(Hint: 1234 / 0000)</span>";
        }
        
        // Reset button state
        loginBtn.innerHTML = '<span>SECURE LOGIN</span> <i class="fa-solid fa-fingerprint"></i>';
        loginBtn.style.pointerEvents = 'auto';
    }, 1200); // 1.2 second fake loading delay
}

function logout() {
    dashboardSection.style.display = 'none';
    loginSection.style.display = 'block';
    
    document.getElementById('card-number').value = "";
    document.getElementById('pin-number').value = "";
    loginMsg.innerHTML = "SYSTEM READY<br><br>Please insert card details.";
    
    accountBalance = 50000;
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
            screenMsg.innerHTML = "WITHDRAWAL AMOUNT:<br><span style='font-size:1rem; color:#888;'>(Multiples of 100)</span>";
            break;
        case 'deposit':
            screenMsg.innerHTML = "DEPOSIT AMOUNT:";
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
    screenMsg.innerHTML = "WELCOME, CERO<br><br>Please select a transaction.";
    screenInput.innerHTML = "";
}

function submitInput() {
    if (!currentAction || inputValue === "") return;

    let amount = parseInt(inputValue);

    screenMsg.innerHTML = "<span style='color:#f2a900;'>PROCESSING...</span>";
    screenInput.innerHTML = "";

    // Simulate network delay for transactions
    setTimeout(() => {
        if (currentAction === 'withdraw') {
            if (amount > accountBalance) {
                screenMsg.innerHTML = "<span style='color: #ed4c67;'>ERROR: INSUFFICIENT FUNDS</span>";
            } else if (amount % 100 !== 0) {
                screenMsg.innerHTML = "<span style='color: #ed4c67;'>ERROR: MULTIPLES OF 100 ONLY</span>";
            } else {
                accountBalance -= amount;
                screenMsg.innerHTML = `<span style='color: #45a29e;'>TRANSACTION SUCCESSFUL.</span><br>Dispensing $${amount.toLocaleString('en-IN')}...`;
            }
        } 
        else if (currentAction === 'deposit') {
            accountBalance += amount;
            screenMsg.innerHTML = `<span style='color: #45a29e;'>DEPOSIT SUCCESSFUL.</span><br>Added $${amount.toLocaleString('en-IN')} to account.`;
        }
        else if (currentAction === 'pin') {
            if(inputValue.length === 4) {
                screenMsg.innerHTML = "<span style='color: #45a29e;'>PIN UPDATED SUCCESSFULLY.</span>";
            } else {
                screenMsg.innerHTML = "<span style='color: #ed4c67;'>ERROR: PIN MUST BE 4 DIGITS</span>";
            }
        }
        
        inputValue = ""; 
        currentAction = null; 
    }, 800);
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
    // Uses 'en-IN' for the Indian comma system (e.g., ₹1,00,000)
    const displayAmount = isBalanceVisible ? `₹${accountBalance.toLocaleString('en-IN')}` : "****";
    const iconClass = isBalanceVisible ? "fa-eye-slash" : "fa-eye";
    
    screenMsg.innerHTML = `AVAILABLE BALANCE:<br><br>
        <span style="font-size: 2.2rem; color: #fff;">${displayAmount}</span> 
        <i class="fas ${iconClass} eye-icon" onclick="toggleBalance()" title="Toggle View"></i>`;
}

function showMiniStatement() {
    screenMsg.innerHTML = `
        <table class="statement-table">
            <tr><th>DATE</th><th>TYPE</th><th>AMOUNT</th></tr>
            <tr><td>Oct 12</td><td>WDL</td><td>₹2,500</td></tr>
            <tr><td>Oct 10</td><td>DEP</td><td>₹10,000</td></tr>
            <tr><td>Oct 05</td><td>WDL</td><td>₹500</td></tr>
        </table>
        <br><span style="color:#888;">Current Bal: ₹${accountBalance.toLocaleString('en-IN')}</span>
    `;
    screenInput.innerHTML = "";
}
