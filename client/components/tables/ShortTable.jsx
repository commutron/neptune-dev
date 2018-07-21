import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '../smallUi/UserNice.jsx';

const ShortTable = ({ id, shortfalls, done, app })=> (
  <div>
    {shortfalls.length > 0 ?
      <table className='wide'>
        <thead className='orange cap'>
          <tr>
            <th>part number</th>
						<th>refs</th>
						<th>where</th>
						<th>created</th>
						<th>updated</th>
            <th>state</th>
            <th>comment</th>
            <th></th>
          </tr>
        </thead>
        {shortfalls.map( (entry, index)=>{
          return (
            <ShRow
              key={index}
              entry={entry}
              id={id}
              done={done}
              app={app} />
          );
        })}
      </table>
    :
      <div className='centreText fade'>
        <i className='fas fa-smile fa-3x'></i>
        <p className='big'>no {Pref.shortfalls}</p>
      </div>
    }
  </div>
);

export default ShortTable;

export class ShRow extends Component {
  
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
    
    Meteor.call('editShort', id, shKey, partNum, refs, effect, solve, comm, (error)=> {
      if(error)
        console.log(error);
			this.setState({ edit: false });
		});
  }
  
  popSh() {
    let check = 'Are you sure you want to remove this ' + Pref.shortfall;
    const yes = window.confirm(check);
    if(yes) {
      const id = this.props.id;
      const shKey = this.props.entry.key;
      Meteor.call('removeShort', id, shKey, (error)=>{
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
    
    const inE = dt.inEffect;
    const reS = dt.reSolve;
    const actionState = inE === null ? Pref.shortagePending : // Don't have a thing, what to do?
                        inE === true ? Pref.doOmit : // Leave thing out, Continue and Ship

                        reS === null ? Pref.shortageWaiting : // Waiting to be Able to Resolve
                        reS === false ? Pref.notResolved : // Can be Resolved but is Not Yet
                        reS === true ? Pref.isResolved : // Problem is Resolved
                        'unknown';
                   
    const remove = Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']) && !done;
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
            <td colSpan='5'>
              <input
                type='text'
                ref={(i)=> this.shPN = i}
                id='shPN'
                className='up breath'
                style={inSty}
                defaultValue={dt.partNum}
              />
              <input
                type='text'
                ref={(i)=> this.shRefs = i}
                id='shR'
                className='up breath'
                style={inSty}
                defaultValue={dt.refs.toString()}
              />
              
              <select 
                ref={(i)=> this.shAct = i}
                id='shAct'
                className='breath'
                style={inSty}
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
                className='breath'
                style={inSty}
                defaultValue={dt.comm}
              />
            </td>
            <td colSpan='3'>
              <span className='rAlign'>
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
                    onClick={this.popSh}
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
          <td className='up'>{dt.partNum}</td>
          <td className='up'>{dt.refs.toString()}</td>
          <td className='cap'>{dt.where}</td>
          <td>{moment(dt.cTime).calendar()}, <UserNice id={dt.cWho} /></td>
          <td>{moment(dt.uTime).calendar()}, <UserNice id={dt.uWho} /></td>
          <td>{actionState}</td>
          <td>{dt.comm}</td>
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
      </tbody>
    );
  }
}