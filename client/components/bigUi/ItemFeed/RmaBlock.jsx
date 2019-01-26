import React from 'react';
import { toast } from 'react-toastify';
import './style.css';
import Pref from '/client/global/pref.js';

const RmaBlock = ({ id, serial, iRMA, allRMA })=>{
  
  function popRMA(id, serial, rmaId) {
    let check = 'Are you sure you want to remove the ' + Pref.rma + ' from this ' + Pref.item;
    const yes = window.confirm(check);
    if(yes) {
      Meteor.call('unsetRMA', id, serial, rmaId, (error, reply)=>{
        error && console.log(error);
        reply ? toast.success('Saved') : toast.error('Not Allowed');
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
  
  const editAllow = Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']);
  
  return(
    <div>
      {iRMA.map( (entry)=>{
        const dts = rmaDetail(allRMA, entry);
        return(
          <div key={entry} className='infoBlock noncon'>
            <div className='blockTitle cap'>
              <div>
                <div className='leftAnchor'><i className="fas fa-exchange-alt fa-lg fa-fw orangeT"></i></div>
                <div>RMA {dts.name}</div>
                <div>Steps: {Array.from(dts.steps, x => x.step).toString()}</div>
              </div>
              <div className='rightText'>
                <div className='rightAnchor'>
                  <button
                    className='miniAction'
                    onClick={()=>popRMA(id, serial, entry)}
                    disabled={!editAllow}
                    ><i className='fas fa-times fa-lg fa-fw'></i></button>
                </div>
              </div>
              {dts.comment !== '' && <p className='endComment'>{dts.comment}</p>}
            </div>
          </div>
      )})}
    </div>
  );
};

export default RmaBlock;