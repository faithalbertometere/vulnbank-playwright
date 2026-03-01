// Test user credentials — matches accounts created during manual testing
const USERS = {
  primary: {
    username: 'Ometee',
    password: '1234', // replace with actual password
  },
  secondary: {
    username: 'testVul2',
    password: 'Mylove_57', // replace with actual password
  },
};

const BASE_URL = 'https://vulnbank.org';

const VALID_IMAGE_URL = 'https://www.gstatic.com/webp/gallery/1.jpg';
const NON_IMAGE_URL   = 'https://google.com';
const INVALID_URL     = 'not a url';

module.exports = { USERS, BASE_URL, VALID_IMAGE_URL, NON_IMAGE_URL, INVALID_URL };
