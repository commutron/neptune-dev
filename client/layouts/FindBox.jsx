import React from 'react';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

const FindBox = ({ orb, user })=> {
    
  function setVar(e) {
    e.preventDefault();
    const chosen = this.lookup.value.trim().toLowerCase();
      Session.set('now', chosen);
        this.lookup.value = '';
        this.lookup.select();
  }

  let last = orb || 'Search';
  let lock = user ? false : true;

	return (
    <form 
      className='findForm' 
      onSubmit={(e)=>setVar(e)}
      autoComplete='off'>
      <input
        autoFocus={true}
        type='search'
        id='lookup'
        className='up'
        placeholder={last}
        disabled={lock}
        autoCorrect={false}
        autoCapitalize={false}
        spellCheck={false}
      />
    </form>
  );
};

export default createContainer( () => {
    return {
      orb: Session.get('now'),
      user: Meteor.userId()
    };
}, FindBox);