import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

// required data
/// batchId={false}
/// batchNow='new'
/// versionNow='new'
/// widgetId={w._id}
/// versions={w.versions}
/// lock={!w.versions}

export default class BatchForm extends Component	{

  save(e) {
    e.preventDefault();
    const batchId = this.props.batchId;
    const batchNow = this.props.batchNow;
    const wId = this.props.widgetId;
    const vKey = this.vrsn.value;
    const batchNum = this.oNum.value.trim().toLowerCase();
    const startDate = this.sDate.value;
    const endDate = this.eDate.value;

    function edit(batchId, batchNum, vKey) {
      Meteor.call('editBatch', batchId, batchNum, vKey, startDate, endDate, (error, reply)=>{
        if(error)
          console.log(error);
          Bert.alert(Alert.warning);
        if(reply) {
          Bert.alert(Alert.success);
          Session.set('now', batchNum);
        }else{
          Bert.alert(Alert.duplicate);
        }
      });
    }

    function create(batchNum, wId, vKey, startDate, endDate) {
      Meteor.call('addBatch', batchNum, wId, vKey, startDate, endDate, (error, reply)=>{
        if(error)
          console.log(error);
          Bert.alert(Alert.warning);
        if(reply) {
          Bert.alert(Alert.success);
          Session.set('now', batchNum);
        }else{
          Bert.alert(Alert.duplicate);
        }
      });
    }
    
    if(batchNow === 'new') {
      create(batchNum, wId, vKey, startDate, endDate);
    }else{
      edit(batchId, batchNum, vKey, startDate, endDate);
    }
  }
  

  render() {
    
    const ex = this.props.batchNow;
    let title = ex === 'new' ? 'create new' : 'edit';
    let eNum = ex === 'new' ? '' : ex;
    
    const exV = this.props.versionNow;
    let eVer = exV === 'new' ? '' : exV;
    
    let eS = this.props.start ? this.props.start : moment().format('YYYY-MM-DD');
    let eE = this.props.end ? this.props.end : '';

    return (
      <Model
        button={title + ' ' + Pref.batch}
        title={title + ' ' + Pref.batch}
        type='action clear greenT'
        lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'edit']) || this.props.lock}
      >
        <form className='centre' onSubmit={this.save.bind(this)}>
          <p>
            <select
              id='vrsl'
              ref={(i)=> this.vrsn = i} 
              defaultValue={eVer}
              required>
            {this.props.versions.map( (entry)=>{
              if(entry.live) {
                return(
                  <option value={entry.versionKey} key={entry.versionKey}>
                    {entry.version}
                  </option>
                )}})}
            </select>
            <label htmlFor='vrsl'>Version</label>
          </p>
          <p>
            <input
              type='text'
              id='oNum'
              ref={(i)=> this.oNum = i}
              pattern='[00000-99999]*'
              maxLength='5'
              minLength='5'
              inputMode='numeric'
              defaultValue={eNum}
              placeholder='17947'
              autoFocus='true'
              required />
            <label htmlFor='oNum'>Work Order Number</label>
          </p>
          <p>
            <input
              type='date'
              id='sdt'
              ref={(i)=> this.sDate = i}
              defaultValue={eS}
              pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
              required />
            <label htmlFor='sdt'>Start Date</label>
          </p>
          <p>
            <input
              type='date'
              id='egdt'
              ref={(i)=> this.eDate = i}
              defaultValue={eE}
              pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
              required />
            <label htmlFor='egdt'>End Goal Date</label>
          </p>
          <h3>{this.props.group}</h3>
          <h3>{this.props.wIdget}</h3>
          <br />
          <p><i>are you sure?</i></p>
          <br />
          <button type='submit' className='action clear greenT'>Save</button>
        </form>
      </Model>
    );
  }
}