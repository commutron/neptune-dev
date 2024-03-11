import React from 'react';

const ProJump = ({ batchNum, allRO })=> {
  
  function goPro(location) {
    Session.set('now', location);
    FlowRouter.go('production');
  }
  
  const isRO = allRO || Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
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
        </label>
      </a>
    </div>
  );
};

export default ProJump;

export const SrvJump = ({ find, mId, isRO })=> {
  
  function goPro() {
    Session.set('now', find);
    Session.set('nowSV', mId);
    FlowRouter.go('production');
  }
  
  return(
    <div className='overButton'>
			<a
        title='View service in production'
        onClick={()=>goPro()}
        disabled={isRO}>
        <label>
          <n-fa1>
            <i className='far fa-paper-plane wetasphaltT'></i>
          </n-fa1>
        </label>
      </a>
    </div>
  );
};