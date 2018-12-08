import React from 'react';
import { toast } from 'react-toastify';

const handleClick = (id, serial) => {
  let sure = confirm('Change the Flow?');
  if(sure) {
    Meteor.call('forkItem', id, serial, false, (error, reply)=>{
      if(error)
      console.log(error);
    reply ? null : toast.error('Server Error');
    });
  }else{null}
};
 let sty ={
   marginTop: '5px'
 };

const AltMarker = ({ id, serial, alt }) => (
  <p className='centre' style={sty}>
    <button
      className='blueT med transparent'
      onClick={()=>handleClick(id, serial)}>
      {alt === 'yes' ? 'Alternate Flow' : 'Regular Flow'}
    </button>
  </p>
);

export default AltMarker;










