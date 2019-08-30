import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';

// required data
/// batchId={false}
/// batchNow='new'
/// versionNow='new'
/// widgetId={w._id}
/// versions={w.versions}
/// lock={!w.versions}

const BatchCreate = ({ widgetId, versionNow, versions, lock, noText })=> {

  function save(e) {
    e.preventDefault();
    
    const wId = widgetId;
    const vKey = e.target.vrsn.value;
    const batchNum = e.target.oNum.value.trim().toLowerCase();
    const salesNum = e.target.soNum.value.trim().toLowerCase();
    const startDate = e.target.sDate.value;
    const endDate = e.target.eDate.value;
    const inHours = parseFloat( e.target.hourNum.value );
    const inMinutes = moment.duration(inHours, 'hours').asMinutes();

    Meteor.call('addBatch', 
      batchNum, wId, vKey, salesNum, startDate, endDate, inMinutes, 
      (error, reply)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
        if(reply) {
          toast.success('Saved');
          //Session.set('now', batchNum);
          FlowRouter.go('/data/batch?request=' + batchNum);
        }else{
          toast.warning('Duplicate');
        }
    });

  }
    
  let eVer = !versionNow ? '' : versionNow;

  return (
    <Model
      button={'New ' + Pref.batch}
      title={'Create a new ' + Pref.batch}
      color='greenT'
      icon='fa-cubes'
      lock={!Roles.userIsInRole(Meteor.userId(), 'create') || lock}
      noText={noText}>
      <form className='centre' onSubmit={(e)=>save(e)}>
        <p>
          <label htmlFor='vrsn'>{Pref.version}</label><br />
          <select
            id='vrsn'
            className='numberSet'
            defaultValue={eVer}
            required>
            {versions.map( (entry)=>{
              if(entry.live) {
                return(
                  <option value={entry.versionKey} key={entry.versionKey}>
                    {entry.version}
                  </option>
                )}})}
          </select>
        </p>
        <div className='vmargin'>
          <label htmlFor='oNum' className='breath'>{Pref.batch} number<br />
          <input
            type='number'
            id='oNum'
            className='numberSet indenText'
            pattern='[00000-99999]*'
            maxLength='5'
            minLength='5'
            max='99999'
            min='00001'
            step='1'
            inputMode='numeric'
            placeholder='17947'
            autoFocus={true}
            required 
          /></label>
        </div>
        <div className='centreRow vmargin'>
          <label htmlFor='soNum' className='breath'>{Pref.salesOrder}<br />
          <input
            type='text'
            id='soNum'
            className='numberSet indenText'
            maxLength='32'
            minLength='1'
            placeholder='179470b'
            required
          /></label>
          <label htmlFor='hourNum' className='breath'>{Pref.timeBudget}<br />
          <input
            type='number'
            id='hourNum'
            title={`update quoted time budget\n in hours to 2 decimal places`}
            className='numberSet indenText'
            pattern="^\d*(\.\d{0,2})?$"
            maxLength='6'
            minLength='1'
            max='1000'
            min='0.01'
            step=".01"
            inputMode='numeric'
            placeholder='54.07'
            required 
          /></label>
        </div>
        <div className='centreRow vmargin'>
          <label htmlFor='sDate' className='breath'>{Pref.start}<br />
          <input
            type='date'
            id='sDate'
            className='numberSet'
            defaultValue={moment().format('YYYY-MM-DD')}
            pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
            required 
          /></label>
          <label htmlFor='eDate' className='breath'>{Pref.end}<br />
          <input
            type='date'
            id='eDate'
            className='numberSet'
            pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
            required 
          /></label>
        </div>
        <p><i>are you sure?</i></p>
        <button type='submit' className='action clear greenHover'>Create</button>
      </form>
    </Model>
  );
};

export default BatchCreate;