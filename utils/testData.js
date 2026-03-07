// Test user credentials — matches accounts created during manual testing

require('dotenv').config({ quiet: true });

const USERS = {
  primary: {
    username: process.env.username,
    password: process.env.password, // replace with actual password
  },
  secondary: {
    username: process.env.username2,
    password: process.env.password2, // replace with actual password
  },
};

const BASE_URL = 'https://vulnbank.org';

const VALID_IMAGE_URL = 'https://www.gstatic.com/webp/gallery/1.jpg';
const NON_IMAGE_URL   = 'https://google.com';
const INVALID_URL     = 'not a url';

module.exports = { USERS, BASE_URL, VALID_IMAGE_URL, NON_IMAGE_URL, INVALID_URL };
