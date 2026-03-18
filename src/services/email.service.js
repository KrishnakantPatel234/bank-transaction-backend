import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});


// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendEmail = async(to , subject , text , html) => {
    try{
        const info = await transporter.sendMail({
            from : `"Backend  Ledger" <${process.env.EMAIL_USER}>`,
            to,         // list of receivers
            subject,        // subject line
            text,       // plain text body
            html        // html body
        });

        console.log("Mesage sent : %s", info.messageId);
        console.log("Preview URL : %s" , nodemailer.getTestMessageUrl(info));
    }
    catch(error){
        console.error("Error sending Email :" , error);
    }
}

async function sendRegistrationEmail(userEmail , name){
    const subject = "Welcome to Backend Ledger!";
    const text =`Hi ${name},

                We're excited to have you join WeCare. Your account has been successfully created and you're now part of our community.

                You can now start exploring everything our platform has to offer.

                If you have any questions, feel free to reach out.

                Best regards,
                Team WeCare`;

    const html = `
    <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:50px 20px;font-family:'Segoe UI',Arial,sans-serif;">

    <div style="max-width:600px;margin:auto;background:white;border-radius:18px;
    overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.2);">

        <div style="padding:40px 30px;text-align:center;">
        
        <div style="font-size:40px;margin-bottom:10px;">🚀</div>

        <h1 style="margin:0;font-size:28px;color:#333;">
            Welcome to Backend Ledger
        </h1>

        <p style="margin-top:10px;color:#777;font-size:15px;">
            The place where your backend journey begins.
        </p>

        </div>

        <div style="padding:0 40px 30px 40px;color:#444;line-height:1.7;font-size:15px;">

        <p>
            Hey <strong>${name}</strong> 👋
        </p>

        <p>
            Your account is officially live and you're now part of the
            <strong>Backend Ledger community</strong>.
        </p>

        <p>
            Time to explore the platform, build cool stuff, and level up your backend skills.
        </p>

        <div style="text-align:center;margin:40px 0;">

            <a href="#"
            style="
            background:linear-gradient(135deg,#667eea,#764ba2);
            color:white;
            padding:15px 34px;
            text-decoration:none;
            border-radius:999px;
            font-weight:600;
            font-size:15px;
            display:inline-block;
            box-shadow:0 10px 25px rgba(102,126,234,0.45);
            ">
            Start Building ⚡
            </a>

        </div>

        <div style="text-align:center;margin:30px 0;">
            <div style="height:1px;background:#eee;width:60%;margin:auto;"></div>
        </div>

        <p style="font-size:14px;color:#666;text-align:center;">
            If you ever get stuck, need help, or just want to say hi — we're here.
        </p>

        <p style="text-align:center;margin-top:20px;">
            <strong>Team Backend Ledger 💻</strong>
        </p>

        </div>

        <div style="background:#fafafa;padding:18px;text-align:center;font-size:12px;color:#999;">
        © ${new Date().getFullYear()} Backend Ledger • Built for developers
        </div>

    </div>
    </div>
    `;

    await sendEmail(userEmail , subject , text , html);
}

