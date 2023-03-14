'use strict'

const Task = use('Task')

class SendEmail extends Task {
  static get schedule () {
    return '0 0 1 * * *' // Run every day at 1:00 am
  }

  async handle () {
    // Code to send email
  }
}

module.exports = SendEmail
