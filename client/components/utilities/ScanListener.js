function reFocus() {
  if(document.visibilityState === 'visible' || document.hasFocus()) {
    const findBox = document.getElementById('lookup');
    findBox ? findBox.focus() : null;
  }else{null}
}

function onPress(event) {
  //console.log(event);
  const element = document.activeElement;
  if(element.id !== 'lookup' && element.id !== 'nestSerial') {
    const inputKey = event.key;
    const inputCode = event.keyCode;
    let scanListener = Session.get('scanListener') || '';
    if( inputKey ) {
      if( inputCode === 13 ) { // "enter"
        const slL = scanListener.length;
        if( slL === 9 || slL === 10 ) {
          !event.preventDefault ? null : event.preventDefault();
          Session.set('now', scanListener);
          document.getElementById('ncRefs').value = '';
          document.getElementById('lookup').value = '';
        }
        scanListener = '';
      }else if( !inputKey.match(/[0-9]/) ) {
        scanListener = '';
      }else if( inputKey.match(/[0-9]/) ) {
        scanListener = scanListener.concat(event.key);
      }
      //console.log(scanListener);
      Session.set('scanListener', scanListener);
    }
  }else{
    null;
  }
}

function onMessage(event) {
  if(event.data.orgin === 'pisces') {
    //console.log(event);
    onPress(event.data);
  }else{null}
}

export function ScanListenerUtility(user) {
  window.addEventListener('visibilitychange', reFocus);
  window.addEventListener('focus', reFocus);
  
  //navigator.usb ? console.log('WebUSB IS supported') : console.log('WebUSB NOT supported');
    
  //Meteor.setTimeout( ()=>{
    const autoScan = user.autoScan;
    if(autoScan === undefined) {
      const check = window.confirm('Would you like to use a barcode scanner from anywhere in this window?');
      Meteor.call('setAutoScan', check, (error)=> error && console.log(error));
    }else if(autoScan === false) {
      null;//console.log('auto window scanning OFF');
    }else{
      //console.log('auto window scanning ON');
      window.addEventListener('keydown', onPress);
      window.addEventListener('message', onMessage);
    }
  //},250);

}

export function ScanListenerOff() {
  window.removeEventListener('visibilitychange', reFocus);
  window.removeEventListener('focus', reFocus);
  window.removeEventListener('keypress', onPress);
  window.removeEventListener('message', onMessage);
  Session.set('scanListener', '');
}