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
  
  const autoScan = user.autoScan;
  
  const wikiwin = document.getElementById('instruct');
  wikiwin && wikiwin.contentWindow.document.addEventListener('focus',function(){
    // console.log("contentWindow listener");
  });

  if(!autoScan) {
    // console.log('auto window scanning OFF');
    null;
  }else{
    // console.log('auto window scanning ON');
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

function onRead(event) {
  const element = document.activeElement;
  if(element.id !== 'allowKeyboard') {
    event.stopPropagation();
    const inputKey = event.key;
    const inputCode = event.keyCode;
    let scanListener = Session.get('scanListener') || '';
    if( inputKey ) {
      if( inputCode === 13 ) { // "enter"
        if( scanListener.length >= 8 && scanListener.length <= 14 ) {
          !event.preventDefault ? null : event.preventDefault();
          Session.set('now', scanListener);
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

export function ScanListenLiteUtility() {
  // console.log('auto window scanning ON');
  window.addEventListener('keydown', onRead);
}

export function ScanListenLiteOff() {
  window.removeEventListener('keydown', onRead);
  Session.set('scanListener', '');
}