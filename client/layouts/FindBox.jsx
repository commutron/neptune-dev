import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import Pref from '/client/global/pref.js';

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

   let last = this.props.orb ? this.props.orb : 'Find';
   const lock = this.props.user ? false : true;

		return (
      <form 
        className='findForm' 
        onSubmit={this.setVar.bind(this)}
        autoComplete='off'>
        <input
          autoFocus='true'
          type='search'
          id='find'
          ref={(i)=> this.choose = i}
          className='up'
          placeholder={last}
          list='cuts'
          disabled={lock}
          />
        <datalist id='cuts' className='cap'>
          <option value={Pref.batch}>All {Pref.batch}s</option>
          <option value={Pref.group}>All {Pref.group}s</option>
          <option value={Pref.block}>{Pref.block}s</option>
          <option value={Pref.scrap}>All {Pref.scrap}ped {Pref.item}s</option>
        </datalist>
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