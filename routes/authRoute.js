const express = require('express');
const router = express.Router();

const { 
    register, 
    login, 
    updatePassword,
    forgotPassword, 
    resetPassword,
    verifiedEmail
} = require('../controllers/authController');
const {auth, logout} = require('../middlewares/authMiddleware');

router.post('/register', register);
router.get('/verify-email/:token', verifiedEmail )
router.post('/login', login);
router.put('/update-password', auth, updatePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/logout', logout)

module.exports = router;