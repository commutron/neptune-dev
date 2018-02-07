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

function rmaDetail(allRMA, rmaKey) {
  const dt = allRMA.find( x => x.key === rmaKey );
  return {
    name: dt.rmaId,
    comment: dt.comm,
    steps: dt.flow,
  };
}

const RMALine = ({ id, bar, data, allRMA })=> (
  <div>
    {data.length > 0 ?
      <div className='red space'>
        <b className='up'>{data.length + ' ' + Pref.rma} assigned to this {Pref.item}</b>
        <hr />
        <div>
          {data.map( (entry)=>{
            const dts = rmaDetail(allRMA, entry);
            return(
              <dl key={entry}>
                <dt>RMA {dts.name}</dt>
                <dd className='capFL'>{dts.comment}</dd>
                <dd>Steps: {Array.from(dts.steps, x => x.step).toString()}</dd>
                <dd>
                  {Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']) ?
                    <button
                      className='miniAction blackT'
                      onClick={()=>popRMA(id, bar, entry)}
                      readOnly={true}
                      ><i className='fas fa-times'></i>Unset</button>
                  :null}
                </dd>
              </dl>
          )})}
        </div>
        <br />
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