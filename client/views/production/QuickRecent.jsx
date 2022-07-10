import React from 'react';
import Pref from '/client/global/pref.js';

const QuickRecent = ({ user })=> {
  
  const tpl = user.tidepools || [];
  const rec = [...new Set(tpl)];
  
  return(
    <div className='centre pop vmargin space min200 max875'>
      <p className='med wide bottomLine'>Recent {Pref.xBatchs}</p>
      <div className='centreRow vmarginhalf'>
      {rec.length > 0 ?
        rec.map( (val, ix)=>(
          <button 
            key={ix}
            className='action whiteSolid margin5'
            onClick={()=>Session.set('now', val)}
          >{val}</button>
        ))
      : <p className='centreText'>No Recent Found</p>
      }
    </div>
   </div>
  );
};

export default QuickRecent;