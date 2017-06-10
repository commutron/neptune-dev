import React, {Component} from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';

// import UserNice from './UserNice.jsx';

// requires data
// rma array

export default class RMALine extends Component	{
  
  popRMA(rmaId) {
    let check = 'Are you sure you want to remove the ' + Pref.rma + ' from this ' + Pref.item;
    const yes = window.confirm(check);
    if(yes) {
      const id = this.props.id;
      const bar = this.props.bar;
      Meteor.call('unsetRMA', id, bar, rmaId, (error)=>{
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
            <summary className='up'>{data.length + ' ' + Pref.rma}</summary>
            <ul>
              {data.map( (entry, index)=>{
                return(
                  <li key={index}>
                    {entry} -
                    {Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']) ?
                      <button
                        className='miniAction blackT'
                        onClick={this.popRMA.bind(this, entry)}
                        readOnly={true}
                        ><i className='fa fa-times'></i>Unset</button>
                    :null}
                  </li>
              )})}
            </ul>
          </details>
          :
          null}
      </div>
    );
  }
}