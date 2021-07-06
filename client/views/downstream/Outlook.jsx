import React from 'react';
// import moment from 'moment';
// import 'moment-timezone';
// import Pref from '/client/global/pref.js';

import TotalInQu from './cards/TotalInQu';

const Outlook = ({ 
  traceDT,
  user, app, isNightly
})=> {

  return(
    <div className='space5x5 forceScrollStyle'>
        
      <div className='autoFlex numFont letterSpaced overscroll'>
          <TotalInQu
            traceDT={traceDT}
            app={app} />
        
      </div>
    </div>
  );
};

export default Outlook;