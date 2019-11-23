import React, { useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';
        
const TideLock = ({ currentLive, classSty, children, message })=> {
  useEffect(() => {
    if(!currentLive && message) {
      toast(`Read Only. Click 'START' to unlock \n
             (you can only be ${Pref.engaged} \n
             with one ${Pref.batch} at a time). \n
             Click 'SWITCH' to stop your current ${Pref.batch} \n
             and start this ${Pref.batch}. \n
             * If ${Pref.batch} is a "Batch+" ignore this message`, 
        {
          autoClose: false,
          position: toast.POSITION.BOTTOM_CENTER
      });
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
      <fieldset disabled={true} className={classSty || ''} style={sty}>
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

export default TideLock;