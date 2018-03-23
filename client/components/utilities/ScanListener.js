function reFocus() {
  if(document.visibilityState === 'visible' || document.hasFocus()) {
    const findBox = document.getElementById('lookup');
    findBox ? findBox.focus() : null;
  }else{null}
}

function onPress(event) {
  const element = document.activeElement;
  if(element.id !== 'lookup' && element.id !== 'nestSerial') {
    const inputKey = event.key;
    const inputCode = event.keyCode;
    let scanListener = Session.get('scanListener') || '';
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
  window.addEventListener('visibilitychange', reFocus);
  window.addEventListener('focus', reFocus);
  
  Meteor.setTimeout( ()=>{
    const autoScan = Meteor.user().autoScan;
    autoScan === undefined ? console.log(autoScan) : null;
    if(!autoScan) {
      null;
    }else{
      window.addEventListener('keypress', onPress);
      
      var pisces = document.getElementsByTagName("iframe")[0];
      if(pisces) {
        pisces.contentWindow.addEventListener('keypress', (event)=>{
          console.log(event);
        });
      }else{null}
      
    }
  },150);
  /*
  window.addEventListener('keypress', (event)=>{
    window.parent.postMessage('event,key', "*");
  });
  
  window.addEventListener("message", function receiveMessage(event)
    {
      if (event.origin !== "https://192.168.1.68:8000")
        console.log('from the iframe');
      // ...
    }, false);
  */
}

export function ScanListenerOff() {
  window.removeEventListener('visibilitychange', reFocus);
  window.removeEventListener('focus', reFocus);
  window.removeEventListener('keypress', onPress);
  Session.set('scanListener', '');
}