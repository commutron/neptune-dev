import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';
import RMAForm from '/client/components/forms/RMAForm.jsx';

// requires data
// rma array

const RMATable = ({ 
  id, data, items,
  options, end, inUse, 
  ncTypesCombo, app, user
})=> {
  
  function pullRMA(e, cKey) {
    let check = 'Are you sure you want to remove this ' + Pref.rmaProcess;
    const yes = window.confirm(check);
    if(yes) {
      Meteor.call('pullRMACascade', id, cKey, (error)=>{
        if(error)
          console.log(error);
      });
    }else{null}
  }

  return (
    <div>
      {data.length > 0 ?
      <table className='wide'>
        <thead className='red cap'>
          <tr>
            <th>RMA</th>
						<th>who</th>
						<th>time</th>
            <th>required</th>
            <th>assigned</th>
            <th>steps</th>
            <th>auto NonCons</th>
            <th>comment</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        {data.map( (entry)=>{
          let started = inUse.includes(entry.key);
          Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(started);
          return (
            <RMARow
              key={entry.key}
              entry={entry}
              id={id}
              assigned={items.filter(x => x.rma.includes(entry.key)).length}
              onRemove={(e)=>pullRMA(e, entry.key)}
              ncTypesCombo={ncTypesCombo}
              app={app}
              user={user}
              lock={started} />
          );
        })}
      </table>
      :
      <div className='centreText fade'>
        <i className='fas fa-smile fa-3x'></i>
        <p className='big'>no {Pref.rma}s</p>
      </div>
      }
    </div>
  );
};

export default RMATable;



const RMARow = ({ 
  entry, id, assigned, 
  onRemove, 
  ncTypesCombo,
  app, user, lock
})=> {
  
  let dt = entry;
  
  return(
    <tbody>
      <tr>
        <td>{dt.rmaId}</td>
        <td><UserNice id={dt.who} /></td>
        <td>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</td>
        <td>{dt.quantity === 0 ? 'unlimited' : dt.quantity}</td>
        <td>{assigned}</td>
        <td>{dt.flow.length}</td>
        <td>
          {!dt.nonCons ? '' : 
              dt.nonCons.map( (entry, index)=>{
                return( <i key={index}>{entry.ref}({entry.type}), </i> );
          })}
        </td>
        <td>{dt.comm}</td>
        <td>
          {Roles.userIsInRole(Meteor.userId(), 'qa') &&
            <RMAForm
              id={id}
              editObj={dt}
              trackOptions={app.trackOption}
              end={app.lastTrack}
              app={app}
              user={user}
              ncTypesCombo={ncTypesCombo} />
          }
        </td>
        <td>
          {!lock && Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']) ?
            <button
              title='Remove'
              className='miniAction redT'
              onClick={()=>onRemove()}
              readOnly={true}
            ><i className='fas fa-times fa-fw'></i></button>
          :null}
        </td>
      </tr>
    </tbody>
  );
};