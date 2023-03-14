import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'

export default class AfterRegisterMail extends BaseMailer {
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  //public mailer = this.mail.use()

  /**
   * The prepare method is invoked automatically when you run
   * "AfterRegisterMail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.l
   */

  protected user: User;
  protected url: string;

  /*
  public AfterRegisterMail(user: User, url: string){
    this.user = user;
    this.url = url;
  }
  */

  public prepare(message: MessageContract) {
    message.subject('The email subject').from('admin@example.com').to('user@example.com')
  }
}
