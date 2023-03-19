import * as express from 'express'
const sgMail = require('@sendgrid/mail')

export const sendMessage = async (req: any, res: any, next: any) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_KEY)    
    let dynamic_template_data = {
      subject: "Thank you for contacting us",
      your_subject: req.body.subject,
      your_message: req.body.message,
      name: req.body.name,
    };

    const body = {
      from: "shants.tech@gmail.com",
      to: req.body.email,
      dynamic_template_data: dynamic_template_data,
      templateId: 'd-063e4ae7048b4ddd96779443dbde99b7',
    }
    await sgMail.send(body);

    res.json({ success: true });
  } catch (err) {
    next(err)
  }
}

const router = express.Router()

router.post('/', sendMessage)

export default router
