import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from './UserNice.jsx';
import StepBack from '../river/StepBack.jsx';

// requires entry of map as props.entry

export default class HistoryLine extends Component	{

  render() {

    const dt = this.props.entry;
    
    const cancel = Roles.userIsInRole(Meteor.userId(), 'edit') && !this.props.done ? 
                   <StepBack id={this.props.id} bar={this.props.bar} entry={dt} /> 
                   : 
                   '';
    
    const accept = dt.accept ? cancel : <b className='redT'>un-accepted</b>;

    let first = dt.first ?
      <div>
        <p>
          {Pref.builder}: {dt.first.builder.map( (entry, index)=>{
                            return( <UserNice key={index} id={entry} /> );
                          })}
        </p>
        <p>{Pref.method}: {dt.first.method.toString()}</p>
      </div> 
      : null;
    
    return (
      <div className='infoBox'>
        <div className='titleBar'>
          {dt.step} - {dt.type}, {moment(dt.time).calendar()} by <UserNice id={dt.who} />
          <span className='rAlign'>{accept}</span>
        </div>
        <p>{dt.comm}</p>
        {first}
        </div>
    );
  }
}