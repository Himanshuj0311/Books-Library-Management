// Fetch all books from the backend API
let allBooks = [];
let currentPage = 1;
const itemsPerPage = 4;

// Fetch and initialize books
fetch('http://localhost:3000/api/books')
  .then(res => res.json())
  .then(data => {
    allBooks = data;
    renderBooks();
  })
  .catch(err => console.error('Error fetching books:', err));

// Render books based on current state
function renderBooks() {
  const searchQuery = document.getElementById('search-input').value.toLowerCase();
  const selectedGenre = document.getElementById('genre-filter').value;

  const filteredBooks = allBooks.filter(book =>
    (book.title.toLowerCase().includes(searchQuery) ||
     book.author.toLowerCase().includes(searchQuery)) &&
    (selectedGenre === '' || book.genre === selectedGenre)
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  currentPage = Math.min(currentPage, totalPages || 1); // Prevent overflow

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  const container = document.getElementById('book-list');
  container.innerHTML = '';

  if (paginatedBooks.length === 0) {
    container.innerHTML = '<p style="text-align:center;">No books found.</p>';
  }

  paginatedBooks.forEach(book => {
    const div = document.createElement('div');
    div.className = 'book-item';
    div.innerHTML = `
      <div class="book-item-crad">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre || 'N/A'}</p>
        <p><strong>ISBN:</strong> ${book.isbn || 'N/A'}</p>
        <button class="fertilisation-btn" onclick="deletBook(${book.id})">Delete</button>
        <button class="view-details-btn" onclick="viewBookDetails(${book.id})">View Book Details</button>
      </div>
    `;
    container.appendChild(div);
  });

  // Update pagination info
  document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
}

// Pagination functions
function nextPage() {
  currentPage++;
  renderBooks();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderBooks();
  }
}


document.getElementById('search-input').addEventListener('input', () => {
  currentPage = 1;
  renderBooks();
});

document.getElementById('genre-filter').addEventListener('change', () => {
  currentPage = 1;
  renderBooks();
});


  // Example function to open a popup
  function viewBookDetails(bookId) {
    fetch(`http://localhost:3000/api/books/${bookId}`)
      .then(res => res.json())
      .then(books => {
       // const book = books.find(b => b.id === bookId); // Find the specific book
  
        if (!books) {
          alert('Book not found');
          return;
        }
  
        // Create popup
        const popup = document.createElement('div');
        popup.classList.add('popup');
  
        const content = `
          <div class="popup-content">
            <h2>${books.title}</h2>
            <p><strong>Author:</strong> ${books.author}</p>
            <p><strong>Genre:</strong> ${books.genre || 'N/A'}</p>
            <p><strong>ISBN:</strong> ${books.isbn || 'N/A'}</p>
            <button onclick="closePopup()">Close</button>
          </div>
        `;
  
        popup.innerHTML = content;
        document.body.appendChild(popup);
      })
      .catch(err => {
        console.error('Error fetching book details:', err);
      });
  }
  
  // Close popup function
  function closePopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
      popup.remove();
    }
  }
  
  // Function to close the popup
  function closePopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
      popup.remove();
    }
  }
  
  function deletBook(bookId) {
    const confirmDelete = confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;
  
    fetch(`http://localhost:3000/api/books/${bookId}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to delete book');
      }
      // Remove the deleted book from the array
      allBooks = allBooks.filter(book => book.id !== bookId);
      renderBooks(); // Re-render the list
    })
    .catch(err => {
      console.error('Error deleting book:', err);
      alert('Failed to delete the book.');
    });
  }
  