import React, {Component} from 'react';
import moment from 'moment';
import './style.css';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import UserNice from '/client/components/smallUi/UserNice.jsx';

export default class NonConBlock extends Component {
  
  constructor() {
    super();
    this.state = {
      edit: false
   };
    this.edit = this.edit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReInspect = this.handleReInspect.bind(this);
    this.handleTrash = this.handleTrash.bind(this);
    this.handleUnTrash = this.handleUnTrash.bind(this);
    this.popNC = this.popNC.bind(this);
  }
  edit() {
    this.setState({ edit: !this.state.edit });
  }
  
  handleCheck(target, dflt) {
    const ncTypesCombo = Array.from(this.props.app.nonConTypeLists, x => x.typeList);
	  const ncTypesComboFlat = [].concat(...ncTypesCombo);
	  const flatCheckList = [...this.props.app.nonConOption,
	    ...Array.from(ncTypesComboFlat, x => x.live === true && x.typeText)];

    let match = target.value === dflt || flatCheckList.find( x => x === target.value);
    let message = !match ? 'please choose from the list' : '';
    target.setCustomValidity(message);
    return !match ? false : true;
  }
  handleChange() {
		const id = this.props.id;
		const serial = this.props.serial;
    const ncKey = this.props.entry.key;
    const ref = this.ncRef.value.trim().toLowerCase();
    const type = this.ncType.value.trim().toLowerCase();
    const where = this.ncWhere.value.trim().toLowerCase();
    const tgood = this.handleCheck(this.ncType, this.props.entry.type);
    
    if( typeof ref !== 'string' || ref.length < 1 ||  !tgood || where.length < 1 ) {
      this.ncRef.reportValidity();
      this.ncType.reportValidity();
      this.ncWhere.reportValidity();
    }else if(this.props.entry.ref !== ref || 
             this.props.entry.type !== type ||
             this.props.entry.where !== where) {  
      Meteor.call('editNC', id, serial, ncKey, ref, type, where, (error)=> {
        error && console.log(error);
  			this.setState({ edit: false });
  		});
    }else{this.setState({ edit: false })}
  }
  
  handleReInspect() {
    const id = this.props.id;
    const ncKey = this.props.entry.key;
    Meteor.call('reInspectNC', id, ncKey, (error)=> {
			error && console.log(error);
			this.edit();
		});
  }
  
  handleTrash() {
    const id = this.props.id;
    const ncKey = this.props.entry.key;
    if(!Roles.userIsInRole(Meteor.userId(), 'verify')) {
      toast.warning("'First-off' permission is needed skip a nonconformance");
    }else{
      Meteor.call('trashNC', id, ncKey, (error)=> {
  			error && console.log(error);
  			this.edit();
  		});
    }
  }
  
  handleUnTrash() {
    const id = this.props.id;
    const ncKey = this.props.entry.key;
    Meteor.call('unTrashNC', id, ncKey, (error)=> {
			error && console.log(error);
			this.edit();
		});
  }
  
  popNC() {
    const yes = window.confirm('Are you sure you want to permanently delete this ' + Pref.nonCon);
    if(yes) {
      const id = this.props.id;
      const ncKey = this.props.entry.key;
      const override = !Roles.userIsInRole(Meteor.userId(), ['remove', 'qa']) ? 
                        prompt("Enter PIN to override", "") : false;
      Meteor.call('ncRemove', id, ncKey, override, (error)=>{
        error && console.log(error);
        this.setState({ edit: false });
      });
    }else{this.setState({ edit: false })}
  }
  
