
function onPress(event) {
  const element = document.activeElement;
  if(element.id !== 'lookup' || element.id !== 'nestSerial') {
    const inputKey = event.key;
    console.log(inputKey);
    const inputCode = event.keyCode;
    let scanListener = Session.get('scanListener') ? 
                       Session.get('scanListener') : 
                       '';
    if( inputKey ) {
      if( inputCode === 13 ) { // "enter"
        const slL = scanListener.length;
        if( slL === 9 || slL === 10 ) {
          Session.set('now', scanListener);
          event.preventDefault();
        }
        scanListener = '';
      }else if( !inputKey.match(/[0-9]/) || inputCode === 8 ) {
        scanListener = '';
      }else if( inputKey.match(/[0-9]/) ) {
        scanListener = scanListener.concat(event.key);
      }
      Session.set('scanListener', scanListener);
    }
  }else{
    null;
  }
}
      
export function ScanListenerUtility() {
    
    /*  
    window.addEventListener("message", function receiveMessage(event)
      {
        if (event.origin !== "https://neptune-dev-0-mattatcommutron.c9users.io/production")
          console.log('from the iframe');
      
        // ...
      }, false);
    */
    
  if( Roles.userIsInRole(Meteor.userId(), 'nightly') ) {
    document.addEventListener('keypress', onPress);
  }else{
    null;
  }
}

export function ScanListenerOff() {
  document.removeEventListener('keypress', onPress);
}