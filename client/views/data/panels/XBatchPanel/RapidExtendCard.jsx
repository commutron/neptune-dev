import React, { useState } from 'react';
import moment from 'moment';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ActionLink from '/client/components/tinyUi/ActionLink';
import ActionFunc from '/client/components/tinyUi/ActionFunc';

import NotesModule from '/client/components/bigUi/NotesModule';

import InfoEditBlock from '/client/components/forms/Rapid/InfoEditBlock';


const RapidExtendCard = ({ 
  batchData, hasSeries, rSetItems, widgetData, urlString,
  rapid, cal
})=> {
  
  function handleLive() {
    const check = window.confirm('Close Rapid');
    if(check) {
      if(rapid.live) {
        Meteor.call('setRapidClose', rapid._id, batchData._id, batchData.batch,
        (error, re)=>{
          error && console.log(error);
          re ? toast.success('success') : toast.error('unsuccessful');
        });
      }else{
         Meteor.call('setRapidOpen', rapid._id, batchData._id,
         (error, re)=>{
          error && console.log(error);
          re ? toast.success('success') : toast.error('unsuccessful');
        });
      }
    }
  }
  
  function handleRemove() {
    const check = window.confirm('Permanently Delete Extension??');
    
    if(check) {
      Meteor.call('deleteExtendRapid', rapid._id, batchData._id, 
      (error, re)=>{
        error && console.log(error);
        re ? toast.success('success') : toast.error('unsuccessful');
      });
    }
  }
  
  
  return(
    <div className='wAuto'>
     
          
      <div className='comfort vmarginhalf'>
        
        <div className='centreRow'>
          
          <span>
            {rapid.live ?
              <n-fa1><i className='fas fa-bolt fa-2x darkOrangeT'></i></n-fa1>
              :
              <n-fa2><i className='fas fa-power-off fa-2x'></i></n-fa2>
            }
          </span>
          <span className='big gapR'>{rapid.rapid}</span>
          
        </div>
      
      
        <div className='centreRow'>
          
          
          
          
            
          <ActionLink
            address={'/print/generallabel/' + 
                      rapid.rapid + urlString +
                      '&sales=' + 'Issue: ' + rapid.issueOrder +
                      '&quant=' + rapid.quantity }
            title='Print Label'
            icon='fa-print'
            color='blackT gap' />
          
          <ActionFunc
            doFunc={handleLive}
            title='Open'
            icon='fa-bolt'
            color='darkOrangeT gap'
            lockOut={rapid.live} />
          
          <ActionFunc
            doFunc={handleLive}
            title='Close'
            icon='fa-power-off'
            color='blackT gap'
            lockOut={!rapid.live} />  
          
          <ActionFunc
            doFunc={handleRemove}
            title='Delete'
            icon='fa-trash'
            color='redT gap'
            lockOut={!rapid.live || rSetItems > 0} />
          
            

        </div>
        
        
      </div>
      
      <div className='comfort'>
        
        <span>  
          <InfoEditBlock 
            rapidData={rapid}
            allQ={batchData.quantity}
            rSetItems={rSetItems}
            cal={cal} />
          
          <br /><hr />
          
          
          <NotesModule
            sourceId={rapid._id}
            noteObj={rapid.notes}
            editMethod='setRapidNote'
            cal={cal} />
            
        </span>
            
        
        <span>  
          
          <dl>
            <dt>Cascade</dt>
            {rapid.cascade.map( (e, ix)=>(
              <dd key={'cs'+ix}>{e.gate}</dd>
            ))}
          </dl>
          
          <dl>
            <dt>Whitewater</dt>
            {rapid.whitewater.map( (e, ix)=>(
              <dd key={'ww'+ix}>{e.step}</dd>
            ))}
          </dl>
          
          <dl>
            <dt>Auto NonCons</dt>
            {rapid.autoNC.map( (e, ix)=>(
              <dd key={'nc'+ix}>{e.type} - {e.ref}</dd>
            ))}
          </dl>
          
          <dl>
            <dt>Auto Shortfalls</dt>
            {rapid.autoSH.map( (e, ix)=>(
              <dd key={'sh'+ix}>{e.part} - {e.refs}</dd>
            ))}
          </dl>
          
        </span>
        
        
      </div>
    
    
    </div>
  );
};

export default RapidExtendCard;