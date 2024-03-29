import React, { useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';
        
const TideFormLock = ({ 
  currentLive, children, 
  message, caution, radioactive, holding
})=> {
  
  useEffect(() => {
    if(!currentLive && message) {
      // toast(`Click 'START' to unlock.
      // Click 'SWITCH' to stop your current ${Pref.xBatch} and start this ${Pref.xBatch}.
      // (Only one ${Pref.xBatch} can be ${Pref.engaged} at a time).`, 
      //   {
      //     autoClose: false,
      //     className: 'medSm',
      //     position: toast.POSITION.BOTTOM_CENTER
      // });
      if(caution) {
        toast.warn(`${Pref.XBatch} is ${Pref.released} with a ${Pref.shortfall}`, 
        {
          autoClose: false,
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
      if(radioactive) {
        toast.warn(`${Pref.widget} ${Pref.variant} ${Pref.radio.toUpperCase()} 💥`, 
        {
          autoClose: false,
          className: 'cap darkOrangeI',
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
      if(holding) {
        toast.warn(`${Pref.xBatch} is ${Pref.isHold}`, 
        {
          autoClose: false,
          className: 'cap wetasphaltI',
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  }, []);
  
  let sty = {
    padding: '0',
    margin: '0',
    border: 'none',
    filter: 'grayscale(0.5)'
  };
  
  if(!currentLive) {
    return(
      <fieldset disabled={true} style={sty}>
        <Fragment>
          {children}
        </Fragment>
      </fieldset>
    );
  }else{
    toast.dismiss();
    return(
      <Fragment>
        {children}
      </Fragment>
    );
  }
};

export default TideFormLock;