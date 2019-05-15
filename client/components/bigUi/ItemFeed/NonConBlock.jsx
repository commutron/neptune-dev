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
    this.handleChange = this.handleChange.bind(this);
    this.handleReInspect = this.handleReInspect.bind(this);
    this.handleTrash = this.handleTrash.bind(this);
    this.handleUnTrash = this.handleUnTrash.bind(this);
    this.popNC = this.popNC.bind(this);
  }
  edit() {
    this.setState({ edit: !this.state.edit });
  }
  
  handleChange() {
		const id = this.props.id;
		const serial = this.props.serial;
    const ncKey = this.props.entry.key;
    const ref = this.ncRef.value.trim().toLowerCase();
    const type = this.ncType.value;
    const where = this.ncWhere.value;
    if( typeof ref !== 'string' || ref.length < 1  ) {
      null;
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
    if(!Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])) {
      toast.warning('"Run" or "QA" permission is needed skip a nonconformance');
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
    const yes = window.confirm('Are you sure you want to remove this ' + Pref.nonCon);
    if(yes) {
      const id = this.props.id;
      const ncKey = this.props.entry.key;
      const override = !Roles.userIsInRole(Meteor.userId(), 'remove') ? 
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
                   
    const fx = typeof dt.fix === 'object';
    const ins = typeof dt.inspect === 'object';
    const rjc = !dt.reject || dt.reject.length === 0 ? false : true;
    const skp = typeof dt.skip === 'object';
    
    const trashed = !dt.trash ? false : typeof dt.trash === 'object';
    const tSty = trashed ? 'trashStyle' : '';
    const open = trashed ?
                 <pre><i className="far fa-trash-alt fa-lg fa-fw whiteT" title='Trashed'></i></pre> :
                 dt.inspect === false ?
                  <i><i className="fas fa-wrench fa-lg fa-fw redT" title='Awaiting Repair'></i></i> :
                  <b><i className="fas fa-check-circle fa-lg fa-fw greenT" title='Good'></i></b>;
    
    let fixed = !fx ? '' : <li>Repaired: <UserNice id={dt.fix.who} /> {moment(dt.fix.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>;
    let inspected = !ins ? '' : <li>Inspected: <UserNice id={dt.inspect.who} /> {moment(dt.inspect.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>;
    let skipped = !skp ? '' : <li>Skipped: <UserNice id={dt.skip.who} /> {moment(dt.skip.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>;
    let snoozed = !dt.snooze ? false : true;
    let inTrash = !trashed ? '' : <li>Trashed: <UserNice id={dt.trash.who} /> {moment(dt.trash.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>;

    const editAllow = Roles.userIsInRole(Meteor.userId(), 'inspect') && !done;
    const editIndicate = this.state.edit && 'editStandout';     
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
                defaultValue={dt.ref}
                required={true}
              />
              <select 
                ref={(i)=> this.ncType = i}
                id='ncT'
                className='redIn cap inlineSelect'
                defaultValue={dt.type}
                required>
                {this.props.app.nonConOption.map( (entry, index)=>{
                  return( <option key={index} value={entry}>{entry}</option> );
                  })}
              </select>
              <select 
                ref={(i)=> this.ncWhere = i}
                id='ncW'
                className='redIn cap inlineSelect'
                defaultValue={dt.where.toLowerCase() || ''}
                required>
                {this.props.app.phases.map( (entry, index)=>{
                  return( <option key={index} value={entry.toLowerCase()}>{entry}</option> );
                  })}
              </select>
            </div>
          :
            <div>
              <div className='leftAnchor'>{open}</div>
              <div className='up'>{dt.ref}</div>
              <div className='cap'>{dt.type}</div>
              <div className='cap'>{dt.where}</div>
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
                  disabled={!Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])}
                  onClick={this.handleTrash}
                >Trash</button>
              :
                <button
                  className='miniAction yellowT inlineButton'
                  disabled={!Roles.userIsInRole(Meteor.userId(), 'inspect')}
                  onClick={this.handleUnTrash}
                >Undo Trash</button>
              }
              <button
                className='miniAction redT inlineButton'
                disabled={!Roles.userIsInRole(Meteor.userId(), ['remove', 'run', 'qa'])}
                onClick={this.popNC}
              >Remove</button>
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