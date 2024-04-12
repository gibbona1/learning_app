const User = require('../models/user'); // Adjust the path as necessary
const Session = require('../models/session'); // Adjust the path as necessary
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ message: 'Login failed: User not found.' });
    }
    
    // Compare submitted password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Login failed: Incorrect password.'});
    }

    const session = new Session({ userId: user._id });
    await session.save();

    // If password matches, handle the successful login
    // E.g., generate a JWT token or set a session cookie here
    res.status(200).json({ message: 'Login successful', id: user._id, role: user.role, sessionId: session._id});
    // Remember to replace this with actual session handling/token generation
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during the login process.' });
  }
};