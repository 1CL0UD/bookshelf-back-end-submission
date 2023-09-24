const { nanoid } = require('nanoid');
const books = require('./books');

// eslint-disable-next-line consistent-return
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllBookshandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let bookList = [...books];

  if (reading !== undefined) {
    const isReading = parseInt(reading, 10) === 1;
    bookList = bookList.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
    const isFinished = parseInt(finished, 10) === 1;
    bookList = bookList.filter((book) => book.finished === isFinished);
  }

  if (name) {
    const nameLower = name.toLowerCase();
    // prettier-ignore
    bookList = bookList.filter((book) => book.name.toLowerCase().includes(nameLower));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: bookList.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBooksById = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);

  return response;
};

const editBooksById = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const book = books.findIndex((b) => b.id === bookId);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  if (book === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const updatedAt = new Date().toISOString();

  books[book] = {
    ...books[book],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const delBooksById = (request, h) => {
  const { bookId } = request.params;

  const book = books.findIndex((b) => b.id === bookId);

  if (book === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(book, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);

  return response;
};

module.exports = {
  addBookHandler,
  getAllBookshandler,
  getBooksById,
  editBooksById,
  delBooksById,
};
