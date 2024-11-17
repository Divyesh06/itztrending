const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate_request = require('../authenticate_request');
const crypto = require('crypto');
const ResetRequest = require('../models/reset_requests');
const send_mail = require('../nodemailer');
const multer = require('multer');
const { generateFromEmail } = require("unique-username-generator");
const secretKey = 'itztrending';
const ImageKit = require("imagekit");
const { send } = require('process');
const upload = multer();

async function upload_to_imagekit(file, filename, folder) {
  var imagekit = new ImageKit({
    publicKey: "public_XcIFXHnzgkoLWIfPJzl+qE8tsC4=",
    privateKey: "private_Y6cSMS7UtC63QiQS4p5Z8GhOhdI=",
    urlEndpoint: "https://ik.imagekit.io/itztrending/"
  });

  const imagekitResponse = await imagekit.upload({
    file: file,
    fileName: filename,
    folder: folder
  })

  return imagekitResponse.url
}


router.post('/signup', async function (req, res) {
  try {
    const { email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword });
    user.username = generateFromEmail(email, 4);

    const avatar = `https://api.multiavatar.com/${email}.png`

    user.profpic = await upload_to_imagekit(avatar, `${user.username}.png`, 'users')

    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
      expiresIn: '1y',
    });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please Try again' });
  }
});

router.post('/login', async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'This email does not exist' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
      expiresIn: '1y',
    });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed. Please try Again' });
  }
});


router.get("/check-auth", async function (req, res) {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const decodedToken = jwt.verify(token, secretKey);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Authentication failed. Please try Again' });
  }
})

router.post("/set_username_and_profpic", upload.single('profpic'), authenticate_request, async function (req, res) {
  try {
    const user = await User.findById(req.userData.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (req.body.username!=user.username) {
      if (!await check_username_availability(req.body.username)) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      user.username = req.body.username;
    }
    
    if (req.file) {
      user.profpic = await upload_to_imagekit(req.file.buffer.toString('base64'), req.file.originalname, 'users');
    }

    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile. Please try Again' });
  }
})

async function check_username_availability(username) {
  const user = await User.findOne({ username });
  return !user;
}

router.post("/check_username_availability", authenticate_request, async function (req, res) {
    const user = await User.findById(req.userData.userId);
    if (user.username == req.body.username) {
        res.status(200).json({ available: true });
        return
    }
    const username = req.body.username;
    const available = await check_username_availability(username);
    res.status(200).json({ available });
})

router.post("/reset-password", async function (req, res) {
  try {
    const email = req.body.email;
    const token = crypto.randomBytes(2).toString('hex').toUpperCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetRequest = new ResetRequest({ email, token });
    await resetRequest.save();

    send_mail(email, "Password Reset Request", `Please use the following token to reset your password: ${token}`)

    res.status(200).json({ message: 'Password reset request sent' });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send password reset request. Please try Again' });
  }
})

router.get("/logout", function (req, res) {
  res.clearCookie('authToken');
  res.status(200).json({ message: 'Logout successful' });
})

router.post("/check-reset-token", async function (req, res) {
  
  try {
    const token = req.body.token;
    const email = req.body.email;
    const new_password = req.body.password;

    const resetRequest = await ResetRequest.findOne({ email, token });

    if (!resetRequest) {
      return res.status(404).json({ error: 'Invalid token' });
    }

    //Token expires after 1 hour
    if (Date.now() - resetRequest.createdAt > 60 * 60 * 1000) {
      await ResetRequest.findOneAndDelete({ email, token });
      return res.status(400).json({ error: 'Token has expired' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = await bcrypt.hash(new_password, 10);

    await user.save();

    await ResetRequest.findOneAndDelete({ email, token });

    send_mail(email, "Password Reset Confirmation", `Your password has been reset successfully.`)

    res.status(200).json({ message: 'Password reset successful' });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reset password. Please try Again' });
  }
})

module.exports = router;