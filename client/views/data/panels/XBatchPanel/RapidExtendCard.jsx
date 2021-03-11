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
import { FlowStepsWrap } from '/client/components/forms/Rapid/AddFlowSteps';
import { AddAutoNCwrap } from '/client/components/forms/Rapid/AddAutoNC';
import { AddAutoSHwrap } from '/client/components/forms/Rapid/AddAutoSH';
import AddFall from '/client/components/forms/Rapid/AddFall';


const RapidExtendCard = ({ 
  batchData, hasSeries, rSetItems, widgetData, vassembly, urlString,
  rapid, app, ncTypesCombo, user, editAuth, cal
})=> {
  
  function handleLive() {
    const check = window.confirm(rapid.live ? 'Close Rapid' : 'Open Rapid');
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
    <div className=''>
     
      <div className='comfort'>
        
        <div className='centreRow vmarginhalf'>
          
          <span>
            {rapid.live ?
              <n-fa1><i className='fas fa-bolt fa-2x darkOrangeT'></i></n-fa1>
              :
              <n-fa2><i className='fas fa-power-off fa-2x'></i></n-fa2>
            }
          </span>
          <span className='big gapR'>{rapid.rapid}</span>
          
        </div>
      
      
        <div className='centreRow vmarginhalf'>
            
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
            lockOut={!editAuth || rapid.live} />
          
          <ActionFunc
            doFunc={handleLive}
            title='Close'
            icon='fa-power-off'
            color='blackT gap'
            lockOut={!editAuth || !rapid.live} />  
          
          <ActionFunc
            doFunc={handleRemove}
            title='Delete'
            icon='fa-trash'
            color='redT gap'
            lockOut={!editAuth || !rapid.live || rSetItems > 0} />

        </div>
        
      </div>
      
      <div className='comfort gapsC vmarginhalf'>
        
        <span className='min200'>
          
          <InfoEditBlock 
            rapidData={rapid}
            allQ={batchData.quantity}
            rSetItems={rSetItems}
            editAuth={editAuth}
            cal={cal} />
        
          <NotesModule
            sourceId={rapid._id}
            noteObj={rapid.notes}
            editMethod='setRapidNote'
            cal={cal} />
          
        </span>
        
        <span className='min200'>
      
          <AddFall 
            rapidData={rapid}
            editAuth={editAuth} />
          
          <FlowStepsWrap 
            rapidData={rapid}
            hasSeries={hasSeries}
            rSetItems={rSetItems}
            editAuth={editAuth}
            app={app} />
          
          <AddAutoNCwrap
            rapidData={rapid}
            ncTypesCombo={ncTypesCombo} 
            user={user}
            editAuth={editAuth} />
          
          <AddAutoSHwrap
            rapidData={rapid}
            vassembly={vassembly || []}
            editAuth={editAuth} />
          
        </span>
        
      </div>
    
    </div>
  );
};

export default RapidExtendCard;