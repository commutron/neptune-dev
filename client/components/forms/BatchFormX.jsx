import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';

// required data
/// batchId={false}
/// batchNow='new'
/// versionNow='new'
/// groupId={g._id}
/// widgetId={w._id}
/// versions={w.versions}
/// lock={!w.versions}

const BatchFormX = (props)=> {

  function save(e) {
    e.preventDefault();
    const batchId = props.batchId;
    const batchNow = props.batchNow;
    const gId = props.groupId;
    const wId = props.widgetId;
    const vKey = this.vrsn.value;
    const batchNum = this.oNum.value.trim().toLowerCase();
    const salesNum = this.soNum.value.trim().toLowerCase();
    const startDate = this.sDate.value;
    const endDate = this.eDate.value;
    const quantity = this.quant.value.trim().toLowerCase();

    function edit(batchId, batchNum, vKey, salesNum, startDate, endDate, quantity) {
      Meteor.call('editBatchX', batchId, batchNum, vKey, salesNum, startDate, endDate, quantity, (error, reply)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
        if(reply) {
          toast.success('Saved');
          FlowRouter.go('/data/batch?request=' + batchNum);
        }else{
          toast.warning('Duplicate');
        }
      });
    }

    function create(batchNum, gId, wId, vKey, salesNum, startDate, endDate, quantity) {
      Meteor.call('addBatchX', batchNum, gId, wId, vKey, salesNum, startDate, endDate, quantity, (error, reply)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
        if(reply) {
          toast.success('Saved');
          FlowRouter.go('/data/batch?request=' + batchNum);
        }else{
          toast.warning('Duplicate');
        }
      });
    }
    
    if(batchNow === 'new') {
      create(batchNum, gId, wId, vKey, salesNum, startDate, endDate, quantity);
    }else{
      edit(batchId, batchNum, vKey, salesNum, startDate, endDate, quantity);
    }
  }
    
  const ex = props.batchNow;
  let title = ex === 'new' ? 'create new' : 'edit';
  let bttn = ex === 'new' ? 'new' : 'edit';
  let eNum = ex === 'new' ? '' : ex;
  
  const exV = props.versionNow;
  let eVer = !exV ? '' : exV;
  
  let eSO = props.salesOrder || '';
  let eS = props.start || moment().format('YYYY-MM-DD');
  let eE = props.end || '';
  let eQ = props.quantity || '';
    
  return (
    <Model
      button={bttn + ' ' + Pref.xBatch}
      title={title + ' ' + Pref.xBatch}
      color='blueT'
      icon='fa-cubes'
      lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'nightly']) || props.lock}
      noText={props.noText}>
      <form className='centre' onSubmit={(e)=>save(e)}>
        <p>
          <select
            id='vrsn'
            defaultValue={eVer}
            required>
          {props.versions.map( (entry)=>{
            if(entry.live) {
              return(
                <option value={entry.versionKey} key={entry.versionKey}>
                  {entry.version}
                </option>
              )}})}
          </select>
          <label htmlFor='vrsn'>{Pref.version}</label>
        </p>
        <p>
          <input
            type='text'
            id='oNum'
            pattern='[00000-99999]*'
            maxLength='5'
            minLength='5'
            inputMode='numeric'
            defaultValue={eNum}
            placeholder='17947'
            autoFocus={true}
            required />
          <label htmlFor='oNum'>{Pref.xBatch} number</label>
        </p>
        <p>
          <input
            type='text'
            id='soNum'
            maxLength='32'
            minLength='1'
            defaultValue={eSO}
            placeholder='179470b'
            required/>
          <label htmlFor='soNum'>{Pref.salesOrder} number</label>
        </p>
        <p>
          <input
            type='date'
            id='sDate'
            defaultValue={eS}
            pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
            required />
          <label htmlFor='sDate'>{Pref.start} date</label>
        </p>
        <p>
          <input
            type='date'
            id='eDate'
            defaultValue={eE}
            pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
            required />
          <label htmlFor='eDate'>{Pref.end} date</label>
        </p>
        <p>
          <input
            type='text'
            id='quant'
            pattern='[00000-99999]*'
            maxLength='5'
            minLength='1'
            inputMode='numeric'
            defaultValue={eQ}
            placeholder='10000' />
          <label htmlFor='quant'>Quantity</label>
        </p>
        <br />
        <p><i>are you sure?</i></p>
        <br />
        <button
          type='submit'
          className='action clearGreen'
        >Save</button>
      </form>
    </Model>
  );
};

export default BatchFormX;