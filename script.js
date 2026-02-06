/**
 * PROJECT: Library Book Borrowing System
 * 
 * IMPLEMENTATION HIGHLIGHTS (Academic Requirements):
 * 1. DOM Manipulation: Dynamic table rendering, view switching, toast notifications.
 * 2. Event Handling: Form submissions (e.preventDefault), button clicks.
 * 3. Input Validation: Strict checks for empty fields, duplicates, and logical limits.
 * 4. Functions & Logic: Modular functions (login, render, update), conditional checks.
 * 5. Data Handling: 'appState' object using arrays for Books, Borrowers, and Loans.
 */

// --- STATE MANAGEMENT [Requirement: Arrays or objects for data handling] ---
const appState = {
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    currentUser: localStorage.getItem('currentUser') || null,
    // [Requirement: Logical Constraint - Security Rules]
    loginAttempts: 0,
    isLocked: false,
    // [Requirement: Object/Array Data Structure]
    books: JSON.parse(localStorage.getItem('lib_books')) || [
        { id: 101, title: "Ismaaciil Mire", author: "Ismaaciil Mire", price: 1.00, totalCopies: 5, borrowed: 1, cover: "Ismaaciil-Mire-Gabyaagii-Halgamaaga-Ahaa.avif" },
        { id: 102, title: "Aqoondarro Waa U Nacab Jacayl", author: "Faarax M.J. Cawl", price: 0.50, totalCopies: 4, borrowed: 0, cover: "aqoon dare waa oo naceb jacel.jpg" },
        { id: 103, title: "Maana-faay", author: "Maxamed Daahir Afrax", price: 0.40, totalCopies: 5, borrowed: 1, cover: "maana faay.jpg" },
        { id: 104, title: "Maaweelo & Dhaqan", author: "C. C. Gardaad", price: 0.15, totalCopies: 5, borrowed: 1, cover: "maaweelo&dhaqan.jpg" },
        { id: 105, title: "Taariikhda Geeska Afrika", author: "Cabdullaahi Sh. Axmad", price: 1.00, totalCopies: 0, borrowed: 0, cover: "Taariikhda Geeska Afrika.jpg" },
        { id: 106, title: "Suugaanta Soomaalida", author: "Axmed F. Cali 'Idaajaa'", price: 0.80, totalCopies: 4, borrowed: 0, cover: "Suugaanta Soomaalida.jpg" },
        { id: 107, title: "Hagarlaawe", author: "Maxamed Xaashi Dhamac 'Gaarriye'", price: 1.00, totalCopies: 5, borrowed: 0, cover: "Hagarlaawe.jfif" },
        { id: 108, title: "Qalin iyo Qorshe", author: "Muxammad Yuusuf", price: 0.60, totalCopies: 5, borrowed: 0, cover: "Qalin iyo Qorshe.jpg" },
        { id: 109, title: "Sheekooyin Dhaqan Soomaaliyeed", author: "Cumar Maxamed Cumar", price: 1.50, totalCopies: 3, borrowed: 0, cover: "sheekooyin_dhaqan.png" }
    ],
    borrowers: JSON.parse(localStorage.getItem('lib_borrowers')) || [
        { name: "Muzamil Mohamed Abdulahi", id: "LIB001", tell: "0612017176", balance: -5.50 },
        { name: "Hassan Ali Nageye", id: "LIB002", tell: "0612007148", balance: -3.50 }
    ],
    loans: JSON.parse(localStorage.getItem('lib_loans')) || [
        { id: "ln_1", bookTitle: "Maaweelo & Dhaqan", borrowerId: "LIB001", loanDate: "1/24/2026", dueDate: "2/1/2026", status: "Borrowed", chargedAmount: 1.50 },
        { id: "ln_2", bookTitle: "Ismaaciil Mire", borrowerId: "LIB001", loanDate: "1/24/2026", dueDate: "2/1/2026", status: "Borrowed", chargedAmount: 2.00 },
        { id: "ln_3", bookTitle: "Hagarlaawe", borrowerId: "LIB001", loanDate: "1/24/2026", dueDate: "2/1/2026", status: "Borrowed", chargedAmount: 2.00 },
        { id: "ln_4", bookTitle: "Maana-faay", borrowerId: "LIB002", loanDate: "1/24/2026", dueDate: "2/1/2026", status: "Borrowed", chargedAmount: 3.50 }
    ],
    stockAlerts: JSON.parse(localStorage.getItem('lib_alerts')) || []
};

// Helper: Save State
function saveState() {
    localStorage.setItem('lib_books', JSON.stringify(appState.books));
    localStorage.setItem('lib_borrowers', JSON.stringify(appState.borrowers));
    localStorage.setItem('lib_loans', JSON.stringify(appState.loans));
    localStorage.setItem('lib_alerts', JSON.stringify(appState.stockAlerts));
}

