const {
  addBookHandler,
  getAllBookshandler,
  getBooksById,
  editBooksById,
  delBooksById,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookshandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBooksById,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBooksById,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: delBooksById,
  },
];

module.exports = routes;
