import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from './UserNice.jsx';
import RMAForm from '../forms/RMAForm.jsx';

// requires data
// rma array

export default class RMAList extends Component	{
  
  pullRMA(cKey) {
    let check = 'Are you sure you want to remove this ' + Pref.rmaProcess;
    const yes = window.confirm(check);
    if(yes) {
      const id = this.props.id;
      Meteor.call('pullRMACascade', id, cKey, (error)=>{
        if(error)
          console.log(error);
      });
    }else{null}
  }

  render() {
    
    const data = this.props.data;

    return (
      <div>
        {data.length > 0 ?
          <details className='red'>
            <summary className='up'>{data.length} {Pref.rmaProcess}</summary>
          <div>
            { data.map( (dt, index)=>{
            let started = this.props.inUse.includes(dt.key);
              return (
                <div key={index} className='infoBox'>
                  <div className='titleBar'>
                    RMA: {dt.rmaId} by <UserNice id={dt.who} /> at {moment(dt.time).calendar()}
                    {!started ?
                      <span className='rAlign'>
                      {Roles.userIsInRole(Meteor.userId(), ['qa', 'edit']) ?
                        <RMAForm
                          id={this.props.id}
                          edit={dt} />
                      :null}
                      {Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']) ?
                        <button
                          className='miniAction blackT'
                          onClick={this.pullRMA.bind(this, dt.key)}
                          readOnly={true}
                          ><i className='fa fa-times'></i>delete</button>
                      :null}
                      </span>
                    : null}
                  </div>
                  <p>quantity required: {dt.quantity}</p>
                  <p>{dt.comm}</p>
                  <p>Steps: {dt.flow.length}</p>
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