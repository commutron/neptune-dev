import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
import UserNice from '/client/components/smallUi/UserNice.jsx';
import { toast } from 'react-toastify';


const InfoEditBlock = ({ rapidData, allQ, rSetItems, cal })=> {
  
  const rapid = rapidData || {
    issueOrder: null,
    createdAt: null,
    createdWho: null,
    deliverAt: null,
    closedAt: null,
    closedWho: null,
    quantity: null,
    timeBudget: null,
    instruct: null
  };
  
  
  const [ editState, editSet ] = useState(false);
  
  const [ applyState, applySet ] = useState(rapid.quantity === allQ);
  
  useEffect( ()=> {
    if(this.rQty) {
      if(applyState) {
        this.rQty.value = allQ;
      }else{
        this.rQty.value = rSetItems || 0;
      }
    }
  }, [applyState]);
  
  
  function handleEdit(e) {
    e.preventDefault();
    
    const rapidType = this.rType.value;
    
    const issueNum = this.rIsOr.value.trim();
    
    const endDate = this.rDlvr.value;
    const doneTarget = moment(endDate).endOf('day').lastWorkingTime().format();
    
    const quant = this.rQty.value.trim();
    
    const exTime = this.rTmBg.value;
    
    const howText = this.rInsc.value.trim();
    const howLink = howText.length === 0 ? false : howText;
    
    
    Meteor.call('editExRapidBasic', rapidData._id, 
      rapidType, issueNum, doneTarget, quant, exTime, howLink,
      (error, re)=>{
        error && console.log(error);
        re ? toast.success('Saved') : toast.error('unsuccessful');
      });
      
    editSet(false);
  }
  
  
  if(editState) {
    return(
      <form 
        id='rapidInfoForm'
        className='interForm'
        onSubmit={(e)=>handleEdit(e)}
      >
        
        <p>Created At: <span>{cal(rapid.createdAt)}</span></p>
        <p>Created By: <UserNice id={rapid.createdWho} /></p>
        
        <p>Extend Type:
          <select
            id='rType'
            className='interSelect miniIn18'
            defaultValue={rapid.type}
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
            defaultValue={rapid.issueOrder}
            required />
        </p>
        
        <p>Delivery Target: 
          <input 
            type='date' 
            id='rDlvr'
            className='interInput'
            pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
            defaultValue={moment(rapid.deliverAt).format('YYYY-MM-DD')}
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
            defaultValue={rapid.quantity} 
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
            
         
        <p>Extra Minutes: 
          <input 
            type='number' 
            id='rTmBg'
            className='interInput'
            pattern="^\d*(\.\d{0,1})?$"
            maxLength='6'
            minLength='1'
            max='30000'
            min='0'
            step=".5"
            inputMode='numeric'
            placeholder='12.5'
            defaultValue={rapid.timeBudget}
            required />
        </p>
        
        <p title='unavailable'><strike>Override Instruction:</strike>
          <input 
            type='url'
            id='rInsc'
            className='interInput'
            placeholder='http://'
            defaultValue={rapid.instruct || ''}
            disabled={true} />
        </p>
        
        <span className='rightRow'>
        
          <button
            type='button'
            className='miniAction gap'
            onClick={()=>editSet(false)}
          ><i className='far fa-edit'></i> cancel</button>
        
          <button
            type='submit'
            className='miniAction gap greenLineHover'
          ><i className='fas fa-check'></i> save</button>
        </span>
        
      </form>
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
        
      <p>Extra Minutes: <n-num>{rapid.timeBudget}</n-num></p>
      
      <p className='wordBr' title='unavailable'>
        <strike>Override Instruction: {rapid.instruct || ''}</strike>
      </p>  
      
      <span className='rightRow'>
        <button
          className='miniAction gap'
          onClick={()=>editSet(!editState)}
          disabled={
            !rapidData.live || 
            !Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])
          }
        ><i className='fas fa-edit'></i> edit</button>
      </span>
    </div>
  );
};

export default InfoEditBlock;