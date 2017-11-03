import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

class FindBox extends Component	{

  //// Set the Entered Number as Session Variable \\\\
  setVar(e) {
    e.preventDefault();
    const chosen = this.choose.value.trim().toLowerCase();
      Session.set('now', chosen);
        this.choose.value = '';
        this.choose.select();
  }

  render () {

   let last = this.props.orb ? this.props.orb : 'Search';
   const lock = this.props.user ? false : true;

		return (
      <form 
        className='findForm' 
        onSubmit={this.setVar.bind(this)}
        autoComplete='off'>
        <input
          autoFocus={true}
          type='search'
          id='find'
          ref={(i)=> this.choose = i}
          className='up'
          placeholder={last}
          disabled={lock}
          autoCorrect={false}
          autoCapitalize={false}
          spellCheck={false}
          />
      </form>
    );
  }
}

export default createContainer( () => {
    return {
      orb: Session.get('now'),
      user: Meteor.userId()
    };
}, FindBox);