import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from './UserNice.jsx';

// requires data
// rma array

export default class RMAList extends Component	{

  render() {
    
    const data = this.props.data;

    return (
      <div>
        {data.length > 0 ?
          <details className='red'>
            <summary className='up'>{data.length + ' ' + Pref.rma}</summary>
          <div>
            { data.map( (dt, index)=>{
              return (
                <div key={index} className='infoBox'>
                  <div className='titleBar'>
                    RMA: {dt.rma} by <UserNice id={dt.createdWho} /> at {moment(dt.createdAt).calendar()}
                  </div>
                  <p>NCAR: {dt.ncar}</p>
                  <p>Re Assembly Steps: {dt.reAssemble.toString()}</p>
                </div>
                );
            })}
          </div>
          </details>
          :
          null}
      </div>
    );
  }
}