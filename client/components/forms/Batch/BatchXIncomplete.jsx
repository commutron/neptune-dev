import React, { useState, Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium';

const BatchXIncomplete = ({ batchData, seriesData, app, lockOut, noText })=> (
  <ModelMedium
    button='Force Finish'
    title={`Force Finish Incomplete ${Pref.xBatch}`}
    color='darkOrangeT'
    icon='fa-flag-checkered'
    lock={!Roles.userIsInRole(Meteor.userId(), ['qa', 'admin']) || lockOut}
    noText={noText}>
    <BatchXIncompleteForm
      batchData={batchData}
      seriesData={seriesData}
      app={app} />
	</ModelMedium>
);

export default BatchXIncomplete;     
	        
const BatchXIncompleteForm = ({ batchData, seriesData, app, selfclose })=> {
  
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
    
    toast.warn('Please Wait For Confirmation...', {
      toastId: ( batchData._id + 'FORCE' ),
      autoClose: false
    });
    
    const comm = this.fincomment.value.trim();
    const pinVal = this.orgPINgo.value;
    
    if(Roles.userIsInRole(Meteor.userId(), 'qa')) {
      Meteor.call('FORCEfinishBatchX', batchData._id, 
        doneScrap, remainScrap, unstartDelete, unstartScrap, comm, pinVal,
      (error, reply)=> {
        if(error)
          console.log(error);
        if(reply) {
          toast.update(( batchData._id + 'FORCE' ), {
            render: `${Pref.xBatch} Force Finished`,
            type: toast.TYPE.SUCCESS,
            autoClose: 3000
          });
          selfclose();
        }else{
          console.log('BLOCKED BY SERVER METHOD');
          toast.error('Server Error');
          this.inFinGo.disabled = false;
        }
      });
    }
  }
  	
	return(
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
          className='action clearOrange blackT'
          disabled={false}
          >Finish {Pref.xBatch}</button>
      </p>
    </form>
  );
};