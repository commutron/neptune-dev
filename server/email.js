Meteor.methods({
  
  // Server: Define a method that the client can call.

  sendEmail(to, from, subject, text) {
    // Make sure that all arguments are strings.
    // check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running, without
    // waiting for the email sending to complete.
    this.unblock();

    Email.send({ to, from, subject, text });
  }


// // Client: Asynchronously send an email.
// Meteor.call(
//   'sendEmail',
//   'Alice <alice@example.com>',
//   'bob@example.com',
//   'Hello from Meteor!',
//   'This is a test of Email.send.'
// );
  
  
});