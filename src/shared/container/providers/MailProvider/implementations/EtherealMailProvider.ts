import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IMessage {
  to: string;
  body: string;
}

class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      this.client = transporter;
    });
  }

  public async sendMail(to: string, body: string): Promise<void> {
    const message = {
      from: 'Equipe GoBarber <equipe@gobarber.com>',
      to,
      subject: 'Password Recovery GoBarber',
      text: body,
    };

    const messageSent = await this.client.sendMail(message);
    console.log('Message sent: %s', messageSent.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(messageSent));
  }
}

export default EtherealMailProvider;
