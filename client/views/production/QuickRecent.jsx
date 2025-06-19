import React from 'react';
import Pref from '/client/global/pref.js';

const QuickRecent = ({ user })=> {
  
  const tpl = user.tidepools || [];
  const rec = [...new Set(tpl)].filter( r => Pref.regex5.test(r));
  
  return(
    <div className='centre pop vmargin space min200 max250 minHeight darkCard blueGlow'>
      <p className='med wide bottomLine cap'>Recent {Pref.xBatchs}</p>
      <div className='rowWrap vmarginhalf'>
      {rec.length > 0 ?
        rec.map( (val, ix)=>(
          <button 
            key={ix}
            className='action whiteSolid margin5 letterSpaced spacehalf'
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