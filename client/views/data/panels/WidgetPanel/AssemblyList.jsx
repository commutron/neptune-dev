import React, { useState } from 'react';
import Pref from '/client/global/pref.js';

import { MatchButton } from '/client/layouts/Models/Popover';

const AssemblyList = ({ variantData, canRmv })=> {
  
  const [ rmvState, rmvSet ] = useState(false);

  const vAssmbl = variantData.assembly.sort((p1, p2)=>
      p1.component < p2.component ? -1 : p1.component > p2.component ? 1 : 0 );
  
  function removeComp(compPN) {
    Meteor.call('pullCompV', variantData._id, compPN, (err)=>{
      err && console.log(err);
    });
  }
  
  return(
    <details open={false} className='blueBorder vmarginhalf'>
      <summary>
        <i className='cap'>{Pref.comp}s:</i>
        <i className='numFont gap'>{variantData.assembly.length}</i>
      </summary>
      
      <dl className='up readlines spacehalf autoGrid'>
        {vAssmbl.map((entry, index)=>{
          return(
            <dt key={index} className='letterSpaced'>
              {entry.component}
              {rmvState &&
                <button
                  className='miniAction redT'
                  onClick={()=>removeComp(entry.component)}
                  disabled={!canRmv}>
                <i className='fas fa-times fa-fw'></i></button>
              }
            </dt>
        )})}
      </dl>
      
      <div className='rowWrapR indentR vmarginquarter'>
        {canRmv &&
          <MatchButton 
            text='Cut Parts'
            icon='fa-solid fa-cut'
            doFunc={()=>rmvSet(!rmvState)}
            lock={!canRmv}
          />
        }
      </div>
    </details>
  );
};

export default AssemblyList;