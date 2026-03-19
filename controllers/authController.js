const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role } = req.body;
        if(!name || !email || !password || !role){
            return res.status(400).json({
                message: "Please input all your details"
            });
        }

        if(password !== confirmPassword){
            return res.status(403).json({
                message: "password didn't match"
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }   

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            name, 
            email, 
            password: hashedPassword, 
            role
        });

        const emailToken =  crypto.randomBytes(32).toString("hex");

        const hashToken = crypto
        .createHash("sha256")
        .update(emailToken)
        .digest("hex");

        user.emailVerificationToken = hashToken;
        user.emailVerificationExpire = Date.now() + 30 * 60 * 1000;
        user.confirmPassword = undefined;

        await user.save();

        res.status(201).json({ 
            message: 'User registered successfully, please verify your email', 
            emailToken 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifiedEmail = async(req, res)=>{
    try{
        const token  = req.params.token;

        const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")
        
        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpire: {$gt: Date.now()}
        })
        if(!user){
            return res.status(400).json({
                message: "link has expired"
            })
        }

        user.isVerfied = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;

        await user.save()

        res.status(201).json({
            message: "email verified, you can now login"
        })

    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "please input your details"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        if(!user.isVerfied){
            return res.status(400).json({
                message: "please verify your email, with the link sent to you"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials or Password' });
        }
        const token = jwt.sign({ 
            userId: user._id, 
            role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' });

        res.cookie("token", token,{
            httpOnly: true,
            secure: false, //use true for production level
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ 
            message: 'Login successful' 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const forgotPassword = async(req, res)=>{
    try{
        const {email} = req.body;
        if(!email){
            return res.status(400).json({
                message: "please input your email"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message: "no user found"
            });
        }
        //generate the random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        //hash the token before saving
        const hashToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

        user.passwordResetToken = hashToken;
        user.passwordResetExpire = Date.now() + 10 * 60 * 1000;

        await user.save()

        res.status(201).json({
            message: "Reset link generated",
            resetToken
        })

    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
};

const resetPassword = async(req, res)=>{
    try{
        const token = req.params.token;

        const hashToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

        const user = await User.findOne({
            passwordResetToken: hashToken,
            passwordResetExpire: {$gt: Date.now()}
        });

        if(!user){
            return res.status(400).json({
                message: "Token has expired"
            })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;

        await user.save();

        res.status(201).json({
            message: "password reset successful"
        })

    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

const updatePassword = async (req, res) => {
    try {
        const { userId } = req.userInfo;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid old password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedNewPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    updatePassword,
    forgotPassword,
    resetPassword,
    verifiedEmail
};


