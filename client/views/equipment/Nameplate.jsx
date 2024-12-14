import React from 'react';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';


const Nameplate = ({ eqId, equipData, isDebug, isEqSup })=> {
  
  const eq = equipData;
  
  return(
    <div>
      
      model
      
      serial number
      
      manufacture year
      
      parts
      
      official service
      
      3rd party service
      
      
    </div>
  );
};

export default Nameplate;