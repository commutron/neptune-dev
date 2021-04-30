import React from 'react';

const ProJump = ({ batchNum, dense })=> {
  
  function goPro(location) {
    Session.set('now', location);
    FlowRouter.go('production');
  }
  
  const isRO = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
  return(
    <div className='overButton'>
			<a
        title={`View ${batchNum} in production`}
        onClick={()=>goPro(batchNum)}
        disabled={isRO}>
        <label>
          <n-fa1>
            <i className='far fa-paper-plane darkgrayT'></i>
          </n-fa1>
          {!dense && <span className='label darkgrayT'>Production</span>}
        </label>
      </a>
    </div>
  );
};

export default ProJump;