async function sendTransactionEmail(userEmail , name , amount , toAccount){

    const subject = "Transaction Successful!";

    const text = `Hi ${name},

    Your transaction has been successfully completed.

    Amount Transferred: ₹${amount}
    Recipient Account: ${toAccount}

    The amount has been securely processed and credited to the recipient's account.

    If you did not perform this transaction or notice anything unusual, please contact our support team immediately.

    Thank you for using Backend Ledger.

    Best regards,
    Team Backend Ledger`;

    const html = `
    <div style="background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);padding:50px 20px;font-family:'Segoe UI',Arial,sans-serif;">

    <div style="max-width:600px;margin:auto;background:white;border-radius:18px;
    overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.25);">

    <div style="padding:40px 30px;text-align:center;">

    <div style="font-size:42px;margin-bottom:10px;">✅</div>

    <h1 style="margin:0;font-size:26px;color:#333;">
    Transaction Completed
    </h1>

    <p style="margin-top:10px;color:#777;font-size:15px;">
    Your payment has been processed successfully.
    </p>

    </div>

    <div style="padding:0 40px 30px 40px;color:#444;line-height:1.7;font-size:15px;">

    <p>
    Hello <strong>${name}</strong> 👋
    </p>

    <p>
    We're happy to inform you that your recent transaction was completed successfully.
    </p>

    <div style="
    background:#f7f9fc;
    padding:20px;
    border-radius:12px;
    margin:25px 0;
    border:1px solid #eee;
    ">

    <p style="margin:6px 0;"><strong>Amount Sent:</strong> ₹${amount}</p>
    <p style="margin:6px 0;"><strong>Recipient Account:</strong> ${toAccount}</p>
    <p style="margin:6px 0;"><strong>Status:</strong> <span style="color:green;font-weight:600;">Successful</span></p>

    </div>

    <p>
    The funds have been securely transferred to the recipient's account.
    </p>

    <div style="text-align:center;margin:40px 0;">

    <a href="#"
    style="
    background:linear-gradient(135deg,#11998e,#38ef7d);
    color:white;
    padding:15px 34px;
    text-decoration:none;
    border-radius:999px;
    font-weight:600;
    font-size:15px;
    display:inline-block;
    box-shadow:0 10px 25px rgba(0,0,0,0.2);
    ">
    View Transaction
    </a>

    </div>

    <p style="font-size:14px;color:#666;text-align:center;">
    If this wasn't you, please contact our support team immediately.
    </p>

    <p style="text-align:center;margin-top:20px;">
    <strong>Team Backend Ledger 💚</strong>
    </p>

    </div>

    <div style="background:#fafafa;padding:18px;text-align:center;font-size:12px;color:#999;">
    © ${new Date().getFullYear()} Backend Ledger • Secure Transactions
    </div>

    </div>
    </div>
    `;

    await sendEmail(userEmail , subject , text , html);
}

async function sendTransactionFailureEmail(userEmail , name , amount , toAccount){
    const subject = "Transaction Failed";

    const text = `Hi ${name},

    Unfortunately, your recent transaction could not be completed.

    Attempted Amount: ₹${amount}
    Recipient Account: ${toAccount}

    The transaction was not processed and no amount has been deducted from your account.

    Please try again later or verify the recipient account details.

    If you continue to face issues or did not attempt this transaction, please contact our support team immediately.

    Thank you for using Backend Ledger.

    Best regards,
    Team Backend Ledger`;

    const html = `
    <div style="background:linear-gradient(135deg,#2c3e50,#4b6cb7);padding:50px 20px;font-family:'Segoe UI',Arial,sans-serif;">

    <div style="max-width:600px;margin:auto;background:white;border-radius:18px;
    overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.25);">

    <div style="padding:40px 30px;text-align:center;">

    <div style="font-size:42px;margin-bottom:10px;">❌</div>

    <h1 style="margin:0;font-size:26px;color:#333;">
    Transaction Failed
    </h1>

    <p style="margin-top:10px;color:#777;font-size:15px;">
    Your payment could not be processed.
    </p>

    </div>

    <div style="padding:0 40px 30px 40px;color:#444;line-height:1.7;font-size:15px;">

    <p>
    Hello <strong>${name}</strong> 👋
    </p>

    <p>
    We're sorry to inform you that your recent transaction could not be completed.
    </p>

    <div style="
    background:#fff5f5;
    padding:20px;
    border-radius:12px;
    margin:25px 0;
    border:1px solid #ffd6d6;
    ">

    <p style="margin:6px 0;"><strong>Attempted Amount:</strong> ₹${amount}</p>
    <p style="margin:6px 0;"><strong>Recipient Account:</strong> ${toAccount}</p>
    <p style="margin:6px 0;"><strong>Status:</strong> <span style="color:#e63946;font-weight:600;">Failed</span></p>

    </div>

    <p>
    The payment was not processed and your balance remains unchanged.
    </p>

    <div style="text-align:center;margin:40px 0;">

    <a href="#"
    style="
    background:linear-gradient(135deg,#ff4b2b,#ff416c);
    color:white;
    padding:15px 34px;
    text-decoration:none;
    border-radius:999px;
    font-weight:600;
    font-size:15px;
    display:inline-block;
    box-shadow:0 10px 25px rgba(0,0,0,0.2);
    ">
    Try Again
    </a>

    </div>

    <p style="font-size:14px;color:#666;text-align:center;">
    If this wasn't you, please contact our support team immediately.
    </p>

    <p style="text-align:center;margin-top:20px;">
    <strong>Team Backend Ledger ❤️</strong>
    </p>

    </div>

    <div style="background:#fafafa;padding:18px;text-align:center;font-size:12px;color:#999;">
    © ${new Date().getFullYear()} Backend Ledger • Secure Transactions
    </div>

    </div>
    </div>
    `;

    await sendEmail(userEmail , subject , text , html);
}

export {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
}
