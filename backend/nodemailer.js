const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'itztrending1@gmail.com',  
    pass: 'fhdx eaks ykdi qtdc'  
  }
});
function send_mail(to, subject, text) {
        let mailOptions = {
            from: 'itztrending1@gmail.com',
            to: to,
            subject: subject,
            text: text
        }
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });      
}


module.exports = send_mail