// Data Migration: Force-update book covers AND prices to ensure consistency
function migrateBookData() {
    // 1. Fix Book Covers and Prices
    const bookDefaults = {
        "Ismaaciil Mire": { cover: "Ismaaciil-Mire-Gabyaagii-Halgamaaga-Ahaa.avif", price: 1.00 },
        "Aqoondarro Waa U Nacab Jacayl": { cover: "aqoon dare waa oo naceb jacel.jpg", price: 0.50 },
        "Maana-faay": { cover: "maana faay.jpg", price: 0.40 },
        "Maaweelo & Dhaqan": { cover: "maaweelo&dhaqan.jpg", price: 0.15 },
        "Taariikhda Geeska Afrika": { cover: "Taariikhda Geeska Afrika.jpg", price: 1.00 },
        "Suugaanta Soomaalida": { cover: "Suugaanta Soomaalida.jpg", price: 0.80 },
        "Hagarlaawe": { cover: "Hagarlaawe.jfif", price: 1.00 },
        "Qalin iyo Qorshe": { cover: "Qalin iyo Qorshe.jpg", price: 0.60 },
        "Sheekooyin Dhaqan Soomaaliyeed": { cover: "sheekooyin_dhaqan.png", price: 1.50 }
    };

    let updated = false;
    appState.books.forEach(book => {
        if (bookDefaults[book.title]) {
            const defaults = bookDefaults[book.title];
            if (book.cover !== defaults.cover) { book.cover = defaults.cover; updated = true; }
            if (book.price !== defaults.price) { book.price = defaults.price; updated = true; }
        }
    });

    // DOM validation - Name & Tell

const nameInput = document.getElementById('borrower-name');
const tellInput = document.getElementById('borrower-tell');

// Name → numbers lama ogola
nameInput.addEventListener('input', function () {
    this.value = this.value.replace(/[0-9]/g, '');
});

// Tell → xarfo lama ogola (numbers only)
tellInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
});

    // 2. FORCE NEGATIVE BALANCES: Convert any positive debt to negative
    appState.borrowers.forEach(borrower => {
        if (parseFloat(borrower.balance) > 0) {
            borrower.balance = -Math.abs(borrower.balance);
            updated = true;
        }
    });

    if (updated) {
        saveState();
        console.log("System data migrated and forced negative balances.");
    }
}

// Initial Migration Call
migrateBookData();

// --- DOM ELEMENTS [Requirement: DOM Manipulation] ---
const elements = {
    // Auth
    loginScreen: document.getElementById('login-screen'),
    loginForm: document.getElementById('login-form'),
    appContainer: document.getElementById('app-container'),
    logoutBtn: document.getElementById('logout-btn'),
    // App
    navLinks: document.querySelectorAll('.nav-links li'),
    views: document.querySelectorAll('.view'),
    addBookForm: document.getElementById('add-book-form'),
    addBorrowerForm: document.getElementById('add-borrower-form'),
    loanForm: document.getElementById('loan-form'),
    booksTable: document.querySelector('#books-table tbody'),
    borrowersTable: document.querySelector('#borrowers-table tbody'),
    loansTable: document.querySelector('#loans-table tbody'),
    loanBorrowerSelect: document.getElementById('loan-borrower'),
    loanBookSelect: document.getElementById('loan-book'),
    totalBooksCount: document.getElementById('total-books-count'),
    totalBorrowersCount: document.getElementById('total-borrowers-count'),
    activeLoansCount: document.getElementById('active-loans-count'),
    totalBalanceCount: document.getElementById('total-balance-count'),
    todayLoansCount: document.getElementById('today-loans-count'),
    monthlyIncomeCount: document.getElementById('monthly-income-count'),
    // Modals
    modalBook: document.getElementById('modal-book'),
    modalBorrower: document.getElementById('modal-borrower'),
    modalLoan: document.getElementById('modal-loan'),
    // Open Buttons
    btnOpenBook: document.getElementById('open-book-modal'),
    btnOpenBorrower: document.getElementById('open-borrower-modal'),
    btnOpenLoan: document.getElementById('open-loan-modal'),
    btnOpenReceipt: document.getElementById('open-receipt-modal'),
    toastContainer: document.getElementById('toast-container'),
    receiptsTable: document.querySelector('#receipts-table tbody'),
    manualReceiptForm: document.getElementById('manual-receipt-form')
};

// --- AUTH FUNCTIONS [Requirement: Functions and conditional logic] ---
function login(username, password) {
    if (appState.isLocked) {
        showToast('System locked due to too many failed attempts. Please wait.', 'error');
        return;
    }

    // [Requirement: Conditional Logic]
    // Updated password to match new security rules
    if (username === 'Muzamil' && password === 'Muzamil@1234') {
        appState.isAuthenticated = true;
        appState.currentUser = username;
        // Persist session
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', username);

        appState.loginAttempts = 0; // Reset on success
        showApp();
        showToast(`Welcome back, ${username}!`, 'success');
    } else {
        appState.loginAttempts++;
        const remaining = 3 - appState.loginAttempts;

        if (remaining <= 0) {
            appState.isLocked = true;
            showToast('Top many failed attempts. System locked for 10s.', 'error');
            setTimeout(() => {
                appState.isLocked = false;
                appState.loginAttempts = 0;
                showToast('System unlocked. Please try again.', 'success');
            }, 10000); // 10 seconds lock
        } else {
            showToast(`Invalid credentials. attempts remaining: ${remaining}`, 'error');
        }
    }
}

function logout() {
    appState.isAuthenticated = false;
    appState.currentUser = null;
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    showLogin();
}

function showApp() {
    elements.loginScreen.classList.add('hidden');
    elements.appContainer.classList.remove('hidden');
    refreshAll();
}

function showLogin() {
    elements.appContainer.classList.add('hidden');
    elements.loginScreen.classList.remove('hidden');
    elements.loginForm.reset();
}

// --- MODAL LOGIC [Requirement: DOM Manipulation] ---
function openModal(modalId) {
    document.getElementById(modalId).classList.add('open');
}

window.closeModal = function (modalId) {
    document.getElementById(modalId).classList.remove('open');
}

// Close modal if clicking outside content
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('open');
    }
});

