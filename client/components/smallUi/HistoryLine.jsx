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
    
    const good = dt.good ? cancel : <b className='up redT'>{Pref.ng}</b>;

    let moreInfo = typeof dt.info === 'object' ?
      <div>
        <p>
          {Pref.builder}: {dt.info.builder.map( (entry, index)=>{
                            return( <UserNice key={index} id={entry} /> );
                          })}
        </p>
        <p>{Pref.method}: {dt.info.buildMethod}</p>
        <p>{Pref.inspector}: {dt.info.verifyMethod}</p>
        <p>{Pref.proChange}: {dt.info.change}</p>
        <p>{Pref.outIssue}: {dt.info.issue}</p>
      </div> 
      : null;
    
    return (
      <div className='infoBox'>
        <div className='titleBar'>
          {dt.step} - {dt.type}, {moment(dt.time).calendar()} by <UserNice id={dt.who} />
          <span className='rAlign'>{good}</span>
        </div>
        <p>{dt.comm}</p>
        {moreInfo}
        </div>
    );
  }
}