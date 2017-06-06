import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import UserNice from '../smallUi/UserNice.jsx';
// include:
/// entry
/// oId
/// oNum
/// oProd

export default class ShortRow extends Component {

  handleDelete() {
    const id = this.props.id;
    const shKey = this.props.entry.key;
    Meteor.call('sRemove', id, shKey, (error, reply)=> {
      if(error)
        console.log(error);
      reply ? Bert.alert(Alert.success) : Bert.alert(Alert.warning); 
    });
  }
  
  handleUndo() {
		const id = this.props.id;
    const shKey = this.props.entry.key;
      Meteor.call('undoReShort', id, shKey, (error, reply)=> {
        if(error)
          console.log(error);
        reply ? Bert.alert(Alert.success) : Bert.alert(Alert.warning); 
			});
  }
  
  handleEdit() {
    this.com.disabled = !this.com.disabled;
    this.sv.disabled = !this.sv.disabled;
  }
  handleEditSave(e) {
    e.preventDefault();
		const id = this.props.id;
    const shKey = this.props.entry.key;
    const comm = this.com.value;
    console.log(comm);
      Meteor.call('editShortCom', id, shKey, comm, (error, reply)=> {
        if(error)
          console.log(error);
        if(reply) {
          this.com.disabled = !this.com.disabled;
          this.sv.disabled = !this.sv.disabled;
        }else{
          Bert.alert(Alert.warning);
        }
			});
  }

  handleRec() {
		const id = this.props.id;
    const shKey = this.props.entry.key;
      Meteor.call('recShort', id, shKey, (error, reply)=> {
        if(error)
          console.log(error);
        reply ? Bert.alert(Alert.success) : Bert.alert(Alert.warning); 
			});
  }

  render () {
    
    const dt = this.props.entry;
    const rlv = dt.resolve;
    const unlock = Roles.userIsInRole(Meteor.userId(), ['power', 'creator']);
    
    const reOrder = rlv && rlv.action === 'order';
    const reSub = rlv.action === 'sub';
    const reDnp = rlv.action === 'dnp';
    const reWhen = rlv ? moment(dt.resolve.time).calendar() : false;
    const reWho = rlv ? <UserNice id={dt.resolve.who} /> : false;
    
    const recFollow = rlv ? 
                      typeof dt.followup === 'object' ?
                      <b>Received {moment(dt.followup).calendar()}</b> :
                      <button
                        className='smallAction clear greenT'
                        onClick={this.handleRec.bind(this)}
                        >Received</button> :
                      false;
    
    const action = reOrder ?
                   <td><b>Ordered</b> {reWhen} by {reWho} {recFollow}</td> :
                   reSub ?
                   <td><b>Subsitute {rlv.alt}</b> as per {reWho} {reWhen}</td> :
                   reDnp ?
                   <td><b>DNP, send short</b> as per {reWho} {reWhen}</td> :
                   <td></td>;
                        
    return (
			<tr>
				<td className='up'>{dt.partNum}</td>
				<td>{dt.quantity}</td>
        <td>{moment(dt.time).calendar()} by <UserNice id={dt.who} /></td>
        <td>
          <form className='hiddenInput inlineForm' onSubmit={this.handleEditSave.bind(this)}>
            <textarea
              ref={(i)=> this.com = i}
              rows='2'
              disabled={true}
              defaultValue={dt.comm}></textarea>
            <br />
            <button
              type='submit'
              ref={(i)=> this.sv = i}
              className='smallAction clear greenT'
              disabled={true}>Save</button>
          </form>
        </td>
        {rlv ?
          action
        :
          unlock ?
            <td><ResolveForm id={this.props.id} shKey={dt.key} /></td>
          :
            <td></td>
        }
        <td>
          {unlock ?
            <button
              className='miniAction mini2x blueT breath'
              title='Edit Comment'
              onClick={this.handleEdit.bind(this)}>
              <i className='fa fa-pencil fa-2x'></i>
            </button>
          :null}
          {unlock ?
            <button className='miniAction mini2x yellowT breath' title='Undo Resolve' onClick={this.handleUndo.bind(this)}>
              <i className='fa fa-reply fa-2x'></i>
            </button>
          :null}
          {Meteor.user().power ?
            <button className='miniAction mini2x redT breath' title='Delete Entry' onClick={this.handleDelete.bind(this)}>
              <i className='fa fa-times fa-2x'></i>
            </button>
          :null}
        </td>
			</tr>
    );
  }
}


export class ResolveForm extends Component {
  
  handleResolve(e) {
    e.preventDefault();
		const id = this.props.id;
    const shKey = this.props.shKey;
    const act = this.act.value;
    const more = this.more.value;
    const alt = more ? more.trim().toLowerCase() : false;
    
    Meteor.call('resolveShort', id, shKey, act, alt, (error, reply)=> {
      if(error)
        console.log(error);
      if(reply) {
			  Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.warning);
      }
    });
  }
  
  moreInfo() {
    this.act.value === 'sub' ? this.more.disabled = false : this.more.disabled = true;
    this.more.value = '';
  }
  
  render() {
    return(
      <form className='fullForm' onSubmit={this.handleResolve.bind(this)}>
        <select ref={(i)=> this.act = i} onChange={this.moreInfo.bind(this)} required>
          <option></option>
          <option value='order'>Order</option>
          <option value='dnp'>DNP - Send Short</option>
          <option value='sub'>Subsitute</option>
        </select>
        <input
          type='text'
          ref={(i)=> this.more = i}
          disabled={true}
          placeholder='sub part number' />
        <button type='submit' className='smallAction clear greenT'>set</button>
      </form>
      
      );
  }
}