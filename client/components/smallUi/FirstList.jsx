import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from './UserNice.jsx';
import JumpFind from './JumpFind.jsx';

// requires array of first objects as props.data

export default class FirstList extends Component	{

  render() {

    return (
      <details className='blue'>
        <summary>Complete {Pref.trackFirst}s</summary>
        {this.props.data.map( (dt, index)=>{
          return (
            <div className='infoBox' key={index}>
              <div className='titleBar'>
                {dt.entry.step} - {dt.entry.type} at {moment(dt.entry.time).calendar()} by <UserNice id={dt.entry.who} />
              </div>
              <p>{dt.entry.comm}</p>
              <JumpFind title={dt.bar} sub='' />
              <p>{dt.entry.info.good ? Pref.good : Pref.ng}</p>
              <p>
                {Pref.builder}: {dt.entry.info.builder.map( (entry, index)=>{
                                  return( <UserNice key={index} id={entry} /> );
                                })}
              </p>
              <p>{Pref.method}: {dt.entry.info.buildMethod}</p>
              <p>{Pref.inspector}: {dt.entry.info.verifyMethod}</p>
              <p>{Pref.proChange}: {dt.entry.info.change}</p>
              <p>{Pref.outIssue}: {dt.entry.info.issue}</p>
            </div>
          )})}
      </details>
    );
  }
}