import React, {Component} from 'react';
import moment from 'moment';
  
function activate(e, id, barcode, rmaKey) {
  e.preventDefault();
  Meteor.call('setRMA', id, barcode, rmaKey, (error)=>{
    if(error)
      console.log(error);
  });
}
  
const RMAFall = ({ id, cascadeData, barcode, rma, allItems })=> {
  const cascades = [];
  for(let entry of cascadeData) {
    const otherOnes = allItems.filter(x => x.rma.includes(entry.key)).length;
    const thisOne = rma.includes(entry.key);
    let open = otherOnes < entry.quantity || entry.quantity === 0; 
    open && !thisOne ? cascades.push(entry) : null;
  }
  let lock = !Roles.userIsInRole(Meteor.userId(), ['qa', 'run', 'inspect']);
  
  return (
    <div className='centre'>
    {!lock && cascades.length > 0 ? 
      <form 
        id='srtcsc'
        className='fullForm'
        onSubmit={(e)=>activate(e, id, barcode, this.op.value)}>
        <select id='op' required>
          <option></option>
          {cascades.map( (entry, index)=>{
            let lock = rma.includes(entry.key) ? 'disabled' : null;
            return(
              <option key={index} value={entry.key} disabled={lock}>
                RMA {entry.rmaId} - {moment(entry.time).calendar()}
              </option>
          )})}
        </select>
        <button
          type='submit'
          form='srtcsc'
          className='smallAction clear yellowT'
          disabled={lock}
        >Activate RMA</button>
      </form>
    : // if all the rma quantities are satisfied show nothing
      null}
    </div>
  );
};

export default RMAFall;