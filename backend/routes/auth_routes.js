const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ResetRequest = require('../models/reset_requests');
const send_mail = require('../nodemailer');
const { generateFromEmail} = require("unique-username-generator");
const secretKey = 'itztrending';
var ImageKit = require("imagekit");


router.post('/signup', async function (req, res) {
  try {
    const { email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword});
    user.username = generateFromEmail(email,4);

    var imagekit = new ImageKit({
      publicKey : "public_XcIFXHnzgkoLWIfPJzl+qE8tsC4=",
      privateKey : "private_Y6cSMS7UtC63QiQS4p5Z8GhOhdI=",
      urlEndpoint : "https://ik.imagekit.io/your_imagekit_id/"
  });


    const avatar = `https://api.multiavatar.com/${email}.png`

    const imagekitResponse = await imagekit.upload({
      file: avatar,
      fileName: `${user.username}.png`,
      folder: 'users'
    })

    user.profpic = imagekitResponse.url

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

    res.status(201).json(user);
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

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed. Please try Again' });
  }
});


router.get("/check-auth", async function(req,res) {
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

// router.get("/reset-password", async function(req,res) {
//   //Check if user exists

//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     return res.status(401).json({ error: 'No such user found' });
//   }

//   const token = crypto.randomBytes(32).toString('hex');

//   const resetRequest = new ResetRequest({
//     email: req.body.email,
//     token: token,
//   });

//   await resetRequest.save();

//   const resetLink = `https://itztrending.com/api/auth/reset-password/${token}`;

//   await send_mail(req.body.email, 'Password Reset Request', `Click the link below to reset your password:\n\n${resetLink}`);

// })

// router.get("/reset-password/:token", async function(req,res) {

// }
// )

module.exports = router;