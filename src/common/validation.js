const { validate: isValidUUID } = require('uuid');

function validateUUID(id) {
    return isValidUUID(id);
}

function validateEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
}

module.exports = {
    validateUUID,
    validateEmail
};
