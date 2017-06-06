import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

// props
/// id={b._id}
/// cascades={b.cascades}
/// barcode={i.barcode}
/// rma={i.rma} 

export default class RMAFall extends Component {
  
  activate(e) {
    e.preventDefault();
    const id = this.props.id;
    const bar = this.props.barcode;
    const rmaOp = this.rmaOp.value;
    Meteor.call('setRMA', id, bar, rmaOp, (error)=>{
      if(error)
        console.log(error);
    });
  }
  
  render () {
    
    const rma = this.props.rma;
    const items = this.props.allItems;
    const cascadesData = this.props.cascades;
    const cascades = [];
    for(let entry of cascadesData) {
      const otherOnes = items.filter(x => x.rma.includes(entry.key)).length;
      const thisOne = rma.includes(entry.key);
      let open = otherOnes < entry.quantity || entry.quantity === 0; 
      open && !thisOne ? cascades.push(entry) : null;
    }

    let lock = !Roles.userIsInRole(Meteor.userId(), 'inspector');
    
    return (
      <div className='centre'>
      {!lock && cascades.length > 0 ? 
        <form id='srtcsc' className='fullForm' onSubmit={this.activate.bind(this)}>
          <select ref={(i)=> this.rmaOp = i} required>
            <option></option>
            {cascades.map( (entry, index)=>{
              let lock = rma.includes(entry.key) ? 'disabled' : null;
              return(
                <option key={index} value={entry.key} disabled={lock}>
                  RMA {entry.rmaId} - {moment(entry.time).calendar()}
                </option>
                );
            })}
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
  }
}