import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice';
import { min2hr, cleanURL } from '/client/utility/Convert.js';
import { toast } from 'react-toastify';

export const RapidInfoCreate = ({ 
  batchId, groupId, exBatch,
  allQ, rSetItems, rootURL,
  cal, cancelFunc 
})=> {
 
  function handleCreate(e) {
    e.preventDefault();
    
    const rapidType = this.rType.value;
    const issueNum = this.rIsOr.value.trim();
    const endDate = this.rDlvr.value;
    const doneTarget = moment(endDate).endOf('day').lastWorkingTime().format();
    const quant = this.rQty.value.trim();
    
    const inHours = this.rTmBg.value;
    
    const howText = this.rInsc.value.trim();
    const howLink = howText.length === 0 ? false : howText;
    const howURL = !howLink ? false : cleanURL(howLink, rootURL);
    
    Meteor.call('createExRapidBasic', batchId, groupId, exBatch, 
      rapidType, issueNum, doneTarget, quant, inHours, howURL,
      (error, re)=>{
        error && console.log(error);
        re ? toast.success('Saved') : toast.error('unsuccessful');
      });
    cancelFunc();
  }
  
  return(
    <RapidInfoFormBlock 
      allQ={allQ}
      rSetItems={rSetItems}
      stateSet={cancelFunc}
      handleFunc={handleCreate}
      cal={cal}
    />
  );
};

  
const RapidInfoEdit = ({ 
  batchId, rapid, allQ, rSetItems, rootURL, 
  editAuth, cal
})=> {
  
  const [ editState, editSet ] = useState(false);
 
  function handleEdit(e) {
    e.preventDefault();
    
    const rapidType = this.rType.value;
    
    const issueNum = this.rIsOr.value.trim();
    
    const endDate = this.rDlvr.value;
    const doneTarget = moment(endDate).endOf('day').lastWorkingTime().format();
    
    const quant = this.rQty.value.trim();
    
    const inHours = this.rTmBg.value;
    
    const howText = this.rInsc.value.trim();
    const howLink = howText.length === 0 ? false : howText;
    const howURL = !howLink ? false : cleanURL(howLink, rootURL);
    
    Meteor.call('editExRapidBasic', batchId, rapid._id, 
      rapidType, issueNum, doneTarget, quant, inHours, howURL,
      (error, re)=>{
        error && console.log(error);
        re ? toast.success('Saved') : toast.error('unsuccessful');
      });
      
    editSet(false);
  }
  
  
  if(editState) {
    return(
      <RapidInfoFormBlock 
        rapid={rapid}
        allQ={allQ}
        rSetItems={rSetItems}
        stateSet={editSet}
        handleFunc={handleEdit}
        cal={cal}
      />
    );
  }
  
  return(
    <div className='readlines'>
      
      <p>Created At: {cal(rapid.createdAt)}</p>
      <p>Created By: <UserNice id={rapid.createdWho} /></p>
      
      {rapid.closedAt &&
        <p>Closed At: {cal(rapid.closedAt)}</p>}
      {rapid.closedWho &&
        <p>Closed By: <UserNice id={rapid.closedWho} /></p>}
      
      <p>Extend Type: <span className='med cap'>{rapid.type}</span></p>
      
      <p>Issue Number: <span className='med'>{rapid.issueOrder}</span></p>
      
      <p>Delivery Target: {cal(rapid.deliverAt)}</p>
      
      <p>Max Quantity: <n-num>{rapid.quantity}</n-num></p>
        
      <p>Extra Hours: <n-num>{min2hr(rapid.timeBudget || 0)}</n-num></p>
      
      <p className='wordBr max300'>
        Override Instruction: {
        rapid.instruct && !rapid.instruct.indexOf("http") != -1 ? rootURL : null
        }{
        rapid.instruct ?
          <a 
            className='clean wordBr' 
            href={rapid.instruct} 
            target='_blank'
          >{rapid.instruct}</a> : ""}
      </p>  
      
      <span className='rightRow'>
        <button
          title={!editAuth ? Pref.norole : !rapid.live ? 'not open' : ''}
          className='miniAction gap'
          onClick={()=>editSet(!editState)}
          disabled={!rapid.live || !editAuth}
        ><i className='fas fa-edit'></i> edit</button>
      </span>
    </div>
  );
};

