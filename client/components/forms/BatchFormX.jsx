import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

// required data
/// batchId={false}
/// batchNow='new'
/// versionNow='new'
/// groupId={g._id}
/// widgetId={w._id}
/// versions={w.versions}
/// lock={!w.versions}

export default class BatchFormX extends Component	{

  save(e) {
    e.preventDefault();
    const batchId = this.props.batchId;
    const batchNow = this.props.batchNow;
    const gId = this.props.groupId;
    const wId = this.props.widgetId;
    const vKey = this.vrsn.value;
    const batchNum = this.oNum.value.trim().toLowerCase();
    const salesNum = this.soNum.value.trim().toLowerCase();
    const startDate = this.sDate.value;
    const endDate = this.eDate.value;
    const quantity = this.quant.value.trim().toLowerCase();

    function edit(batchId, batchNum, vKey, salesNum, startDate, endDate, quantity) {
      Meteor.call('editBatchX', batchId, batchNum, vKey, salesNum, startDate, endDate, quantity, (error, reply)=>{
        if(error)
          console.log(error);
          Bert.alert(Alert.warning);
        if(reply) {
          Bert.alert(Alert.success);
          //Session.set('now', batchNum);
          FlowRouter.go('/data/batch?request=' + batchNum);
        }else{
          Bert.alert(Alert.duplicate);
        }
      });
    }

    function create(batchNum, gId, wId, vKey, salesNum, startDate, endDate, quantity) {
      Meteor.call('addBatchX', batchNum, gId, wId, vKey, salesNum, startDate, endDate, quantity, (error, reply)=>{
        if(error)
          console.log(error);
          Bert.alert(Alert.warning);
        if(reply) {
          Bert.alert(Alert.success);
          //Session.set('now', batchNum);
          FlowRouter.go('/data/batch?request=' + batchNum);
        }else{
          Bert.alert(Alert.duplicate);
        }
      });
    }
    
    if(batchNow === 'new') {
      create(batchNum, gId, wId, vKey, salesNum, startDate, endDate, quantity);
    }else{
      edit(batchId, batchNum, vKey, salesNum, startDate, endDate, quantity);
    }
  }
  

  render() {
    
    const ex = this.props.batchNow;
    let title = ex === 'new' ? 'create new' : 'edit';
    let bttn = ex === 'new' ? 'new' : 'edit';
    let eNum = ex === 'new' ? '' : ex;
    
    const exV = this.props.versionNow;
    let eVer = exV === 'new' ? '' : exV;
    
    let eSO = this.props.salesOrder || '';
    let eS = this.props.start || moment().format('YYYY-MM-DD');
    let eE = this.props.end || '';
    let eQ = this.props.quantity || '';
    
    return (
      <Model
        button={bttn + ' ' + Pref.xBatch}
        title={title + ' ' + Pref.xBatch}
        color='blueT'
        icon='fa-cubes'
        lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'nightly']) || this.props.lock}
        noText={this.props.noText}>
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
            <label htmlFor='vrsl'>{Pref.version}</label>
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
            <label htmlFor='oNum'>{Pref.xBatch} number</label>
          </p>
          <p>
            <input
              type='text'
              id='oNum'
              ref={(i)=> this.soNum = i}
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
              id='sdt'
              ref={(i)=> this.sDate = i}
              defaultValue={eS}
              pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
              required />
            <label htmlFor='sdt'>{Pref.start} date</label>
          </p>
          <p>
            <input
              type='date'
              id='egdt'
              ref={(i)=> this.eDate = i}
              defaultValue={eE}
              pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
              required />
            <label htmlFor='egdt'>{Pref.end} date</label>
          </p>
          <p>
            <input
              type='text'
              id='qNum'
              ref={(i)=> this.quant = i}
              pattern='[00000-99999]*'
              maxLength='5'
              minLength='1'
              inputMode='numeric'
              defaultValue={eQ}
              placeholder='10000' />
            <label htmlFor='soNum'>Quantity</label>
          </p>
          <br />
          <p><i>are you sure?</i></p>
          <br />
          <button type='submit' className='action clearGreen'>Save</button>
        </form>
      </Model>
    );
  }
}