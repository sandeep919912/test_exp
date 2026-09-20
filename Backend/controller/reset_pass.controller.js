import Sib from "sib-api-v3-sdk";
import User from "../models/user.model.js";
import ResetPass from "../models/reset_pass.model.js";
import bcrypt from "bcrypt";

const sendMail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    const request = await ResetPass.create({
      userId: user.id,
    });

    const EmailInstance = Sib.ApiClient.instance;
    const apiKey = EmailInstance.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "sandeeppandit919912@gmail.com",
      name: "Sandeep Pandit",
    };

    const receivers = [
      {
        email: email,
      },
    ];

    const resetUrl = `http://localhost:3000/api/reset-pass/verify-request/${request.id}`;

    const result = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Forgot Password Verification",
      htmlContent: `
        <h2>Forgot Password</h2>
        <p>Click the link below to reset your password.</p>

        <a href="${resetUrl}">
          ${resetUrl}
        </a>
      `,
    });

    return res.status(200).json({
      message: "Email sent successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Email sending failed",
      error: error.message,
    });
  }
};

const verifyFPrequest = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await ResetPass.findOne({
      where: {
        id,
        isActive: true,
      },
    });

    if (!result) {
      return res.status(404).send(`
        <h1>Invalid Reset Link</h1>
        <p>This password reset link is invalid or has already been used.</p>
      `);
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/reset-password/${id}`
    );

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server erro", error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const validReq = await ResetPass.findOne({
      where: {
        id,
        isActive: true,
      },
    });

    if (!validReq) {
      return res.status(404).json({
        message: "Invalid or expired reset link",
      });
    }

    const user = await User.findByPk(validReq.userId);

    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;

    await user.save();

    // 5. Deactivate reset request
    validReq.isActive = false;
    await validReq.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export { sendMail, verifyFPrequest, resetPassword };
