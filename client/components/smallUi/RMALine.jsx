import React, {Component} from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';

// import UserNice from './UserNice.jsx';

function popRMA(id, bar, rmaId) {
  let check = 'Are you sure you want to remove the ' + Pref.rma + ' from this ' + Pref.item;
  const yes = window.confirm(check);
  if(yes) {
    Meteor.call('unsetRMA', id, bar, rmaId, (error)=>{
      if(error)
        console.log(error);
    });
  }else{null}
}

const RMALine = ({ id, bar, data })=> (
  <div>
    {data.length > 0 ?
      <div className='red'>
        <b className='up'>{data.length + ' ' + Pref.rma}</b>
        <ul>
          {data.map( (entry)=>{
            return(
              <li key={entry}>
                {entry} -
                {Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']) ?
                  <button
                    className='miniAction blackT'
                    onClick={()=>popRMA(id, bar, entry)}
                    readOnly={true}
                    ><i className='fas fa-times'></i>Unset</button>
                :null}
              </li>
          )})}
        </ul>
      </div>
      :
      <div className='centreText fade'>
        <i className='fas fa-smile fa-3x'></i>
        <p className='big'>no {Pref.rmaProcess}</p>
      </div>
    }
  </div>
);

export default RMALine;