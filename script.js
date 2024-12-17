
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0743273565",
        coverImage: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
        description: "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
        available: true,
        dateAdded: new Date("2023-01-15")
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0446310789",
        coverImage: "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg",
        description: "The story of racial injustice and the loss of innocence in the American South.",
        available: true,
        dateAdded: new Date("2023-02-20")
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        isbn: "978-0451524935",
        coverImage: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
        description: "A dystopian novel about totalitarianism and surveillance society.",
        available: true,
        dateAdded: new Date("2023-03-10")
    }
];

let currentUser = null;

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(sectionId).classList.remove('hidden');
    
    document.querySelectorAll('nav button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`button[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

async function renderBooks(booksToRender = books) {
    showLoading();
    
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.innerHTML = '';
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    booksToRender.forEach((book, index) => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.style.animationDelay = `${index * 0.1}s`;
        
        const adminActions = currentUser?.role === 'admin' ? `
            <div class="book-card-actions visible">
                <button onclick="deleteBook(${book.id})" class="delete-btn" title="Delete Book">
                    <i class="fas fa-trash"></i>
                </button>
                <button onclick="toggleAvailability(${book.id})" class="toggle-btn" title="${book.available ? 'Mark as Unavailable' : 'Mark as Available'}">
                    <i class="fas fa-exchange-alt"></i>
                </button>
            </div>
        ` : '';

        bookCard.innerHTML = `
            ${adminActions}
            <img src="${book.coverImage}" alt="${book.title}" 
                 onerror="this.src='https://via.placeholder.com/300x400?text=No+Cover+Available'">
            <div class="book-card-content">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
                <p class="description">${book.description || 'No description available.'}</p>
                <p class="status ${book.available ? 'available' : 'unavailable'}">
                    ${book.available ? 'Available' : 'Not Available'}
                </p>
            </div>
        `;
        booksGrid.appendChild(bookCard);
    });
    
    hideLoading();
}

function filterAndSortBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const availability = document.getElementById('filterAvailability').value;
    const sortBy = document.getElementById('sortBy').value;
    
    let filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm) ||
                            book.isbn.includes(searchTerm);
        
        const matchesAvailability = availability === 'all' || 
                                  (availability === 'available' && book.available) ||
                                  (availability === 'unavailable' && !book.available);
        
        return matchesSearch && matchesAvailability;
    });
    
    filteredBooks.sort((a, b) => {
        switch(sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'author':
                return a.author.localeCompare(b.author);
            case 'date':
                return b.dateAdded - a.dateAdded;
            default:
                return 0;
        }
    });
    
    renderBooks(filteredBooks);
}

document.getElementById('searchInput').addEventListener('input', filterAndSortBooks);
document.getElementById('filterAvailability').addEventListener('change', filterAndSortBooks);
document.getElementById('sortBy').addEventListener('change', filterAndSortBooks);

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    try {
        if (email === 'pawan@gmail.com' && password === 'pawan123') {
            currentUser = { email, role: 'admin' };
            
            const addBookBtn = document.getElementById('addBookBtn');
            if (addBookBtn) {
                addBookBtn.style.display = 'inline-flex';
                addBookBtn.classList.remove('hidden');
                addBookBtn.classList.add('visible');
            }
            
            document.getElementById('loginBtn').classList.add('hidden');
            document.getElementById('signupBtn').classList.add('hidden');
            document.getElementById('logoutBtn').classList.remove('hidden');
            
            showSection('home');
            showToast('Logged in successfully!');
            renderBooks();
        } else {
            showToast('Invalid credentials', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Login failed', 'error');
    }
});

function logout() {
    currentUser = null;
    const addBookBtn = document.getElementById('addBookBtn');
    if (addBookBtn) {
        addBookBtn.style.display = 'none';
        addBookBtn.classList.add('hidden');
        addBookBtn.classList.remove('visible');
    }
    document.getElementById('loginBtn').classList.remove('hidden');
    document.getElementById('signupBtn').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
    
    showToast('Logged out successfully!');
    showSection('home');
    renderBooks();
}

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = e.target[2].value;
    const confirmPassword = e.target[3].value;
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    showToast('Account created successfully!');
    showSection('login');
});

document.getElementById('addBookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newBook = {
        id: books.length + 1,
        title: e.target[0].value,
        author: e.target[1].value,
        isbn: e.target[2].value,
        coverImage: e.target[3].value,
        description: e.target[4].value,
        available: true,
        dateAdded: new Date()
    };
    
    books.push(newBook);
    renderBooks();
    showSection('home');
    showToast('Book added successfully!');
    e.target.reset();
});

function toggleAvailability(bookId) {
    if (!currentUser?.role === 'admin') {
        showToast('Only administrators can change book availability', 'error');
        return;
    }

    const book = books.find(b => b.id === bookId);
    if (book) {
        book.available = !book.available;
        renderBooks();
        showToast(`Book marked as ${book.available ? 'available' : 'unavailable'}`);
    }
}

function updateUIForUserRole() {
    const addBookBtn = document.getElementById('addBookBtn');
    
    if (currentUser?.role === 'admin') {
        if (addBookBtn) {
            addBookBtn.style.display = 'inline-flex';
            addBookBtn.classList.remove('hidden');
            addBookBtn.classList.add('visible');
        }
        document.getElementById('loginBtn').classList.add('hidden');
        document.getElementById('signupBtn').classList.add('hidden');
        document.getElementById('logoutBtn').classList.remove('hidden');
    } else {
        if (addBookBtn) {
            addBookBtn.style.display = 'none';
            addBookBtn.classList.add('hidden');
            addBookBtn.classList.remove('visible');
        }
        document.getElementById('loginBtn').classList.remove('hidden');
        document.getElementById('signupBtn').classList.remove('hidden');
        document.getElementById('logoutBtn').classList.add('hidden');
    }
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#themeToggle i');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('#themeToggle i');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }
}

function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSavedTheme();
    renderBooks();
    updateUIForUserRole();
});

function deleteBook(bookId) {
    if (!currentUser?.role === 'admin') {
        showToast('Only administrators can delete books', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete this book?')) {
        const index = books.findIndex(book => book.id === bookId);
        if (index !== -1) {
            books.splice(index, 1);
            renderBooks();
            showToast('Book deleted successfully!');
        }
    }
}
  