import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

const FindBox = ({ orb, user, append })=> {
    
  function setVar(e) {
    e.preventDefault();
    const chosen = this.lookup.value.trim().toLowerCase();
      Session.set('now', chosen);
        this.lookup.value = '';
        this.lookup.select();
  }
  
  let holder = !append ? orb?.startsWith('Eq') ? orb.substring(3) :
                orb : append + ' ~ ' + orb;
  let last = holder || 'Search';
  let lock = user ? false : true;
  
  const fsty = {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: 'rgb(25,25,25)',
    padding: '0',
    margin: '0'
  };
  
  const isty = {
    textAlign: 'center',
    lineHeight: 'normal',
    height: '100%',
    minHeight: 'min-content',
    width: '100%',
  	border: 'none',
    padding: '0',
    borderRadius: '0%',
    wordBreak: 'normal'
  };
  
	return (
    <form 
      style={fsty} 
      onSubmit={(e)=>setVar(e)}
      autoComplete='off'>
      <input
        autoFocus={true}
        type='search'
        id='lookup'
        aria-label='main searchbox'
        style={isty}
        className='up numFont'
        placeholder={last}
        disabled={lock}
        spellCheck={false}
      />
    </form>
  );
};

export default withTracker( (props) => {
    return {
      orb: Session.get('now'),
      user: Meteor.userId(),
      append: props.append
    };
})(FindBox);