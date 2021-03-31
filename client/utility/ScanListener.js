function reFocus() {
  if(document.visibilityState === 'visible' || document.hasFocus()) {
    const findBox = document.getElementById('lookup');
    findBox ? findBox.focus() : null;
  }else{null}
}

function onPress(event) {
  // console.log(event);
  const element = document.activeElement;
  if(element.id !== 'lookup' && element.id !== 'nestSerial' && element.id !== 'ncRefs') {
    const inputKey = event.key;
    const inputCode = event.keyCode;
    let scanListener = Session.get('scanListener') || '';
    if( inputKey ) {
      if( inputCode === 13 ) { // "enter"
        const slL = scanListener.length;
        if( slL >= 8 && slL <= 14 ) {
          !event.preventDefault ? null : event.preventDefault();
          Session.set('now', scanListener);
          document.getElementById('ncRefs') ?
            document.getElementById('ncRefs').value = '' : null;
          document.getElementById('lookup').value = '';
        }
        scanListener = '';
      }else if( !inputKey.match(/[0-9]/) ) {
        scanListener = '';
      }else if( inputKey.match(/[0-9]/) ) {
        scanListener = scanListener.concat(event.key);
      }
      // console.log(scanListener);
      Session.set('scanListener', scanListener);
    }
  }else{
    null;
  }
}

function onMessage(event) {
  if(event.data.keyCode !== undefined) {
    console.log(event);
    onPress(event.data);
  }
}

export function ScanListenerUtility(user) {
  window.addEventListener('visibilitychange', reFocus);
  window.addEventListener('focus', reFocus);
  // navigator.usb ? console.log('WebUSB IS supported') : 
                  // console.log('WebUSB NOT supported');
    
  const autoScan = user.autoScan;
  // if(autoScan === undefined) {
  //   const check = window.confirm('Would you like to use a barcode scanner from anywhere in this window?');
  //   Meteor.call('setAutoScan', check, (error)=> error && console.log(error));
  
  const wikiwin = document.getElementById('instruct');
  wikiwin && wikiwin.contentWindow.document.addEventListener('focus',function(){
    console.log("contentWindow listener");
  });

  if(!autoScan) {
    console.log('auto window scanning OFF');
  }else{
    console.log('auto window scanning ON');
    window.addEventListener('keydown', onPress);
    window.addEventListener('message', onMessage);
  }

}

export function ScanListenerOff() {
  window.removeEventListener('visibilitychange', reFocus);
  window.removeEventListener('focus', reFocus);
  window.removeEventListener('keydown', onPress);
  window.removeEventListener('message', onMessage);
  Session.set('scanListener', '');
}