export default RapidInfoEdit;


const RapidInfoFormBlock = ({ 
  rapid, allQ, rSetItems, stateSet, handleFunc, cal
})=> {
  
  const rDt = rapid || {
    _id: null,
    rapid: null,
    type: null,
    issueOrder: null,
    createdAt: null,
    createdWho: null,
    deliverAt: null,
    live: false,
    closedAt: null,
    closedWho: null,
    quantity: null,
    timeBudget: null,
    instruct: null,
  };
  
  const [ applyState, applySet ] = useState(rDt.quantity === allQ);
  
  useEffect( ()=> {
    if(this.rQty) {
      if(applyState) {
        this.rQty.value = allQ;
      }else{
        this.rQty.value = rDt.quantity || rSetItems || 0;
      }
    }
  }, [applyState]);
  
  return(
    <form 
      id='rapidInfoForm'
      className='interForm'
      onSubmit={(e)=>handleFunc(e)}
    >
      
      <p>Created At: <span>{cal(rDt.createdAt ? rDt.createdAt : new Date())}</span></p>
      <p>Created By: <UserNice id={rDt.createdWho ? rDt.createdWho : Meteor.userId()} /></p>
      
      <p>Extend Type:
        <select
          id='rType'
          className='interSelect miniIn18'
          defaultValue={rDt.type}
          required>
            <option></option>
            <option value='warranty-repair'>Warranty Repair</option>
            <option value='out-of-warranty-repair'>Out-of-Warranty-Repair</option>
            <option value='modify'>Modify</option>
        </select>
      </p>
        
      <p>Issue Number: 
        <input 
          type='text' 
          id='rIsOr'
          className='interInput'
          defaultValue={rDt.issueOrder}
          required />
      </p>
      
      <p>Delivery Target: 
        <input 
          type='date' 
          id='rDlvr'
          className='interInput'
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
          defaultValue={rDt.deliverAt && 
            moment(rDt.deliverAt).format('YYYY-MM-DD')}
          required />
      </p>
        
      <p>Max Quantity:  
        <input 
          type='number'
          id='rQty'
          className='interInput'
          pattern='[00000-99999]*'
          min={rSetItems || 0}
          max={allQ}
          placeholder={allQ}
          defaultValue={rDt.quantity}
          disabled={applyState}
          required />
      </p>
       
      <p>Apply to Maximum: 
        <input
          type='checkbox'
          id='applyAll'
          title='Set max quantity to maximum value'
          className='interInput inlineCheckbox'
          onChange={(e)=>applySet(e.target.checked)}
          checked={applyState}
        />
      </p>
     
      <p>Extra Hours: 
        <input 
          type='number' 
          id='rTmBg'
          className='interInput'
          pattern="^\d*(\.\d{0,1})?$"
          maxLength='7'
          minLength='1'
          max='10000'
          min='0'
          step=".01"
          inputMode='numeric'
          placeholder='12.5'
          defaultValue={min2hr(rDt.timeBudget || 0)}
          required />
      </p>
      
      <p>Override Instruction: 
        <input 
          type='text'
          id='rInsc'
          className='interInput'
          placeholder="'http://' or '/'"
          defaultValue={rDt.instruct || ''} />
      </p>
      
      <span className='rightRow'>
      
        <button
          type='button'
          className='miniAction gap'
          onClick={()=>stateSet(false)}
        ><i className='far fa-edit'></i> cancel</button>
      
        <button
          type='submit'
          className='miniAction gap nLineHover'
        ><i className='fas fa-check'></i> save</button>
      </span>
      
    </form>
  );
};