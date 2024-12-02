import React from 'react';
import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';

import ActionConf from '/client/components/tinyUi/ActionConf';

import NotesModule from '/client/components/bigUi/NotesModule';

import RapidInfoEdit from '/client/components/forms/Rapid/RapidInfo';
import { FlowStepsWrap } from '/client/components/forms/Rapid/AddFlowSteps';
import { AddAutoNCwrap } from '/client/components/forms/Rapid/AddAutoNC';
import { AddAutoSHwrap } from '/client/components/forms/Rapid/AddAutoSH';
import AddFall from '/client/components/forms/Rapid/AddFall';
import RemoveRapid from '/client/components/forms/Rapid/RemoveRapid';


const RapidExtendCard = ({ 
  batchData, hasSeries, rSetItems, widgetData, vassembly, urlString,
  rapid, rOpenid, app, ncTypesCombo, user, editAuth, cal
})=> {
  
  function handleLive() {
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
  
  return(
    <div>
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
            
          <button
            title='Print Label'
            className='transparent'
            onClick={()=>FlowRouter.go('/print/generallabel/' +
                      rapid.rapid + urlString +
                      '&sales=' + 'Issue: 🗲' + rapid.issueOrder +
                      '&quant=' + rapid.quantity)}>
            <label className='navIcon actionIconWrap'>
              <i className='fa-solid fa-print fa-lg blackT gap' aria-hidden='true'></i>
              <span className='actionIconText blackT gap'>Print Label</span>
            </label>
          </button>
          
          <ActionConf
            key={rapid.rapid+'open'}
            id={rapid.rapid+'open'}
            doFunc={handleLive}
            title='Open'
            confirm={'Open ' + Pref.rapidExn}
            icon='fas fa-bolt'
            color='darkOrangeT gap'
            lockOut={!editAuth || rOpenid || rapid.live} />
            
          <ActionConf
            key={rapid.rapid+'close'}
            id={rapid.rapid+'close'}
            doFunc={handleLive}
            title='Close'
            confirm={'Close ' + Pref.rapidExn}
            icon='fas fa-power-off'
            color='blackT gap'
            lockOut={!editAuth || !rapid.live} />
          
          <RemoveRapid
            batchId={batchData._id}
            rapidId={rapid._id}
            lockOut={!editAuth || !rapid.live || rSetItems > 0} 
          />

        </div>
        
      </div>
      
      <div className='comfort gapsC vmarginhalf'>
        
        <span className='min200 max250'>
          
          <RapidInfoEdit 
            batchId={batchData._id}
            rapid={rapid}
            allQ={batchData.quantity}
            rSetItems={rSetItems}
            rootURL={app.instruct}
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
            rSetItems={rSetItems}
            user={user}
            editAuth={editAuth} />
          
          <AddAutoSHwrap
            rapidData={rapid}
            vassembly={vassembly || []}
            rSetItems={rSetItems}
            editAuth={editAuth} />
          
        </span>
        
      </div>
    
    </div>
  );
};

export default RapidExtendCard;