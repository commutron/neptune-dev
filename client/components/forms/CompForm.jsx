import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import Model from '../smallUi/Model.jsx';

export default class CompForm extends Component	{
  
  addParts(e) {
    e.preventDefault();
    this.go.disabled = true;
    
    const id = this.props.id;
    const vKey = this.props.versionKey;
    const allNums = this.parts.value.trim().toLowerCase();
    
    const alterOne = allNums.replace(/\s* \s*/gi, "|");// spaces
    const alterTwo = alterOne.replace(/[\n\r]/g, "|");// new line
    const split = alterTwo.split("|");// split into array
    
    let indieNums = [... new Set(split) ];
    
    Meteor.call('pushComp', id, vKey, indieNums, (error)=>{
      if(error)
        console.log(error);
      this.parts.value = '';
      this.go.disabled = false;
    });
  }
  
  render() {
    return (
      <Model
        button={'Add ' + Pref.comp + 's'}
        title={'Add ' + Pref.comp + 's'}
        color='greenT'
        icon='fa-microchip'
        smIcon={true}
        lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'edit'])}>
        <form id='new' className='centre' onSubmit={this.addParts.bind(this)}>
          <p>Add multiple {Pref.comp}s seperated by pipe, space or new line</p>
          <p>
            <textarea
              id='pnum'
              ref={(i)=> this.parts = i}
              cols='40'
              rows='15'
              autoFocus='true'></textarea>
            <label htmlFor='pnum'>{Pref.comp} Numbers</label>
          </p>
          <p>
            <button
              ref={(i)=> this.go = i}
              disabled={false}
              className='action clearGreen'
              type='submit'>Add</button>
          </p>
        </form>
      </Model>
    );
  }
}