// --- NAVIGATION LOGIC [Requirement: Event Handling] ---
function initNavigation() {
    // 1. Sidebar Links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetTab = link.dataset.tab;

            // Update Active Link (Visual feedback)
            elements.navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Switch Views
            elements.views.forEach(view => {
                view.classList.remove('active-view');
                if (view.id === targetTab) {
                    view.classList.add('active-view');
                }
            });
        });
    });

    // Modal Triggers
    if (elements.btnOpenBook) elements.btnOpenBook.addEventListener('click', () => openModal('modal-book'));
    if (elements.btnOpenBorrower) elements.btnOpenBorrower.addEventListener('click', () => openModal('modal-borrower'));
    if (elements.btnOpenLoan) elements.btnOpenLoan.addEventListener('click', () => openModal('modal-loan'));
    if (elements.btnOpenReceipt) elements.btnOpenReceipt.addEventListener('click', () => openModal('modal-manual-receipt'));

    // 2. Logout Button
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Reset System Data
    const resetBtn = document.getElementById('reset-system-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Are you sure? This will delete all your added books, members and loans!")) {
                localStorage.clear();
                window.location.reload();
            }
        });
    }

    // 3. Login Form Submit
    elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userInput = document.getElementById('username');
        const passInput = document.getElementById('password');
        const user = userInput.value.trim();
        const pass = passInput.value.trim();

        // Regex: At least one Uppercase, one Number, one Special Char
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;

        // [Requirement: Input Validation - Strict Rules]
        if (user.length < 3) {
            return showError(userInput, 'Username must be at least 3 characters.');
        }
        if (!passwordRegex.test(pass)) {
            return showError(passInput, 'Password must contain Capital, Number & Symbol.');
        }

        login(user, pass);
    });

    // Real-time Validation for Username and Password
    const uInput = document.getElementById('username');
    const pInput = document.getElementById('password');
    const pwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;

    const validateUser = () => {
        if (uInput.value.trim().length < 3) {
            uInput.classList.add('input-error');
        } else {
            uInput.classList.remove('input-error');
        }
    };

    const validatePass = () => {
        if (!pwdRegex.test(pInput.value)) {
            pInput.classList.add('input-error');
        } else {
            pInput.classList.remove('input-error');
        }
    };

    if (uInput) {
        uInput.addEventListener('input', validateUser);
        uInput.addEventListener('blur', validateUser);
    }
    if (pInput) {
        pInput.addEventListener('input', validatePass);
        pInput.addEventListener('blur', validatePass);
    }

    // 4. Loan Book Selection & Days - Update Price Display (Price * Days)
    if (elements.loanBookSelect && document.getElementById('loan-days')) {
        const updateLoanPriceDisplay = () => {
            const bookTitle = elements.loanBookSelect.value;
            const days = parseInt(document.getElementById('loan-days').value, 10) || 0;
            const priceDisplay = document.getElementById('loan-book-price-display');
            if (!priceDisplay) return;

            if (!bookTitle || days < 1) {
                priceDisplay.textContent = 'Total Price: $0.00';
                return;
            }

            const book = appState.books.find(b => b.title === bookTitle);
            if (book) {
                const dailyRate = parseFloat(book.price) || 0;
                const total = dailyRate * days;
                priceDisplay.textContent = `Daily: $${dailyRate.toFixed(2)} | Total: $${total.toFixed(2)}`;
            } else {
                priceDisplay.textContent = 'Total Price: $0.00';
            }
        };

        elements.loanBookSelect.addEventListener('change', updateLoanPriceDisplay);
        document.getElementById('loan-days').addEventListener('input', updateLoanPriceDisplay);
    }
}

// --- DATA RENDERING [Requirement: Dynamic content updates] ---
function renderBooks() {
    elements.booksTable.innerHTML = '';
    elements.loanBookSelect.innerHTML = '<option value="">Select Book...</option>';

    const searchInput = document.getElementById('search-book');
    const filter = searchInput ? searchInput.value.toLowerCase() : '';

    let serialNumber = 1;

    // Optional: Sort so available books are at the top
    const sortedBooks = [...appState.books].sort((a, b) => {
        const availA = a.totalCopies - a.borrowed;
        const availB = b.totalCopies - b.borrowed;
        return availB - availA;
    });

    sortedBooks.forEach(book => {
        if (filter && !book.title.toLowerCase().includes(filter) && !book.author.toLowerCase().includes(filter)) {
            return;
        }

        const coverSrc = book.cover || 'https://via.placeholder.com/40x60?text=No+Cover';
        const available = book.totalCopies - book.borrowed;
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${serialNumber++}</td>
            <td class="book-cover-cell"><img src="${coverSrc}" alt="${book.title}" class="table-book-cover"></td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>$${book.price ? parseFloat(book.price).toFixed(2) : '0.00'}</td>
            <td>${book.totalCopies}</td>
            <td>${available}</td>
            <td><span class="status-badge ${available > 0 ? 'available' : 'unavailable'}">
                ${available > 0 ? 'Available' : 'Out of Stock'}
            </span></td>
            <td>
                <button class="edit-btn" onclick="openEditBookModal(${book.id})"><i class="fas fa-edit"></i></button>
            </td>
            <td>
                <button class="delete-btn" onclick="deleteBook(${book.id})"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;

        elements.booksTable.appendChild(row);

        if (available > 0) {
            const option = document.createElement('option');
            option.value = book.title;
            option.textContent = `${book.title} (${available} avail)`;
            elements.loanBookSelect.appendChild(option);
        }
    });
}

