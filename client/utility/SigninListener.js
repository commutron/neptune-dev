function onBarcodePress(event) {
  !event.preventDefault ? null : event.preventDefault();
  Session.set('signinError', '');
  
  let signinListener = Session.get('signinListener') || '';
  
  const thisEvent = event.currentTarget;
  let turnOff = ()=> thisEvent.upFunc(false);
  
  const inputKey = event.key;
  const inputCode = event.keyCode;
  
  const element = document.activeElement;
  if( inputKey &&
     element.id !== 'loginUsername' && 
     element.id !== 'loginPassword' && 
     element.id !== 'loginSubmit' &&
     element.id !== 'newUsername' && 
     element.id !== 'choicePassword' && 
     element.id !== 'confirmPassword' &&
     element.id !== 'organizationName' && 
     element.id !== 'orgPin' && 
     element.id !== 'createSubmit'
  ) {
    
    if( inputCode === 13 ) {
      
      const slL = signinListener.length;
      
      if(slL > 9) {
        
        const useE = signinListener.split(",");
        let utf8decoder = new TextDecoder();
        let u8arr = new Uint8Array(useE);
        const decode = utf8decoder.decode(u8arr);
    
        if(!decode) {
          console.error('utf8decoder was unable to decode the array provided');
          Session.set('signinError', 'Barcode cannot be decoded');
          turnOff();
        }else{
          const cut2 = decode.split("<+>");
          
          const usrnm = cut2[0];
          const psswrd1 = cut2[1];
          
          if(typeof usrnm === 'string' && typeof psswrd1 === 'string') {
            Meteor.loginWithPassword(usrnm, psswrd1, (error)=>{
        	    if(error) {
        	      console.error(`SERVER ERROR : ${error}`);
                Session.set('signinError', error.reason);
                turnOff();
        	    }else{
        	    	Meteor.logoutOtherClients();
        	    }
        	  });
          }else{
            console.error(`invalid decoded string = ${usrnm}, ${psswrd1}`);
            Session.set('signinError', 'Barcode does not contain a username and password');
            turnOff();
          }
        }
        signinListener = '';
      }
    }else if( !inputKey.match(/[0-9\,]/) ) {
      
      signinListener = '';
      turnOff();
      
    }else if( inputKey.match(/[0-9\,]/) ) {
      
      signinListener = signinListener.concat(event.key);
      event.currentTarget.upFunc(true);
    }
    Session.set('signinListener', signinListener);
  }else{
    null;
  }
}


export function SigninListenerUtility(loginSet) {
  const source = window;
  source.addEventListener('keydown', onBarcodePress);
  source.upFunc = loginSet;
}

export function SigninListenerOff() {
  window.removeEventListener('keydown', onBarcodePress);
}