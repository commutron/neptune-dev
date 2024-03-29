import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';

import CompForm from '/client/components/forms/CompForm';
import ActionFunc from '/client/components/tinyUi/ActionFunc';

const AssemblyList = ({ variantData, widgetData, groupData })=> {
  
  const [ rmvState, rmvSet ] = useState(false);
  
  const v = variantData;
  const w = widgetData;

  const vAssmbl = v.assembly.sort((p1, p2)=>
      p1.component < p2.component ? -1 : p1.component > p2.component ? 1 : 0 );
  
  function tgglRemove() {
    rmvSet(!rmvState);
  }
  
  function removeComp(compPN) {
      Meteor.call('pullCompV', v._id, compPN, (err)=>{
        err && console.log(err);
      });
  }
  
  function downloadComp() {
    Meteor.call('componentExport', w._id, v._id, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        const name = w.widget + "_" + v.variant;
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
  
  return(
    <details open={false} className='blueBorder vmarginhalf'>
      <summary>
        <i className='cap'>{Pref.comp}s:</i>
        <i className='numFont gap'>{v.assembly.length}</i>
      </summary>
      
      <dl className='up readlines spacehalf'>
        {vAssmbl.map((entry, index)=>{
          return(
            <dt key={index} className='letterSpaced'>
              {entry.component}
              {rmvState &&
                <button
                  className='miniAction redT'
                  onClick={()=>removeComp(entry.component)}
                  disabled={!Roles.userIsInRole(Meteor.userId(), 'remove')}>
                <i className='fas fa-times fa-fw'></i></button>
              }
            </dt>
        )})}
      </dl>
      
      <span className='balancer vmarginhalf'>
        
        <CompForm 
          vID={variantData._id}
          lockOut={!v.live} 
        />
        
        {Roles.userIsInRole(Meteor.userId(), 'remove') &&
          <ActionFunc
            doFunc={tgglRemove}
            title='Cut Parts'
            icon='fas fa-cut'
            color='redT gap'
            lockOut={false}
          />
        }
        
        <ActionFunc
          doFunc={downloadComp}
          title='Download'
          icon='fas fa-download'
          color='blackT gap'
          lockOut={false} />
          
      </span>
    </details>
  );
};

export default AssemblyList;