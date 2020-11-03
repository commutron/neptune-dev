import React from 'react';
// import moment from 'moment';
// import 'moment-timezone';
// import Pref from '/client/global/pref.js';

import TotalInQu from './cards/TotalInQu';


const Outlook = ({ 
  bCache, pCache, brCache, zCache,
  user, app, isNightly
})=> {

    
  return(
    <div className='space5x5 forceScrollStyle'>
        
        
      <div className='balance numFont letterSpaced overscroll'>
           
          <TotalInQu
            pCache={pCache}
            brCache={brCache}
            app={app} />
        
      </div>
    </div>
  );
};

export default Outlook;