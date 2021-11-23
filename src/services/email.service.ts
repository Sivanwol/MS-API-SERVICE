import Mailgun  from 'mailgun.js'
import FormData from 'form-data';
import sendgrid from '@sendgrid/mail';
import { IKeyValueObject, IMailerData, MailerData } from '@/constraints/mailerData';
const mailgunIns = new Mailgun(FormData)

export class EmailService {
  private readonly mailConnection = mailgunIns.client({
    username:process.env.MAILGUN_USER ,
    key: process.env.MAILGUN_API_KEY,
    public_key: process.env.MAILGUN_PUBLIC_KEY
  });
  public async sendEmail(toSent:string,key: string , data:IMailerData): Promise<void> {
    const metaData = MailerData[key];
    if (!metaData) throw new Error(`Meta data key ${key} has no template defined`)
    if (!this.validateEmail(toSent)) throw new Error(`Unable sent email as to ${toSent} it not an valid email`)
    const mailerParams  =this.GetKeyValueObject(data.dataParams)
    const titleKeyValueParams = this.GetKeyValueObject(data.titleParams)
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: process.env.MAIL_FROM,
      from: toSent,
      templateId: metaData.template,
      dynamicTemplateData: {
        subject: metaData.title(titleKeyValueParams),
        ...mailerParams
      },
    };
    console.log(msg)
    await sendgrid.send(msg)
    // mailgun impl
    // const mailerSettings = {
    //   from: process.env.MAILGUN_FROM,
    //   to: toSent,
    //   subject: metaData.title(titleKeyValueParams),
    //   template: metaData.template,
    //   'h:X-Mailgun-Variables': JSON.stringify(mailerParams)
    // }
    // await this.mailConnection.messages.create(process.env.MAILGUN_DOMAIN, mailerSettings)
  }
  private GetKeyValueObject(data:IKeyValueObject[]) {
    const returnValue = {}
    for (const item of data) {
      returnValue[item.key] = item.value
    }
    return returnValue
  }
  private validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
