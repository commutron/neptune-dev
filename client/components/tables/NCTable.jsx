import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '../smallUi/UserNice.jsx';

// requires
/*
id={b._id}
nc={nc}
done={done}
*/

export default class NCTable extends Component	{

  render() {
    
    return (
      <div>
      {this.props.nc.length > 0 ?
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
          {this.props.nc.map( (entry, index)=>{
            return (
              <NCRow
                key={index}
                entry={entry}
                id={this.props.id}
                done={this.props.done}
                multi={this.props.multi}
                ncOps={this.props.ncOps}
                flowSteps={this.props.flowSteps} />
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
  }
}


export class NCRow extends Component {
  
  constructor() {
    super();
    this.state = {
      edit: false
   };
    this.edit = this.edit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
  
  popNC() {
    let check = 'Are you sure you want to remove this ' + Pref.nonCon;
    const yes = window.confirm(check);
    if(yes) {
      const id = this.props.id;
      const ncKey = this.props.entry.key;
      Meteor.call('ncRemove', id, ncKey, (error)=>{
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
    
    const remove = Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']) && !done;
    const edit = Roles.userIsInRole(Meteor.userId(), 'inspect') && !done;
    
    let inSty = {
     width: '150px',
    };
    
    let inClk = { 
    minWidth: '20px',
    margin: '0 10px'
    };
    
    if(this.state.edit === true) {
      return(
        <tbody>
          <tr className='editStandout'>
          {multi ? <td>{dt.serial}</td> : null}
            <td colSpan='7'>
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
                defaultValue={dt.where}
                required>
                {this.props.flowSteps.map( (entry, index)=>{
                  return( <option key={index} value={entry}>{entry}</option> );
                  })}
              </select>
            </td>
            <td colSpan='3'>
              <span className='rAlign'>
                <button
                  className='miniAction greenT'
                  onClick={this.handleChange}
                  style={inClk}
                  readOnly={true}>
                  <i className='fas fa-arrow-circle-down fa-2x'></i>
                  <i className='big'>Save</i>
                </button>
                {remove ?
                  <button
                    className='miniAction redT'
                    onClick={this.popNC}
                    style={inClk}
                    readOnly={true}>
                    <i className='fas fa-times fa-2x'></i>
                    <i className='big'>Remove</i>
                  </button>
                :null}
                <button
                  className='miniAction blueT'
                  onClick={this.edit}
                  style={inClk}
                  readOnly={true}>
                  <i className='fas fa-ban fa-2x'></i>
                  <i className='big'>Cancel</i>
                </button>
              </span>
            </td>
          </tr>
        </tbody>
      );  
    }
    
    return(
      <tbody>
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
            {!edit || ins ?
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