import React from 'react';
import { toast } from 'react-toastify';
import './style.css';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

import UserNice from '/client/components/smallUi/UserNice';

const RapidBlock = ({ 
  rapIs, rapidsData, seriesId, serial, done, cal, canRmv, canFin
})=> {
  
  function popRapid() {
    Meteor.call('unsetRapidFork', seriesId, serial, rapIs.rapId, (error, reply)=>{
      error && console.log(error);
      reply ? toast.success(`${Pref.rapidExn} removed`) : toast.error('Not Allowed');
    });
  }
  
  const rapDo = rapidsData.find( x => x._id === rapIs.rapId );
  const rarapid = rapDo ? rapDo.rapid : rapIs ? rapIs.rapId : '___';
  const raissue = rapDo ? rapDo.issueOrder : '___';
  const rawater = rapDo ? rapDo.whitewater : null;
  const rafinsh = rawater ? rawater.find(w=> w.type === 'finish') : null;
  const rafinky = rafinsh ? rafinsh.key : null;
  
  function finRapid() {
    Meteor.call('finishExRapid', seriesId, serial, rapIs.rapId, rafinky, (error, reply)=>{
      error && console.log(error);
      reply ? toast.success(`${Pref.rapidExn} complete`) : toast.error('Not Allowed');
    });
  }
  
  return(
    <n-feed-info-block class='rapid'>
      <n-feed-left-anchor>
        <i className='fa-solid fa-bolt fa-lg fa-fw' 
          title='Extend'
        ></i>
      </n-feed-left-anchor>
      <n-feed-info-center>
        <n-feed-info-title class='cap'>
          <span>{rarapid}</span>
          <span>{raissue}</span>
          <span>{cal(rapIs.assignedAt)}</span>
        </n-feed-info-title>
        {rapIs.completed && 
          <p>
            Completed {cal(rapIs.completedAt)} by <UserNice id={rapIs.completedWho} />
          </p>}
      </n-feed-info-center>
      <n-feed-right-anchor>
        <ContextMenuTrigger
          id={rarapid+'rapid'}
          attributes={{ 
            className: 'miniAction',
            disabled: rapIs.completed || !rapDo.live
          }}
          holdToDisplay={1}
          renderTag='button'>
          <i className='fa-solid fa-ellipsis-v fa-lg fa-fw'></i>
        </ContextMenuTrigger>
        
        <ContextMenu id={rarapid+'rapid'} className='noCopy'>
          <MenuItem onClick={()=>finRapid()} disabled={!canFin}
          ><i className='fas fa-check-circle fa-fw purpleT gapR'></i>Finish {Pref.rapidExn}</MenuItem>
          <MenuItem onClick={()=>popRapid()} disabled={!canRmv}
          ><i className='fas fa-ban fa-fw gapR'></i>Cancel {Pref.rapidExn}</MenuItem>
        </ContextMenu>
      </n-feed-right-anchor>
    </n-feed-info-block>
  );
};

export default RapidBlock;