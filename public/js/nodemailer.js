import nodemailer from 'nodemailer';

export async function sendMail(email, designation, name) {
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: 'nia30207@gmail.com',
            pass: process.env.GMAIL_PASSCODE
        }
    });

    const mailOptions = {
        from:'nia30207@gmail.com',
        to: email,
        subject: 'Greetings ' + name,
        text: `Welcome to Easily! You have applied successfully for the role of ${designation} and will get notified on any further updates.`
    }

    try{
        const send = await transporter.sendMail(mailOptions);
    }catch(err){
        console.log("Error while sending mail", err);
        
    }
}