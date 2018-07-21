import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '../smallUi/UserNice.jsx';

const NCTable = ({ id, nc, done, multi, ncOps, flowSteps, app })=> (
  <div>
    {nc.length > 0 ?
      <table className='wide'>
        <thead className='red cap'>
          <tr>
            <th>Ref</th>
						<th>type</th>
						<th>where</th>
						<th>time</th>
						<th>who</th>
						<th>fixed</th>
            <th>inspected</th>
            <th>skipped</th>
            <th>comment</th>
            <th></th>
          </tr>
        </thead>
        {nc.map( (entry, index)=>{
          return (
            <NCRow
              key={index}
              entry={entry}
              id={id}
              done={done}
              multi={multi}
              ncOps={ncOps}
              flowSteps={flowSteps}
              app={app} />
          );
        })}
      </table>
    :
      <div className='centreText fade'>
        <i className='fas fa-smile fa-3x' aria-hidden="true"></i>
        <p className='big'>no {Pref.nonCon}s</p>
      </div>
    }
  </div>
);

export class NCRow extends Component {
  
  constructor() {
    super();
    this.state = {
      edit: false
   };
    this.edit = this.edit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReInspect = this.handleReInspect.bind(this);
    this.popNC = this.popNC.bind(this);
  }
  edit() {
    this.setState({ edit: !this.state.edit });
  }
  
  handleChange() {
		const id = this.props.id;
    const ncKey = this.props.entry.key;
    const ref = this.ncRef.value.trim().toLowerCase();
    const type = this.ncType.value;
    const where = this.ncWhere.value;
    
    if(
      this.props.entry.ref !== ref || 
      this.props.entry.type !== type ||
      this.props.entry.where !== where
      ) {  
      Meteor.call('editNC', id, ncKey, ref, type, where, (error)=> {
        if(error)
          console.log(error);
  			this.setState({ edit: false });
  		});
    }else{
      this.setState({ edit: false });
    }
  }
  
  handleReInspect() {
    const id = this.props.id;
    const ncKey = this.props.entry.key;
    Meteor.call('reInspectNC', id, ncKey, (error)=> {
			if(error)
			  console.log(error);
			this.edit();
		});
  }
  
  popNC() {
    let check = 'Are you sure you want to remove this ' + Pref.nonCon;
    const yes = window.confirm(check);
    if(yes) {
      const id = this.props.id;
      const ncKey = this.props.entry.key;
      const override = !Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']) ? 
                        prompt("Enter PIN to override", "") : false;
      Meteor.call('ncRemove', id, ncKey, override, (error)=>{
        if(error)
          console.log(error);
        this.setState({ edit: false });
      });
    }else{
      this.setState({ edit: false });
    }
  }
  
  render() {
    
    const dt = this.props.entry;
    const done = this.props.done;
    const multi = this.props.multi;
                   
    const fx = typeof dt.fix === 'object';
    const ins = typeof dt.inspect === 'object';
    const rjc = !dt.reject || dt.reject.length === 0 ? false : true;
    const skp = typeof dt.skip === 'object';
     
    let fixed = !fx ? '' : <i>{moment(dt.fix.time).calendar()}, <UserNice id={dt.fix.who} /></i>;
    let inspected = !ins ? '' : <i>{moment(dt.inspect.time).calendar()}, <UserNice id={dt.inspect.who} /></i>;
    let skipped = !skp ? '' : <i>{moment(dt.skip.time).calendar()}, <UserNice id={dt.skip.who} /></i>;
    let snoozed = !dt.snooze ? false : true;
    let comment = !dt.comm ? '' : dt.comm;
    
    const remove = (Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']) || 
                    dt.type === (this.props.app.missingType || false) ) && !done;
    const edit = Roles.userIsInRole(Meteor.userId(), 'inspect') && !done;
    
    let inSty = {
      width: '125px',
    };
    
    let inClk = { 
      minWidth: '15px',
      margin: '0 5px'
    };
    
    if(this.state.edit === true) {
      return(
        <tbody className='contrastList'>
          <tr className='editStandout'>
          {multi ? <td>{dt.serial}</td> : null}
            <td colSpan='6'>
              <input
                type='text'
                ref={(i)=> this.ncRef = i}
                id='ncR'
                className='redIn up breath'
                style={inSty}
                defaultValue={dt.ref}
              />
              <select 
                ref={(i)=> this.ncType = i}
                id='ncT'
                className='redIn cap breath'
                style={inSty}
                defaultValue={dt.type}
                required>
                {this.props.ncOps.map( (entry, index)=>{
                  return( <option key={index} value={entry}>{entry}</option> );
                  })}
              </select>
              <select 
                ref={(i)=> this.ncWhere = i}
                id='ncW'
                className='redIn cap breath'
                style={inSty}
                defaultValue={dt.where || ''}
                required>
                {this.props.flowSteps.map( (entry, index)=>{
                  return( <option key={index} value={entry}>{entry}</option> );
                  })}
              </select>
            </td>
            <td colSpan='4'>
              <span className='rAlign'>
                {ins ?
                  <button
                    className='miniAction yellowT'
                    onClick={this.handleReInspect}
                    style={inClk}
                    readOnly={true}
                    disabled={done}>
                    <i className='fas fa-redo fa-lg'></i>
                    <i className='med'> ReInspect</i>
                  </button>
                :null}
                <button
                  className='miniAction greenT'
                  onClick={this.handleChange}
                  style={inClk}
                  readOnly={true}>
                  <i className='fas fa-arrow-circle-down fa-lg'></i>
                  <i className='med'> Save</i>
                </button>
                {remove ?
                  <button
                    className='miniAction redT'
                    onClick={this.popNC}
                    style={inClk}
                    readOnly={true}>
                    <i className='fas fa-times fa-lg'></i>
                    <i className='med'> Remove</i>
                  </button>
                :null}
                <button
                  className='miniAction blueT'
                  onClick={this.edit}
                  style={inClk}
                  readOnly={true}>
                  <i className='fas fa-ban fa-lg'></i>
                  <i className='med'> Cancel</i>
                </button>
              </span>
            </td>
          </tr>
        </tbody>
      );  
    }
    
    return(
      <tbody className='contrastList'>
        <tr>
          {multi ? <td>{dt.serial}</td> : null}
          <td className='up'>{dt.ref}</td>
          <td className='cap'>{dt.type}</td>
          <td className='cap'>{dt.where}</td>
          <td>{moment(dt.time).calendar()}</td>
          <td><UserNice id={dt.who} /></td>
          <td>{fixed}</td>
          <td>{inspected}</td>
          <td>{snoozed ? 'Snoozed, ' : ''}{skipped}</td>
          <td>{comment}</td>
          <td>
            {!edit || done ?
              null :
              <button
                className='miniAction blueT'
                onClick={this.edit.bind(this)}
                readOnly={true}>
                <i className='fas fa-edit'></i>
              </button>
            }
          </td>
        </tr>
        {rjc ?
          dt.reject.map( (entry, index)=>{
            return(
              <tr key={index}>
                <td colSpan='5'></td>
                <td colSpan='2'>
                  Attempt: {moment(entry.attemptTime).calendar()}, <UserNice id={entry.attemptWho} />
                  <br />
                  Reject: {moment(entry.rejectTime).calendar()}, <UserNice id={entry.rejectWho} />
                </td>
                <td colSpan='3'></td>
              </tr>
            )})
        : null}
      </tbody>
    );
  }
}

export default NCTable;