  render() {
    
    const done = this.props.done;
    const dt = this.props.entry;
    const app = this.props.app;
                   
    const fx = typeof dt.fix === 'object';
    const ins = typeof dt.inspect === 'object';
    const rjc = !dt.reject || dt.reject.length === 0 ? false : true;
    const skp = typeof dt.skip === 'object';
    
    const trashed = !dt.trash ? false : typeof dt.trash === 'object';
    const tSty = trashed ? 'trashStyle' : '';
    const open = trashed ?
                 <pre><i className="far fa-trash-alt fa-lg fa-fw" title='Trashed'></i></pre> :
                 dt.inspect === false ?
                  <i><i className="fas fa-wrench fa-lg fa-fw iNG" title='Awaiting Repair'></i></i> :
                  <b><i className="fas fa-check-circle fa-lg fa-fw iG" title='Good'></i></b>;
    
    let fixed = !fx ? '' : <li>Repaired: <UserNice id={dt.fix.who} /> {moment(dt.fix.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>;
    let inspected = !ins ? '' : <li>Inspected: <UserNice id={dt.inspect.who} /> {moment(dt.inspect.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>;
    let skipped = !skp ? '' : <li>Skipped: <UserNice id={dt.skip.who} /> {moment(dt.skip.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>;
    let snoozed = !dt.snooze ? false : true;
    let inTrash = !trashed ? '' : <li>Trashed: <UserNice id={dt.trash.who} /> {moment(dt.trash.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>;

    const editAllow = Roles.userIsInRole(Meteor.userId(), 'inspect') && !done;
    const editIndicate = this.state.edit && 'editStandout';
    
    const ncTypesCombo = Array.from(this.props.app.nonConTypeLists, x => x.typeList);
	  const ncTypesComboFlat = [].concat(...ncTypesCombo);
	  
    return(
      <div className={`infoBlock noncon ${editIndicate} ${tSty}`}>
        <div className='blockTitle cap'>
          {this.state.edit === true ?
            <div>
              <input
                type='text'
                ref={(i)=> this.ncRef = i}
                id='ncR'
                className='redIn up inlineInput'
                min={1}
                defaultValue={dt.ref}
                required />
              {Roles.userIsInRole(Meteor.userId(), 'nightly') ?
                <span>
                  <input 
                    ref={(i)=> this.ncType = i}
                    id='ncT'
                    className='redIn inlineSelect'
                    type='search'
                    defaultValue={dt.type}
                    placeholder='Type'
                    list='ncTypeList'
                    onInput={(e)=>this.handleCheck(e.target, dt.type)}
                    required />
                    <datalist id='ncTypeList'>
                      {app.nonConOption.map( (entry, index)=>{
                        return ( 
                          <option
                            key={index}
                            data-id={index + 1 + '.'} 
                            value={entry}
                          >{index + 1}</option>
                        );
                      })}
                      {ncTypesComboFlat.map( (entry, index)=>{
                        if(entry.live === true) {
                          return ( 
                            <option 
                              key={index}
                              data-id={entry.key}
                              value={entry.typeText}
                            >{entry.typeCode}</option>
                          );
                      }})}
                    </datalist>
                </span>
              :
                <select 
                  ref={(i)=> this.ncType = i}
                  id='ncT'
                  className='redIn cap inlineSelect'
                  defaultValue={dt.type}
                  required>
                  {app.nonConOption.map( (entry, index)=>{
                    return( <option key={index} value={entry}>{entry}</option> );
                    })}
                </select>
              }
              <input 
                ref={(i)=> this.ncWhere = i}
                id='ncW'
                className='redIn inlineSelect'
                list='ncWhereList'
                defaultValue={dt.where || ''}
                disabled={!Roles.userIsInRole(Meteor.userId(), ['run', 'edit', 'qa'])}
                required />
                <datalist id='ncWhereList'>
                  <option value={dt.where || ''}>{dt.where || ''}</option>
                  <optgroup label={Pref.phases}>
                    {this.props.app.phases.map( (entry, index)=>{
                      return( <option key={index} value={entry}>{entry}</option> );
                    })}
                  </optgroup>
                  <optgroup label={Pref.ancillary}>
                    {app.ancillaryOption.map( (entry, index)=>{
                      return (
                        <option key={index} value={entry}>{entry}</option>
                        );
                    })}
                  </optgroup>
                </datalist>
            </div>
          :
            <div>
              <div className='leftAnchor'>{open}</div>
              <div className='up'>{dt.ref}</div>
              <div className=''>{dt.type}</div>
              <div className=''>{dt.where}</div>
            </div>
          }
          {this.state.edit === true ?
            <div className='rightText'>
              {ins ?
                <button
                  className='miniAction yellowT inlineButton'
                  onClick={this.handleReInspect}
                  disabled={done}>
                  <i className='fas fa-redo fa-lg'></i>
                  <i className='med'> ReInspect</i>
                </button>
              :null}
              {!trashed ?
                <button
                  className='miniAction yellowT inlineButton'
                  disabled={!Roles.userIsInRole(Meteor.userId(), 'verify')}
                  onClick={this.handleTrash}
                >Remove</button>
              :
                <button
                  className='miniAction yellowT inlineButton'
                  disabled={!Roles.userIsInRole(Meteor.userId(), 'inspect')}
                  onClick={this.handleUnTrash}
                >Restore</button>
              }
              <button
                className='miniAction redT inlineButton'
                disabled={!Roles.userIsInRole(Meteor.userId(), ['remove', 'qa'])}
                onClick={this.popNC}
              >Delete</button>
              <button
                className='miniAction greenT inlineButton'
                onClick={this.handleChange}
              >Save</button>
              <button
                className='miniAction inlineButton'
                onClick={this.edit}
              >Cancel</button>
            </div>
          :
            <div className='rightText'>
              <div><UserNice id={dt.who} /></div>
              <div>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
              <div className='rightAnchor'>
                <button
                  className='miniAction'
                  onClick={this.edit}
                  disabled={!editAllow}
                  readOnly={true}>
                  <i className='fas fa-edit fa-lg fa-fw'></i>
                </button>
              </div>
            </div>
          }
        </div>
        <ul className='moreInfoList'>
          {fixed}
          {inspected}
          {snoozed && <li>Snoozed</li>}
          {skipped}
          {rjc ?
            dt.reject.map( (entry, index)=>{
              return(
                <ul key={index}>
                  <li colSpan='2'>
                    Attempt: <UserNice id={entry.attemptWho} /> {moment(entry.attemptTime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}
                    <br />
                    Reject: <UserNice id={entry.rejectWho} /> {moment(entry.rejectTime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}
                  </li>
                </ul>
              )})
          : null}
          {inTrash}
        </ul>
        {dt.comm !== '' && <p className='endComment'>{dt.comm}</p>}
      </div>
    );
  }
}