function renderBorrowers() {
    elements.borrowersTable.innerHTML = '';
    elements.loanBorrowerSelect.innerHTML = '<option value="">Select Member...</option>';

    const searchInput = document.getElementById('search-borrower');
    const filter = searchInput ? searchInput.value.toLowerCase() : '';

    let serialNumber = 1;
    let totalSum = 0;

    appState.borrowers.forEach(borrower => {
        if (filter && !borrower.name.toLowerCase().includes(filter) && !borrower.tell.toLowerCase().includes(filter)) {
            return;
        }

        const activeLoans = appState.loans.filter(l => l.borrowerId === borrower.id && l.status === 'Borrowed').length;
        const balanceValue = Math.abs(parseFloat(borrower.balance || 0));
        totalSum += balanceValue;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${serialNumber}</td>
            <td>${borrower.name}</td>
            <td>${borrower.tell || 'N/A'}</td>
            <td style="font-weight: 600; color: var(--primary-color);">
                $${balanceValue.toFixed(2)}
            </td>
            <td>${activeLoans}</td>
            <td>
                <button class="edit-btn" onclick="openEditBorrowerModal('${borrower.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        elements.borrowersTable.appendChild(row);

        serialNumber++;

        const option = document.createElement('option');
        option.value = borrower.id;
        option.textContent = `${borrower.name} (${borrower.id})`;
        elements.loanBorrowerSelect.appendChild(option);
    });

    // Update total sum in footer
    const totalSumEl = document.getElementById('borrowers-total-sum');
    if (totalSumEl) totalSumEl.textContent = `$${totalSum.toFixed(2)}`;
}

