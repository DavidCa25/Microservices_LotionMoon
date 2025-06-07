const Auth = require('../models/Auth');

exports.signUp = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new Auth({ username, password, email });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
}

exports.signIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Auth.findOne({ username, password });
        if (!user) {    
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'User signed in successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Error signing in' });   
    }
};

exports.logout = (req, res) => {
    res.status(200).json({ message: 'User logged out successfully' });
}