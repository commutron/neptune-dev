import React from 'react';

const ProJump = ({ batchNum, dense })=> {
  
  function goPro(location) {
    Session.set('now', location);
    FlowRouter.go('production');
  }
  
  const isRO = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
  return(
    <div>
			<a
        title={`View ${batchNum} in production`}
        className='transparent'
        onClick={()=>goPro(batchNum)}
        disabled={isRO}>
        <label className='navIcon actionIconWrap taskLink'>
          <i className='fas fa-paper-plane' data-fa-transform='left-1 down-2 shrink-3'></i>
        </label><br />
        {!dense && <i className='label infoSquareLabel whiteT'>Production</i>}
      </a>
    </div>
  );
};

export default ProJump;