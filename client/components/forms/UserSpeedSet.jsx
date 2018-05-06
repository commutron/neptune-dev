import React, {Component} from 'react';

function updateSpeed(value) {
  Meteor.call('setSpeed', value);  
}

const UserSpeedSet = ()=> {
  let current = !Meteor.user().unlockSpeed ? 2000 : Meteor.user().unlockSpeed; 
  return(
    <label><i>Step Unlock Speed </i><br />
      <select
        ref={(i)=> this.speed = i}
        onChange={()=> updateSpeed(speed.value)}
        defaultValue={current}>
        <option value={500}>Very Fast</option>
        <option value={1000}>Fast</option>
        <option value={1500}>Medium</option>
        <option value={2000}>Slow</option>
      </select>
    </label>
  );
};

export default UserSpeedSet;