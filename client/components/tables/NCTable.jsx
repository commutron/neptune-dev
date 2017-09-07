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
              <th>fixer</th>
              <th>inspected</th>
              <th>inspector</th>
              <th>skipped</th>
              <th>skipper</th>
              <th>comment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.nc.map( (entry, index)=>{
              return (
                <NCRow
                  key={index}
                  entry={entry}
                  id={this.props.id}
                  done={this.props.done}
                  multi={this.props.multi}
                  ncOps={this.props.ncOps} />
              );
            })}
          </tbody>
          {/*
          maybe not necessary
          <thead className='red cap'>
            <tr>
              <th>Ref</th>
							<th>type</th>
							<th>where</th>
							<th>time</th>
							<th>who</th>
							<th>fixed</th>
              <th>fixer</th>
              <th>inspected</th>
              <th>inspector</th>
              <th>skipped</th>
              <th>skipper</th>
              <th></th>
            </tr>
          </thead>
          */}
        </table>
      :
        <div className='centreText fade'>
          <i className='fa fa-smile-o fa-3x' aria-hidden="true"></i>
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
  }
  edit() {
    this.setState({ edit: !this.state.edit });
  }
  
  handleChange() {
		const id = this.props.id;
    const ncKey = this.props.entry.key;
    const ref = this.ncRef.value.trim().toLowerCase();
    const type = this.ncType.value;
    
    if(this.ncFx) {
      if(this.ncFx.checked === false) {
        Meteor.call('UnFixNC', id, ncKey, (error)=> {
          if(error)
            console.log(error);
      	});
      }else{null}
    }else{null}
    
    if(this.ncSk) {
      if(this.ncSk.checked === false) {
        Meteor.call('UnSkipNC', id, ncKey, (error)=> {
          if(error)
            console.log(error);
      	});
      }else{null}
    }else{null}
    
    if(this.props.entry.ref !== ref || this.props.entry.type !== type) {  
      Meteor.call('editNC', id, ncKey, ref, type, (error)=> {
        if(error)
          console.log(error);
  			this.setState({ edit: false });
  		});
    }else{
      this.setState({ edit: false });
    }
  }
  
  popNC(ncId) {
    let check = 'Are you sure you want to remove this ' + Pref.nonCon;
    const yes = window.confirm(check);
    if(yes) {
      const id = this.props.id;
      Meteor.call('ncRemove', id, ncId, (error)=>{
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
     const skp = typeof dt.skip === 'object';
     
     let fixed = fx ? moment(dt.fix.time).calendar() : '';
     let fixer = fx ? <UserNice id={dt.fix.who} /> : '';
     let inspected = ins ? moment(dt.inspect.time).calendar() : '';
     let inspector = ins ? <UserNice id={dt.inspect.who} /> : '';
     let skipped = skp ? moment(dt.skip.time).calendar() : '';
     let skipper = skp ? <UserNice id={dt.skip.who} /> : '';
     
     let comment = !dt.comm ? '' : dt.comm === 'sn00ze' ? 'snoozed' : dt.comm;
     
     const remove = Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']) && !done;
     const edit = Roles.userIsInRole(Meteor.userId(), 'run') && !done;
     
     let inSty = {
       width: '150px',
     };
     
     let inChk = { 
       width: '1em',
       position: 'relative',
       top: '5px'
     };
     
     let inLbl = {
       display: 'inline-block',
     };
     
     let inClk = { 
      minWidth: '20px',
      margin: '0 10px'
     };
    
    if(this.state.edit === true) {
      return(
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
        
          {fx ?
            <span>
              <input
                type='checkbox'
                ref={(i)=> this.ncFx = i}
                id='ncF'
                className='breath'
                style={inChk}
                defaultChecked={fx}
              />
              <label style={inLbl} htmlFor='ncF'>Fixed</label>
            </span>
          :null}
          
          {skp ?
            <span>
              <input
                type='checkbox'
                ref={(i)=> this.ncSk = i}
                id='ncS'
                className='breath'
                style={inChk}
                defaultChecked={skp}
              />
              <label style={inLbl} htmlFor='ncS'>Skipped</label>
            </span>
          :null}
        
        </td>
        <td colSpan='7'>
          <span className='rAlign'>
            <button
              className='miniAction greenT'
              onClick={this.handleChange.bind(this)}
              style={inClk}
              readOnly={true}>
              <i className='fa fa-floppy-o fa-2x'></i>
              <i className='big'>Save</i>
            </button>
            
            {remove ?
              <button
                className='miniAction redT'
                onClick={this.popNC.bind(this, dt.key)}
                style={inClk}
                readOnly={true}>
                <i className='fa fa-times fa-2x'></i>
                <i className='big'>Remove</i>
              </button>
            :null}
  
            <button
              className='miniAction blueT'
              onClick={this.edit.bind(this)}
              style={inClk}
              readOnly={true}>
              <i className='fa fa-ban fa-2x'></i>
              <i className='big'>Cancel</i>
            </button>
            
          </span>
        </td>
      </tr>
      );  
    }
    
    
    
    return(
      <tr>
        {multi ? <td>{dt.serial}</td> : null}
        <td>{dt.ref}</td>
        <td>{dt.type}</td>
        <td>{dt.where}</td>
        <td>{moment(dt.time).calendar()}</td>
        <td><UserNice id={dt.who} /></td>
        <td>{fixed}</td>
        <td>{fixer}</td>
        <td>{inspected}</td>
        <td>{inspector}</td>
        <td>{skipped}</td>
        <td>{skipper}</td>
        <td>{comment}</td>
        <td>
          {!edit || ins ?
            null :
            <button
              className='miniAction blueT'
              onClick={this.edit.bind(this)}
              readOnly={true}>
              <i className='fa fa-pencil-square-o fa-2x'></i>
            </button>
          }
        </td>
      </tr>
    );
  }
}