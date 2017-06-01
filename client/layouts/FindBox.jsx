import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

export default class FindBox extends Component	{

  //// Set the Entered Number as Session Variable \\\\
  setVar(e) {
    e.preventDefault();
    const chosen = this.refs.choose.value.trim().toLowerCase();
      Session.set('now', chosen);
        this.refs.choose.value='';
        this.refs.choose.select();
  }

  render () {

   let last = this.props.orb ? this.props.orb : 'Find';

		return (
      <form 
        className='findForm' 
        onSubmit={this.setVar.bind(this)}
        autoComplete='off'>
        <input
          autoFocus='true'
          type='search'
          id='find'
          ref='choose'
          className='up'
          placeholder={last}
          list='cuts'
          />
        <datalist id='cuts' className='cap'>
          <option value={Pref.batch}>All {Pref.batch}s</option>
          <option value={Pref.group}>All {Pref.group}s</option>
          <option value={Pref.missingPart}>All {Pref.missingPart} parts</option>
          <option value={Pref.scrap}>All {Pref.scrap}ped {Pref.item}s</option>
        </datalist>
      </form>
    );
  }
}