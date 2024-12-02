import React, { useState, Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';
	        
const BatchXIncomplete = ({ batchData, seriesData, access })=> {
  
  const [ workingState, workingSet ] = useState(false);
  
  const [ doneScrap, doneScrapSet ] = useState(false);
  
  const [ remainScrap, remainScrapSet ] = useState(false);
  
  const [ unstartDelete, unstartDeleteSet ] = useState(false);
  const [ unstartScrap, unstartScrapSet ] = useState(false);
  
  const srsI = seriesData ? seriesData.items : [];
  const doneI = srsI.filter( i=> i.completed ).length;
  const runI = srsI.filter( i=> !i.completed && i.history.length > 0 ).length;
  const noI = srsI.filter( i=> !i.completed && i.history.length === 0 ).length;
  
  function handleForceFinish(e) {
    e.preventDefault();
    this.inFinGo.disabled = true;
    
    workingSet(true);
    
    const comm = this.fincomment.value.trim();
    const pinVal = this.orgPINgo.value;
    
    if(Roles.userIsInRole(Meteor.userId(), 'qa')) {
      Meteor.apply('FORCEfinishBatchX', 
        [ batchData._id, doneScrap, remainScrap, unstartDelete, unstartScrap, comm, pinVal ], 
        {wait: true},
        (error)=> {
          if(error) {
            console.log(error);
            toast.error('Server Error');
            workingSet(false);
          }
        }
      );
    }
  }
  
  if(!access) {
    return null;
  }
  
	return(
	  <ModelNative
      dialogId={batchData._id+'_incomplete_form'}
      title={`Force Finish Incomplete ${Pref.xBatch}`}
      icon='fa-solid fa-flag-checkered'
      colorT='darkOrangeT'>
	    
	  {workingState ?
      <div className='centre vmarginhalf'>
        <div>
          <p><n-num>{doneI}</n-num> Items Completed</p>
          <p><n-num>{runI}</n-num> Items In Progress</p>
          <p><n-num>{noI}</n-num> Items Unstarted</p>
        </div>
        <h4 className='centreText'>{batchData.completed ? <strong>{Pref.XBatch} Complete</strong> : <em>Resolving {Pref.XBatch}</em>}</h4>
      </div>
      :
	    
  	<form className='line2x overscroll' onSubmit={(e)=>handleForceFinish(e)}>
	    <p>Cut off the remaining flow and finish {Pref.xBatch}.
	      <b> This will result in an incomplete record.</b>
      </p>
      
      {doneI > 0 &&
        <Fragment>
          <p>What about the already <b>{doneI} Completed</b> {Pref.items}?
          <br />
            <label htmlFor='doneItmNone' className='beside gapR fitWide'>
              <input
                type='radio'
                id='doneItmNone'
                name='doneItems'
                defaultChecked={!doneScrap}
                onChange={()=>doneScrapSet(false)}
                required
              />Do Nothing to Completed {Pref.items}</label>
            <label htmlFor='doneItmScrap' className='beside gapR fitWide'>
              <input
                type='radio'
                id='doneItmScrap'
                name='doneItems'
                defaultChecked={false}
                onChange={()=>doneScrapSet(true)}
                required
              />Scrap Completed {Pref.items}</label>
          </p>
        </Fragment>
      }
      
      {runI > 0 &&
        <Fragment>
          <p>What about the <b>{runI} In Progress</b> {Pref.item}s?
          <br />
            <label htmlFor='runItmFin' className='beside gapR fitWide'>
              <input
                type='radio'
                id='runItmFin'
                name='runItems'
                defaultChecked={!remainScrap}
                onChange={()=>remainScrapSet(false)}
                required
              />Finish In Progress {Pref.items}</label>
            <label htmlFor='runItmScrp' className='beside gapR fitWide'>
              <input
                type='radio'
                id='runItmScrp'
                name='runItems'
                defaultChecked={false}
                onChange={()=>remainScrapSet(true)}
                required
              />Scrap In Progress {Pref.items}</label>
          </p>
        </Fragment>
      }
        
      {noI > 0 &&
        <Fragment>
          <p>What about the <b>{noI} Unstarted</b> {Pref.item}s?
          <br />
            <label htmlFor='noneItmDlt' className='beside gapR fitWide'>
              <input
                type='radio'
                id='noneItmDlt'
                name='noneItems'
                defaultChecked={false}
                onChange={()=>{ unstartScrapSet(false);unstartDeleteSet(true) }}
                required
              />Delete Unstarted {Pref.items}</label>
            <label htmlFor='noneItmFin' className='beside gapR fitWide'>
              <input
                type='radio'
                id='noneItmFin'
                name='noneItems'
                defaultChecked={false}
                onChange={()=>{ unstartScrapSet(false);unstartDeleteSet(false) }}
                required
              />Finish Unstarted {Pref.items}</label>
            <label htmlFor='noneItmFinScrp' className='beside gapR fitWide'>
              <input
                type='radio'
                id='noneItmFinScrp'
                name='noneItems'
                defaultChecked={false}
                onChange={()=>{ unstartScrapSet(true);unstartDeleteSet(false) }}
                required
              />Scrap Unstarted {Pref.items}</label>
          </p>
        </Fragment>
      }
      
      <p>What is the reason for an irregular finish?<br />
        <textarea
          id='fincomment'
          className='wide'
          placeholder='user discretion'
          rows='3'
          required></textarea>
      </p>
      
      <p><strong>This Action CANNOT be undone</strong>
        <input
          id='orgPINgo'
          autoComplete="false"
          className='noCopy miniIn12 interSelect centreText gap orangeHover'
          pattern='[\d\d\d\d]*'
          maxLength='4'
          minLength='4'
          placeholder='PIN'
          required />
        <button 
          type="submit"
          id='inFinGo'
          className='action orangeSolid blackT'
          disabled={false}
          >Finish {Pref.xBatch}</button>
      </p>
    </form>
    }
    </ModelNative>
  );
};

export default BatchXIncomplete;