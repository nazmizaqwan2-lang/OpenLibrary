
const API = "https://openlibrary.org/search.json";

// LOAD SAVED BOOKS
let myLibrary = JSON.parse(
    localStorage.getItem("myLibrary") || "[]"
);

// UPDATE BOOK COUNT
function updateCount() {
    document.getElementById("totalBooks").textContent =
        myLibrary.length;
}

// SEARCH OPEN LIBRARY
async function searchBooks() {
    const query = document.getElementById("searchInput").value.trim();
    const results = document.getElementById("results");

    if (!query) {
        results.textContent = "Please enter a keyword.";
        return;
    }

    results.textContent = "Searching books...";

    try {
        const response = await fetch(
            `${API}?q=${encodeURIComponent(query)}&limit=20`
        );

        if (!response.ok) throw new Error("API error");

        const data = await response.json();
        displayBooks(data.docs, results);

    } catch (error) {
        results.textContent = "Unable to connect to Open Library.";
    }
}

// DISPLAY BOOKS
function displayBooks(books, container) {
    container.innerHTML = "";

    if (!books || books.length === 0) {
        container.textContent = "No books found.";
        return;
    }

    books.forEach(book => {
        const title = book.title || "Unknown Title";
        const author = book.author_name?.join(", ") || "Unknown Author";
        const year = book.first_publish_year || "Unknown";

        const cover = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : "https://placehold.co/180x220?text=No+Cover";

        const card = document.createElement("div");
        card.className = "book";

        const img = document.createElement("img");
        img.src = cover;
        img.alt = title;

        const heading = document.createElement("h3");
        heading.textContent = title;

        const authorInfo = document.createElement("p");
        authorInfo.textContent = "Author: " + author;

        const yearInfo = document.createElement("p");
        yearInfo.textContent = "Year: " + year;

        const link = document.createElement("a");
        link.href = book.key
            ? `https://openlibrary.org${book.key}`
            : "https://openlibrary.org/";
        link.textContent = "View Book ↗";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        card.append(img, heading, authorInfo, yearInfo, link);
        container.appendChild(card);
    });
}

// ADD MANUAL BOOK
function addBook() {
    const title = document.getElementById("bookTitle").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const category = document.getElementById("bookCategory").value.trim();
    const cover = document.getElementById("bookCover").value.trim();

    if (!title || !author || !category) {
        alert("Please fill in all required fields.");
        return;
    }

    const book = {
        id: Date.now(),
        title,
        author,
        category,
        cover: cover || "https://placehold.co/180x220?text=No+Cover"
    };

    myLibrary.push(book);

    saveBooks();
    displayMyBooks();

    document.getElementById("bookTitle").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookCategory").value = "";
    document.getElementById("bookCover").value = "";

    alert("Book added successfully!");
}

// SAVE BOOKS
function saveBooks() {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

// DISPLAY MY BOOKS
function displayMyBooks() {
    const container = document.getElementById("myBooks");
    container.innerHTML = "";

    if (myLibrary.length === 0) {
        container.textContent = "No books added yet.";
    }

    myLibrary.forEach(book => {
        const card = document.createElement("div");
        card.className = "book";

        const img = document.createElement("img");
        img.src = book.cover;
        img.alt = book.title;

        const heading = document.createElement("h3");
        heading.textContent = book.title;

        const author = document.createElement("p");
        author.textContent = "Author: " + book.author;

        const category = document.createElement("p");
        category.textContent = "Category: " + book.category;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete Book";
        deleteBtn.onclick = () => deleteBook(book.id);

        card.append(img, heading, author, category, deleteBtn);
        container.appendChild(card);
    });

    updateCount();
}

// DELETE BOOK
function deleteBook(id) {
    if (!confirm("Delete this book?")) return;

    myLibrary = myLibrary.filter(book => book.id !== id);

    saveBooks();
    displayMyBooks();
}

// RECOMMENDATION DEMO
async function recommendBooks() {
    const interest = document.getElementById("interest").value.trim();
    const results = document.getElementById("recommendResults");

    if (!interest) {
        results.textContent = "Please enter your interest.";
        return;
    }

    results.textContent = "Finding recommended books...";

    try {
        const response = await fetch(
            `${API}?q=${encodeURIComponent(interest)}&limit=10`
        );

        if (!response.ok) throw new Error("API error");

        const data = await response.json();
        displayBooks(data.docs, results);

    } catch (error) {
        results.textContent = "Recommendation service unavailable.";
    }
}

// AI ASSISTANT DEMO
function sendMessage() {
    const input = document.getElementById("userMessage");
    const message = input.value.trim();

    if (!message) return;

    addMessage(message, "user");

    input.value = "";

    const reply = getAIResponse(message);

    addMessage(reply, "bot");
}

// DEMO CHAT RESPONSE
function getAIResponse(message) {
    const text = message.toLowerCase();

    if (text.includes("programming")) {
        return "Explore programming books about Python, JavaScript and computer science!";
    }

    if (text.includes("science")) {
        return "Try science books covering physics, biology and technology.";
    }

    if (text.includes("history")) {
        return "Explore history books from different countries and periods.";
    }

    if (text.includes("technology")) {
        return "I recommend books about AI, networking and cybersecurity.";
    }

    if (text.includes("hello") || text.includes("hi")) {
        return "Hello! Welcome to AI Smart Library. What would you like to read?";
    }

    return "Tell me your favourite subject and I will help you discover relevant books!";
}

// ADD CHAT MESSAGE
function addMessage(message, type) {
    const chat = document.getElementById("chatBox");

    const div = document.createElement("div");
    div.className = type;
    div.textContent = message;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// ENTER TO SEARCH
document.getElementById("searchInput")
    .addEventListener("keydown", event => {
        if (event.key === "Enter") searchBooks();
    });

// ENTER TO CHAT
document.getElementById("userMessage")
    .addEventListener("keydown", event => {
        if (event.key === "Enter") sendMessage();
    });

// LOAD SAVED BOOKS ON STARTUP
displayMyBooks();


