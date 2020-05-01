import React from 'react';

function updateSpeed(value) {
  Meteor.call('setSpeed', value);  
}

const UserSpeedSet = ()=> {
  let current = !Meteor.user().unlockSpeed ? 2000 : Meteor.user().unlockSpeed;
  const sup = Roles.userIsInRole(Meteor.userId(), ['admin', 'nightly']);
  return(
    <label><i>Step Unlock Speed </i><br />
      <select
        id='speedSetting'
        onChange={(e)=>updateSpeed(e.target.value)}
        defaultValue={current}
        required>
        <option value={100} disabled={!sup}>Too Fast</option>
        <option value={250} disabled={!sup}>Crazy Fast</option>
        <option value={500}>Very Fast</option>
        <option value={1000}>Fast</option>
        <option value={1500}>Medium</option>
        <option value={2000}>Slow</option>
      </select>
    </label>
  );
};

export default UserSpeedSet;