import * as nodemailer from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

export default class Mailer {
  private static instance: Mailer;
  private transporter: Mail;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.LDSOCIAL_USER,
        pass: process.env.LDSOCIAL_PASS
      }
    });
  }

  public static getInstance() {
    if (!Mailer.instance) {
      Mailer.instance = new Mailer();
    }

    return Mailer.instance;
  }

  public async sendMail(to, subject, text) {
    return await this.transporter.sendMail({
      from: process.env.LDSOCIAL_USER,
      to,
      subject,
      text
    });
  }
}