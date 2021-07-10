Meteor.methods({
  
  sendEmail(to, from, subject, text) {
    const check = (val)=> typeof val === 'string';
    if(check(to) && check(from) && check(subject) && check(text)) {
      this.unblock();
      
      const bcc = 'matt@commutron.ca';
      
      Email.send({ to, bcc, from, subject, text });
      
      return true;
    }else{
      return false;
    }
  }
  
  
});