function renderLoans() {
    elements.loansTable.innerHTML = '';

    const searchInput = document.getElementById('search-loan');
    const filter = searchInput ? searchInput.value.toLowerCase() : '';

    let serialNumber = 1; // Initialize serial number counter

    appState.loans.forEach((loan) => {
        if (loan.status !== 'Borrowed') return;

        if (filter && !loan.bookTitle.toLowerCase().includes(filter) && !loan.borrowerId.toLowerCase().includes(filter)) {
            return;
        }

        const borrower = appState.borrowers.find(b => b.id === loan.borrowerId);
        const borrowerName = borrower ? borrower.name : 'Unknown';

        // Find book details for Author and Price
        const book = appState.books.find(b => b.title === loan.bookTitle);
        const author = book ? book.author : 'N/A';
        const price = book ? `$${parseFloat(book.price).toFixed(2)}` : 'N/A';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${serialNumber}</td>
            <td>${borrowerName}</td>
            <td>${loan.bookTitle}</td>
            <td>${author}</td>
            <td>${price}</td>
            <td>${loan.dueDate}</td>
            <td>
                <!-- Action Element: Return Button -->
                <button class="btn-sm" onclick="returnBook('${loan.id}')">Return</button>
            </td>
        `;
        elements.loansTable.appendChild(row);

        serialNumber++; // Increment serial number
    });
}

// Attach listeners for dynamic elements
document.addEventListener('DOMContentLoaded', () => {
    const sBook = document.getElementById('search-book');
    if (sBook) sBook.addEventListener('input', renderBooks);

    const sBorrower = document.getElementById('search-borrower');
    if (sBorrower) sBorrower.addEventListener('input', renderBorrowers);

    const sLoan = document.getElementById('search-loan');
    if (sLoan) sLoan.addEventListener('input', renderLoans);

    const sReceipt = document.getElementById('search-receipt');
    if (sReceipt) sReceipt.addEventListener('input', renderReceipts);

    const printBtns = document.querySelectorAll('.btn-print');
    printBtns.forEach(btn => btn.addEventListener('click', () => {
        // Set current date before printing
        updatePrintDates();
        window.print();
    }));
});

// Function to update print dates
function updatePrintDates() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const dateString = `Report Generated: ${now.toLocaleDateString('en-US', options)}`;

    // Update footer date elements (show in footer)
    const booksFooterDate = document.getElementById('books-footer-date');
    const borrowersFooterDate = document.getElementById('borrowers-footer-date');
    const circulationFooterDate = document.getElementById('circulation-footer-date');

    if (booksFooterDate) booksFooterDate.textContent = dateString;
    if (borrowersFooterDate) borrowersFooterDate.textContent = dateString;
    if (circulationFooterDate) circulationFooterDate.textContent = dateString;
    if (document.getElementById('receipts-footer-date')) document.getElementById('receipts-footer-date').textContent = dateString;

    // Clear header date elements (remove from header)
    const booksPrintDate = document.getElementById('books-print-date');
    const borrowersPrintDate = document.getElementById('borrowers-print-date');
    const circulationPrintDate = document.getElementById('circulation-print-date');

    if (booksPrintDate) booksPrintDate.textContent = '';
    if (borrowersPrintDate) borrowersPrintDate.textContent = '';
    if (circulationPrintDate) circulationPrintDate.textContent = '';
    if (document.getElementById('receipts-print-date')) document.getElementById('receipts-print-date').textContent = '';
}

function updateDashboard() {
    const totalBooks = appState.books.reduce((acc, book) => acc + book.totalCopies, 0);
    const activeLoans = appState.loans.filter(l => l.status === 'Borrowed').length;

    // Calculate Today's Loans
    const today = new Date().toLocaleDateString();
    const todayLoans = appState.loans.filter(l => l.loanDate === today && l.status === 'Borrowed').length;

    // Calculate Monthly Receipts (Income)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyIncome = appState.loans
        .filter(l => l.status === 'Paid')
        .reduce((total, loan) => {
            const loanDate = new Date(loan.loanDate);
            if (loanDate.getMonth() === currentMonth && loanDate.getFullYear() === currentYear) {
                return total + (parseFloat(loan.chargedAmount) || 0);
            }
            return total;
        }, 0);

    // Calculate Total Balance (Sum of all borrower balances)
    // Debt is represented as a negative number (-).
    const totalNetBalance = appState.borrowers.reduce((acc, b) => acc + (parseFloat(b.balance) || 0), 0);

    elements.totalBooksCount.textContent = totalBooks;
    elements.totalBorrowersCount.textContent = appState.borrowers.length;
    elements.activeLoansCount.textContent = activeLoans;
    elements.totalBalanceCount.textContent = `$${Math.abs(totalNetBalance).toFixed(2)}`;
    elements.todayLoansCount.textContent = todayLoans;
    elements.monthlyIncomeCount.textContent = `$${monthlyIncome.toFixed(2)}`;
}


function refreshAll() {
    if (!appState.isAuthenticated) return;
    renderBooks();
    renderBorrowers();
    renderLoans();
    renderReceipts();
    updateDashboard();
}

function renderReceipts() {
    if (!elements.receiptsTable) return;
    elements.receiptsTable.innerHTML = '';

    const filter = document.getElementById('search-receipt') ? document.getElementById('search-receipt').value.toLowerCase() : '';
    let serialNumber = 1;
    let totalSum = 0;

    // Use only 'Paid' status transactions for Receipts report
    const transactions = appState.loans.filter(l => l.status === 'Paid').reverse(); // Latest first

    transactions.forEach(loan => {
        const borrower = appState.borrowers.find(b => b.id === loan.borrowerId);
        const borrowerName = borrower ? borrower.name : 'Unknown';

        if (filter &&
            !loan.id.toLowerCase().includes(filter) &&
            !borrowerName.toLowerCase().includes(filter) &&
            !loan.bookTitle.toLowerCase().includes(filter)) {
            return;
        }

        const row = document.createElement('tr');
        const amount = parseFloat(loan.chargedAmount || 0);
        totalSum += amount;

        row.innerHTML = `
            <td>${serialNumber++}</td>
            <td style="font-family: monospace; font-weight: 600;">${loan.id}</td>
            <td>${borrowerName}</td>
            <td>${loan.bookTitle}</td>
            <td style="font-weight: 600;">$${amount.toFixed(2)}</td>
            <td>${loan.loanDate}</td>
            <td>
                <button class="receipt-btn" onclick="reprintReceipt('${loan.id}')">
                    <i class="fas fa-print"></i>
                </button>
            </td>
        `;
        elements.receiptsTable.appendChild(row);
    });

    // Update total sum in footer
    const totalSumEl = document.getElementById('receipts-total-sum');
    if (totalSumEl) totalSumEl.textContent = `$${totalSum.toFixed(2)}`;
}

window.reprintReceipt = function (loanId) {
    const loan = appState.loans.find(l => l.id === loanId);
    if (!loan) return;

    const borrower = appState.borrowers.find(b => b.id === loan.borrowerId);
    const book = appState.books.find(b => b.title === loan.bookTitle);

    if (borrower) {
        printReceipt(loan, borrower, book || {});
    }
};



// --- FORM HANDLING [Requirement: Input Validation & Events] ---

// Helper: Visual Validation Feedback
function showError(inputElement, message) {
    inputElement.classList.add('input-error');
    showToast(message, 'error');

    // Auto-remove error on next input
    inputElement.addEventListener('input', function () {
        this.classList.remove('input-error');
    }, { once: true });
}

// 1. Add Book
elements.addBookForm.addEventListener('submit', (e) => {
    e.preventDefault(); // [Requirement: Prevent logical data entry errors]

    const titleInput = document.getElementById('book-title');
    const authorInput = document.getElementById('book-author');
    const copiesInput = document.getElementById('book-copies');
    const priceInput = document.getElementById('book-price');
    const statusInput = document.getElementById('book-status');
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const price = parseFloat(priceInput.value);
    const status = statusInput.value;

    // Logic: If status is Out of Stock, copies become 0
    let copies = status === 'Out of Stock' ? 0 : parseInt(copiesInput.value, 10);

    // [Requirement: Validation - Empty fields]
    if (!title) return showError(titleInput, 'Book title is required.');
    if (!author) return showError(authorInput, 'Author name is required.');

    // [Requirement: Validation - Illogical data]
    if (isNaN(copies) || (status === 'Available' && copies < 1)) {
        return showError(copiesInput, 'Copies must be at least 1 for Available status.');
    }
    if (isNaN(price) || price < 0) return showError(priceInput, 'Price must be a valid number.');

    const existingBook = appState.books.find(b => b.title.toLowerCase() === title.toLowerCase());
    if (existingBook) {
        const wasOutOfStock = (existingBook.totalCopies - existingBook.borrowed) <= 0;

        if (status === 'Out of Stock') {
            existingBook.totalCopies = 0;
            existingBook.borrowed = 0;
        } else {
            existingBook.totalCopies += copies;
        }

        existingBook.price = price;

        if (wasOutOfStock && (existingBook.totalCopies - existingBook.borrowed) > 0) {
            addStockAlert(existingBook.title);
            showToast(`"${existingBook.title}" is now BACK IN STOCK!`, 'success');
        } else {
            showToast(`Updated "${existingBook.title}"`, 'success');
        }
        saveState();
    } else {
        appState.books.push({
            id: Date.now(),
            title,
            author,
            price,
            totalCopies: copies,
            borrowed: 0
        });
        saveState();
        showToast('New book added to collection.', 'success');
    }

    elements.addBookForm.reset();
    closeModal('modal-book'); // Close on success
    refreshAll();
});

// 2. Add Borrower
elements.addBorrowerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('borrower-name');
    const tellInput = document.getElementById('borrower-tell');
    const balanceInput = document.getElementById('borrower-balance');

    const name = nameInput.value.trim();
    const tell = tellInput.value.trim();
    const balance = parseFloat(balanceInput.value);

    // [Requirement: Validation - Empty fields]
    if (!name) return showError(nameInput, 'Borrower Name is required.');
    if (!tell) return showError(tellInput, 'Tell Number is required.');
    if (isNaN(balance)) return showError(balanceInput, 'Initial balance is required.');

    // Auto-generate ID internally
    const id = "LIB" + Date.now().toString().slice(-6);

    // If user enters a positive balance, treat it as debt (negative)
    // Unless they explicitly want to give credit, but for library debt is negative.
    const finalBalance = balance > 0 ? -balance : balance;

    appState.borrowers.push({ name, id, tell, balance: finalBalance });
    saveState();
    showToast('Member registered successfully.', 'success');
    elements.addBorrowerForm.reset();
    closeModal('modal-borrower'); // Close on success
    refreshAll();
});

// 3. Borrow Book
elements.loanForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const borrowerId = elements.loanBorrowerSelect.value;
    const bookTitle = elements.loanBookSelect.value;
    const daysInput = document.getElementById('loan-days');
    const days = parseInt(daysInput.value, 10);

    // [Requirement: Validation - Logical Checks]
    if (!borrowerId || !bookTitle) {
        showToast('Please select both a member and a book.', 'error');
        return;
    }
    if (isNaN(days) || days < 1) {
        return showError(daysInput, 'Loan duration must be at least 1 day.');
    }

    const book = appState.books.find(b => b.title === bookTitle);
    const borrower = appState.borrowers.find(b => b.id === borrowerId);

    // [Requirement: Validation - Business Logic]
    if (!book) {
        showToast('System Error: Book not found.', 'error');
        return;
    }
    if (!borrower) {
        showToast('System Error: Borrower not found.', 'error');
        return;
    }
    if (book.totalCopies - book.borrowed <= 0) {
        showToast('This book is currently unavailable.', 'error');
        return;
    }

    // Deduct Price from Borrower Balance [Requirement: Financial Logic - DAILY RATE]
    const dailyRate = parseFloat(book.price) || 0;
    const totalCharge = dailyRate * days; // Price is per day
    borrower.balance = (parseFloat(borrower.balance) || 0) - totalCharge;

    book.borrowed++;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    const loanId = 'ln_' + Date.now();
    const loanData = {
        id: loanId,
        bookTitle,
        borrowerId,
        loanDate: new Date().toLocaleDateString(),
        dueDate: dueDate.toLocaleDateString(),
        status: 'Borrowed',
        chargedAmount: totalCharge,
        dailyRate: dailyRate,
        days: days
    };

    // Add Loan
    appState.loans.push(loanData);

    saveState();
    showToast(`Book issued! $${totalCharge.toFixed(2)} charged to ${borrower.name}`, 'success');

    // Print Receipt
    printReceipt(loanData, borrower, book);

    elements.loanForm.reset();

    // Reset price display
    const priceDisplay = document.getElementById('loan-book-price-display');
    if (priceDisplay) priceDisplay.textContent = 'Total Price: $0.00';

    closeModal('modal-loan'); // Close on success
    refreshAll();
});

// 4. Manual Receipt Form - Autocomplete for Borrower Name
function initManualReceiptAutocomplete() {
    const nameInput = document.getElementById('man-rec-name');
    const suggestionsDiv = document.getElementById('man-rec-suggestions');

    if (!nameInput || !suggestionsDiv) return;

    let selectedIndex = -1;
    let filteredBorrowers = [];

    function filterBorrowers(query) {
        if (!query || query.length < 1) {
            return [];
        }
        const lowerQuery = query.toLowerCase();
        return appState.borrowers.filter(borrower => {
            const nameMatch = borrower.name.toLowerCase().includes(lowerQuery);
            const tellMatch = borrower.tell && borrower.tell.includes(query);
            const idMatch = borrower.id && borrower.id.toLowerCase().includes(lowerQuery);
            return nameMatch || tellMatch || idMatch;
        });
    }

    function renderSuggestions(borrowers) {
        suggestionsDiv.innerHTML = '';
        filteredBorrowers = borrowers;

        if (borrowers.length === 0) {
            suggestionsDiv.classList.remove('show');
            return;
        }

        borrowers.forEach((borrower, index) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = `${borrower.name.toUpperCase()} ${borrower.tell || ''}`;
            item.dataset.index = index;

            item.addEventListener('click', () => {
                selectBorrower(borrower);
            });

            item.addEventListener('mouseenter', () => {
                selectedIndex = index;
                updateHighlight();
            });

            suggestionsDiv.appendChild(item);
        });

        suggestionsDiv.classList.add('show');
        selectedIndex = -1;
    }

    function selectBorrower(borrower) {
        nameInput.value = borrower.name;
        suggestionsDiv.classList.remove('show');
        selectedIndex = -1;

        // Show current debt in receipt form
        const balDisplay = document.getElementById('man-rec-balance-display');
        if (balDisplay) {
            balDisplay.style.display = 'block';
            const bal = parseFloat(borrower.balance || 0);
            balDisplay.textContent = bal < 0
                ? `Current Debt: -$${Math.abs(bal).toFixed(2)}`
                : `Current Balance: $${bal.toFixed(2)}`;
            balDisplay.style.color = bal < 0 ? '#e74c3c' : '#27ae60';
        }

        nameInput.focus();
    }

    function updateHighlight() {
        const items = suggestionsDiv.querySelectorAll('.suggestion-item');
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('highlighted');
            } else {
                item.classList.remove('highlighted');
            }
        });
    }

    nameInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (!query) {
            const balDisplay = document.getElementById('man-rec-balance-display');
            if (balDisplay) balDisplay.style.display = 'none';
        }
        const matches = filterBorrowers(query);
        renderSuggestions(matches);
    });

    nameInput.addEventListener('keydown', (e) => {
        if (!suggestionsDiv.classList.contains('show')) return;

        const items = suggestionsDiv.querySelectorAll('.suggestion-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateHighlight();
            items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateHighlight();
            if (selectedIndex >= 0) {
                items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
            }
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            if (filteredBorrowers[selectedIndex]) {
                selectBorrower(filteredBorrowers[selectedIndex]);
            }
        } else if (e.key === 'Escape') {
            suggestionsDiv.classList.remove('show');
            selectedIndex = -1;
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!nameInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.classList.remove('show');
        }
    });
}

// 4. Manual Receipt Form
if (elements.manualReceiptForm) {
    elements.manualReceiptForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('man-rec-name').value.trim();
        const desc = document.getElementById('man-rec-desc').value.trim();
        const amount = parseFloat(document.getElementById('man-rec-amount').value);

        if (!name || isNaN(amount)) {
            showToast('Please fill in borrower name and amount.', 'error');
            return;
        }

        // Find borrower by name
        const borrower = appState.borrowers.find(b =>
            b.name.toLowerCase() === name.toLowerCase()
        );

        if (!borrower) {
            showToast('Borrower not found. Please select from suggestions.', 'error');
            return;
        }

        // Validation: Cannot pay more than what is owed
        const debt = Math.abs(borrower.balance);
        // Borrower.balance is negative for debt, so Math.abs gets the amount owed.
        if (amount > debt) {
            showToast(`Error: Member only owes $${debt.toFixed(2)}. You cannot pay $${amount.toFixed(2)}.`, 'error');
            return;
        }

        // Update borrower balance (add payment amount - reduces debt)
        borrower.balance = (parseFloat(borrower.balance) || 0) + amount;

        // Create receipt/loan entry
        const receiptId = 'REC-' + Date.now().toString().slice(-6);
        const manualData = {
            id: receiptId,
            bookTitle: desc || 'Manual Payment',
            borrowerId: borrower.id,
            loanDate: new Date().toLocaleDateString(),
            dueDate: 'N/A',
            status: 'Paid',
            chargedAmount: amount
        };

        // Save to loans (receipts are stored in loans array)
        appState.loans.push(manualData);
        saveState();

        // Print receipt
        printReceipt(manualData, borrower, {}, "OFFICIAL RECEIPT");

        // Show success message
        showToast(`Receipt created! Balance updated for ${borrower.name}`, 'success');

        elements.manualReceiptForm.reset();
        const balDisplay = document.getElementById('man-rec-balance-display');
        if (balDisplay) balDisplay.style.display = 'none';
        closeModal('modal-manual-receipt');

        // Refresh all views to show updated data
        refreshAll();
    });
}

function printReceipt(loan, borrower, book, title = "LOAN RECEIPT") {
    // Fill Receipt Template
    document.getElementById('rec-title').textContent = title;
    document.getElementById('rec-loan-id').textContent = loan.id || 'N/A';
    document.getElementById('rec-date').textContent = loan.loanDate || new Date().toLocaleDateString();

    // Append @motion to borrower name for receipts
    const displayName = borrower.name.includes('@motion') ? borrower.name : `${borrower.name} @motion`;
    document.getElementById('rec-borrower').textContent = displayName;

    document.getElementById('rec-member-id').textContent = borrower.id;
    document.getElementById('rec-book').textContent = loan.bookTitle || 'Account Summary';

    // For account statement, we might hide/change these
    const dailyRateEl = document.getElementById('rec-daily-rate');
    const durationEl = document.getElementById('rec-duration');
    const dueDateEl = document.getElementById('rec-due-date');

    if (loan.dailyRate) {
        dailyRateEl.parentElement.style.display = 'flex';
        dailyRateEl.textContent = `$${loan.dailyRate.toFixed(2)}`;
    } else {
        dailyRateEl.parentElement.style.display = 'none';
    }

    if (loan.days) {
        durationEl.parentElement.style.display = 'flex';
        durationEl.textContent = `${loan.days} Days`;
    } else {
        durationEl.parentElement.style.display = 'none';
    }

    document.getElementById('rec-due-date').textContent = loan.dueDate || 'N/A';
    document.getElementById('rec-total-amount').textContent = `$${parseFloat(loan.chargedAmount || 0).toFixed(2)}`;

    // Show, Print, Hide
    const rec = document.getElementById('loan-receipt');
    rec.style.display = 'block';

    // Wait for display to apply before printing
    setTimeout(() => {
        window.print();
        rec.style.display = 'none';
    }, 100);
}



window.printAccountStatement = function (borrowerId) {
    const borrower = appState.borrowers.find(b => b.id === borrowerId);
    if (!borrower) return;

    const activeLoans = appState.loans.filter(l => l.borrowerId === borrower.id && l.status === 'Borrowed');
    const loanCount = activeLoans.length;
    const loanSummary = loanCount > 0 ? `${loanCount} Active Loans` : 'No Active Loans';

    const statementData = {
        id: 'STMT-' + Date.now().toString().slice(-6),
        loanDate: new Date().toLocaleDateString(),
        bookTitle: loanSummary,
        dueDate: 'Check Records',
        chargedAmount: Math.abs(borrower.balance), // Total outstanding or current balance
    };

    printReceipt(statementData, borrower, {}, "ACCOUNT STATEMENT");
};

// Return Book Function (Global scope for onclick)
window.returnBook = function (loanId) {
    // [Requirement: Array Manipulation - Find by ID]
    const loan = appState.loans.find(l => l.id === loanId);
    if (!loan || loan.status === 'Returned') return;

    const book = appState.books.find(b => b.title === loan.bookTitle);
    if (book) {
        const wasOutOfStock = (book.totalCopies - book.borrowed) <= 0;
        book.borrowed--;
        if (wasOutOfStock && (book.totalCopies - book.borrowed) > 0) {
            addStockAlert(book.title);
            showToast(`"${book.title}" is now back in stock!`, 'success');
        } else {
            showToast('Book returned successfully.', 'success');
        }
    }

    loan.status = 'Returned';
    saveState();
    refreshAll();
};

window.deleteBook = function (bookId) {
    const bookIndex = appState.books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return;

    const book = appState.books[bookIndex];

    // Check if the book is currently borrowed
    const isBorrowed = appState.loans.some(l => l.bookTitle === book.title && l.status === 'Borrowed');

    if (isBorrowed) {
        showToast(`Cannot delete "${book.title}" because it is currently borrowed.`, 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
        appState.books.splice(bookIndex, 1);
        saveState();
        showToast(`"${book.title}" has been deleted.`, 'success');
        refreshAll();
    }
};

window.setBookStatus = function (bookId, status) {
    const book = appState.books.find(b => b.id === bookId);
    if (!book) return;

    if (status === 'Available') {
        const availableCount = book.totalCopies - book.borrowed;
        if (availableCount <= 0) {
            book.totalCopies = book.borrowed + 5;
            addStockAlert(book.title);
        }
    } else {
        book.totalCopies = book.borrowed;
    }

    saveState();
    refreshAll();
};

window.openEditBookModal = function (bookId) {
    const book = appState.books.find(b => b.id === bookId);
    if (!book) return;

    document.getElementById('edit-book-id').value = book.id;
    document.getElementById('edit-book-title').value = book.title;
    document.getElementById('edit-book-author').value = book.author;
    document.getElementById('edit-book-copies').value = book.totalCopies;
    document.getElementById('edit-book-price').value = book.price;
    document.getElementById('edit-book-status').value = 'Keep';

    openModal('modal-edit-book');
};

const editBookForm = document.getElementById('edit-book-form');
if (editBookForm) {
    editBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('edit-book-id').value);
        const title = document.getElementById('edit-book-title').value.trim();
        const author = document.getElementById('edit-book-author').value.trim();
        const copies = parseInt(document.getElementById('edit-book-copies').value);
        const price = parseFloat(document.getElementById('edit-book-price').value);
        const statusUpdate = document.getElementById('edit-book-status').value;

        const book = appState.books.find(b => b.id === id);
        if (book) {
            const wasOutOfStock = (book.totalCopies - book.borrowed) <= 0;

            book.title = title;
            book.author = author;
            book.price = price;

            if (statusUpdate === 'Available') {
                book.totalCopies = book.borrowed + 5;
            } else if (statusUpdate === 'Out of Stock') {
                book.totalCopies = book.borrowed;
            } else {
                book.totalCopies = copies;
            }

            if (wasOutOfStock && (book.totalCopies - book.borrowed) > 0) {
                addStockAlert(book.title);
            }

            saveState();
            showToast(`"${book.title}" updated successfully.`, 'success');
            closeModal('modal-edit-book');
            refreshAll();
        }
    });
}

window.openEditBorrowerModal = function (borrowerId) {
    const borrower = appState.borrowers.find(b => b.id === borrowerId);
    if (!borrower) return;

    document.getElementById('edit-borrower-id').value = borrower.id;
    document.getElementById('edit-borrower-name').value = borrower.name;
    document.getElementById('edit-borrower-tell').value = borrower.tell || '';
    document.getElementById('edit-borrower-balance').value = borrower.balance;

    openModal('modal-edit-borrower');
};

const editBorrowerForm = document.getElementById('edit-borrower-form');
if (editBorrowerForm) {
    editBorrowerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-borrower-id').value;
        const name = document.getElementById('edit-borrower-name').value.trim();
        const tell = document.getElementById('edit-borrower-tell').value.trim();
        const balance = parseFloat(document.getElementById('edit-borrower-balance').value);

        const borrower = appState.borrowers.find(b => b.id === id);
        if (borrower) {
            borrower.name = name;
            borrower.tell = tell;
            // Ensure even edited balance is negative if it represents debt
            borrower.balance = balance > 0 ? -balance : balance;

            saveState();
            showToast(`Borrower "${borrower.name}" updated successfully.`, 'success');
            closeModal('modal-edit-borrower');
            refreshAll();
        }
    });
}

// --- UTILS ---
function showToast(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Additional Styles for dynamic elements moved to CSS file ideally, but kept here for SPA simplicity
const style = document.createElement('style');
style.innerHTML = `
    .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    .status-badge.available {
        background-color: var(--primary-color);
        color: #ffffff;
    }
    .status-badge.unavailable {
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
        background-color: transparent;
    }
    .btn-sm {
        padding: 0.25rem 0.75rem;
        background-color: #ffffff;
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
    }
    .btn-sm:hover {
        background-color: var(--primary-color);
        color: #ffffff;
    }
    }
`;
document.head.appendChild(style);

// Initialize
initNavigation();

// Initialize autocomplete for manual receipt
document.addEventListener('DOMContentLoaded', () => {
    initManualReceiptAutocomplete();

    // Also initialize when modal opens (in case DOMContentLoaded already fired)
    const receiptModal = document.getElementById('modal-manual-receipt');
    if (receiptModal) {
        const observer = new MutationObserver(() => {
            if (receiptModal.classList.contains('open')) {
                // Re-initialize autocomplete when modal opens
                setTimeout(() => {
                    initManualReceiptAutocomplete();
                }, 100);
            }
        });
        observer.observe(receiptModal, { attributes: true, attributeFilter: ['class'] });
    }
});

// Check for active session on load
if (appState.isAuthenticated) {
    showApp();
} else {
    showLogin();
}

