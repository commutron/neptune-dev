

  if( Roles.userIsInRole(Meteor.userId(), 'nightly') ) {
    
    /*  
    window.addEventListener("message", function receiveMessage(event)
      {
        if (event.origin !== "https://neptune-dev-0-mattatcommutron.c9users.io/production")
          console.log('from the iframe');
      
        // ...
      }, false);
    */

    window.addEventListener('keypress', function onPress(event) {
      const inputKey = event.key;
      console.log(inputKey);
      const inputCode = event.keyCode;
      let scanListener = Session.get('scanListener') ? 
                         Session.get('scanListener') : 
                         '';
      if( inputKey ) {
        if( inputCode === 13 ) { // "enter"
          if(scanListener.length === 9 || scanListener.length === 10) {
            Session.set('now', scanListener);
          }
          scanListener = '';
        }else if( !inputKey.match(/[0-9]/) ) {
          scanListener = '';
        }else if( inputKey.match(/[0-9]/) ) {
          scanListener = scanListener.concat(event.key);
        }
        Session.set('scanListener', scanListener);
        event.preventDefault();
      }
    }, true);
  }