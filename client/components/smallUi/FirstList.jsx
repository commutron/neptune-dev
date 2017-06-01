import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import UserNice from './UserNice.jsx';

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
                {dt.info.step} - {dt.info.type} at {dt.info.time.toLocaleString()} by <UserNice id={dt.info.who} />
              </div>
              <p>{dt.info.comm}</p>
              <p>Accepted: {dt.info.accept.toString()}</p>
              <p>{Pref.item}: {dt.bar}</p>
              <p>
                {Pref.builder}: {dt.info.first.builder.map( (entry, index)=>{
                                  return( <UserNice key={index} id={entry} /> );
                                })}
              </p>
              <p>{Pref.method}: {dt.info.first.method.toString()}</p>
            </div>
          )})}
      </details>
    );
  }
}