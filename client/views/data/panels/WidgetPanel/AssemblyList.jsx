import React, { useState } from 'react';
import Pref from '/client/global/pref.js';

import CompForm from '/client/components/forms/CompForm';
import { MatchButton } from '/client/layouts/Models/Popover';

const AssemblyList = ({ variantData, doCmp, canRmv })=> {
  
  const [ addState, addSet ] = useState(false);
  const [ rmvState, rmvSet ] = useState(false);

  const vAssmbl = variantData.assembly.sort((p1, p2)=>
      p1.component < p2.component ? -1 : p1.component > p2.component ? 1 : 0 );
  
  function downloadComp(vID, vName) {
    Meteor.call('componentExport', widgetData._id, vID, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        const name = widgetData.widget + "_" + vName;
        const outputLines = reply.join('\n');
        const outputComma = reply.toString();
        toast(
          <a href={`data:text/plain;charset=UTF-8,${outputLines}`}
          download={name + ".txt"}>Download seperated by new lines</a>
          , {autoClose: false, closeOnClick: false}
        );
        toast(
          <a href={`data:text/plain;charset=UTF-8,${outputComma}`}
          download={name + ".csv"}>Download seperated by commas</a>
          , {autoClose: false, closeOnClick: false}
        );
      }
    });
  }
  
  function removeComp(compPN) {
    Meteor.call('pullCompV', variantData._id, compPN, (err)=>{
      err && console.log(err);
    });
  }
  
  return(
    <details open={false} className='wetasphaltBorder vmarginhalf'>
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
      
      {addState && <CompForm vID={variantData._id} /> }
      
      <div className='rowWrapR gapsC indentR vmarginquarter'>
        <MatchButton 
          doFunc={()=>downloadComp(v._id, v.variant)}
          text='Download'
          icon='fa-solid fa-download'
        />
        
        {doCmp &&
          <MatchButton 
            text='Add'
            icon='fa-solid fa-shapes'
            doFunc={()=>addSet(!addState)}
            lock={!doCmp}
          />
        }
        {canRmv &&
          <MatchButton 
            text='Cut'
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