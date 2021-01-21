import React from 'react';

function flowGo(serial) {
  Meteor.call('serialLookup', serial, (error, reply)=>{
    error && console.log(error);
    !reply || FlowRouter.go(`/data/batch?request=${reply}&specify=${serial}`);
  });
}

const SubItemLink = ({ serial })=> {
  return (
    <button
      className='inlineLink'
      onClick={()=>flowGo(serial)}
      readOnly
    >{serial}</button>
  );
};

export default SubItemLink;