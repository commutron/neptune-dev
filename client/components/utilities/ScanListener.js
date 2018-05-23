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
          !event.preventDefault ? null : event.preventDefault();
        }
        scanListener = '';
      }else if( !inputKey.match(/[0-9]/) ) {
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

function onMessage(event) {
  if(event.data.orgin === 'pisces') {
    console.log(event);
    onPress(event.data);
  }else{null}
}

export function ScanListenerUtility(user) {
  window.addEventListener('visibilitychange', reFocus);
  window.addEventListener('focus', reFocus);
  
  Meteor.setTimeout( ()=>{
    const autoScan = user.autoScan;
    if(autoScan === undefined) {
      const check = window.confirm('Would you like to use a barcode scanner from anywhere in this window?');
      Meteor.call('setAutoScan', check, (error)=> error && console.log(error));
    }else if(autoScan === false) {
      null;//console.log('auto window scanning OFF');
    }else{
      //console.log('auto window scanning ON');
      window.addEventListener('keypress', onPress);
      window.addEventListener('message', onMessage);
    }
  },100);

}

export function ScanListenerOff() {
  window.removeEventListener('visibilitychange', reFocus);
  window.removeEventListener('focus', reFocus);
  window.removeEventListener('keypress', onPress);
  window.removeEventListener('message', onMessage);
  Session.set('scanListener', '');
}