import React, {Component} from 'react';
import moment from 'moment';
import './style.css';
import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';

export default class ShortBlock extends Component {
  
  constructor() {
    super();
    this.state = {
      edit: false
   };
    this.edit = this.edit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.popSh = this.popSh.bind(this);
  }
  edit() {
    this.setState({ edit: !this.state.edit });
  }
  
  handleChange() {
		const id = this.props.id;
		const serial = this.props.serial;
    const shKey = this.props.entry.key;
    const partNum = this.shPN.value.trim();
    const refs = this.shRefs.value.trim().toLowerCase()
                  .replace(",", " ").split(/\s* \s*/);
    let effect = null;
    let solve = null;
    const act = this.shAct.value;
    if(act === Pref.doOmit) {
      effect = true;
    }else if(act === Pref.shortageWaiting) {
      effect = false;
      solve = null;
    }else if(act === Pref.notResolved) {
      effect = false;
      solve = false;
    }else if(act === Pref.isResolved) {
      effect = false;
      solve = true;
    }else{
      null;
    }
    const comm = this.shCm.value.trim();
    
    Meteor.call('editShort', id, serial, shKey, partNum, refs, effect, solve, comm, (error)=> {
      error && console.log(error);
			this.setState({ edit: false });
		});
  }
  
  popSh() {
    let check = 'Are you sure you want to remove this ' + Pref.shortfall;
    const yes = window.confirm(check);
    if(yes) {
      const id = this.props.id;
      const shKey = this.props.entry.key;
      const override = !Roles.userIsInRole(Meteor.userId(), ['qa', 'remove', 'run']) ? 
                        prompt("Enter PIN to override", "") : false;
      Meteor.call('removeShort', id, shKey, override, (error)=>{
        error && console.log(error);
        this.setState({ edit: false });
      });
    }else{this.setState({ edit: false })}
  }
  
  render() {
    
    const dt = this.props.entry;
    const done = this.props.done;
  
    const inE = dt.inEffect;
    const reS = dt.reSolve;
    const actionState = inE === null ? Pref.shortagePending : // Don't have a thing, what to do?
                        inE === true ? Pref.doOmit : // Leave thing out, Continue and Ship

                        reS === null ? Pref.shortageWaiting : // Waiting to be Able to Resolve
                        reS === false ? Pref.notResolved : // Can be Resolved but is Not Yet
                        reS === true ? Pref.isResolved : // Problem is Resolved
                        'unknown';
    
    const open = inE === true || reS === true ?
                  <i><i className="fas fa-check-circle fa-lg fa-fw greenT" title='Good'></i></i> :
                  <b><i className="fas fa-wrench fa-lg fa-fw redT" title='Awaiting Repair'></i></b>;
                  
    const editAllow = Roles.userIsInRole(Meteor.userId(), 'verify') && !done;
    const editIndicate = this.state.edit && 'editStandout';     
  
    return(
      <div className={`infoBlock short ${editIndicate}`}>
        <div className='blockTitle cap'>
          {this.state.edit === true ?
            <div>
              <input
                type='text'
                ref={(i)=> this.shPN = i}
                id='shPN'
                className='up orangeIn inlineInput'
                defaultValue={dt.partNum} />
              <input
                type='text'
                ref={(i)=> this.shRefs = i}
                id='shR'
                className='up orangeIn inlineInput'
                defaultValue={dt.refs.toString()} />
              <select 
                ref={(i)=> this.shAct = i}
                id='shAct'
                className='orangeIn inlineSelect'
                defaultValue={actionState}
                required>
                <option value={Pref.shortagePending}>{Pref.shortagePending}</option>
                <option value={Pref.doOmit}>{Pref.doOmit}</option>
                <option value={Pref.shortageWaiting}>{Pref.shortageWaiting}</option>
                <option value={Pref.notResolved}>{Pref.notResolved}</option>
                <option value={Pref.isResolved}>{Pref.isResolved}</option>
              </select>
              <input
                type='text'
                ref={(i)=> this.shCm = i}
                id='shCm'
                className='orangeIn inlineInput'
                placeholder='comment'
                defaultValue={dt.comm}/>
            </div>
          :
            <div>
              <div className='leftAnchor'>{open}</div>
              <div className='up'>{dt.partNum}</div>
              <div className='cap'>{dt.refs.toString().toUpperCase()}</div>
              <div className='cap'>{dt.where}</div>
            </div>
          }
          {this.state.edit === true ?
            <div className='rightText'>
              <button
                className='miniAction inlineButton greenT'
                onClick={this.handleChange}
              >Save</button>
              <button
                className='miniAction inlineButton redT'
                onClick={this.popSh}
              >Remove</button>
              <button
                className='miniAction inlineButton'
                onClick={this.edit}
              >Cancel</button>
            </div>
          :
            <div className='rightText'>
              <div><UserNice id={dt.cWho} /></div>
              <div>{moment(dt.cTime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
              <div className='rightAnchor'>
                <button
                  className='miniAction'
                  onClick={this.edit}
                  disabled={!editAllow}>
                  <i className='fas fa-edit fa-lg fa-fw'></i>
                </button>
              </div>
            </div>
          }
        </div>
        <ul className='moreInfoList'>
          <li>Last Updated: <UserNice id={dt.uWho} /> {moment(dt.uTime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>
          <li>{actionState}</li>
        </ul>
        {dt.comm !== '' && <p className='endComment'>{dt.comm}</p>}
      </div>
    );
  }
}



