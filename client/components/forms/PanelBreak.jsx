import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

export default class PanelBreak extends Component	{
  
  constructor() {
    super();
    this.state = {
      newSerials: []
    };
  }
  
  setSerials() {
    const srlInput = this.serials.value.trim().replace(",", " ");
    let cutInput = srlInput.split(/\s* \s*/gi);
    this.setState({ newSerials: cutInput });
  }
  
  splitApart(e) {
    e.preventDefault();
    const id = this.props.id;
    const batch = this.props.batch;
    const serial = this.props.item.serial;
    const newSerials = this.state.newSerials;
    
    if(newSerials.length > 0) {
      let overlap = newSerials.find( x => x === serial);
      if(!overlap) {
      const verfiy = confirm("This is destuctive of the original, are you sure?");
        if(verfiy === true) {
          Meteor.call('breakItemIntoUnits', id, serial, newSerials, (error, reply)=>{
            if(error)
            console.log(error);
          if(reply) {
            FlowRouter.go('/data/batch?request=' + batch);
            Bert.alert(Alert.success);
          }else{
            Bert.alert(Alert.warning);
          }
          });
        }else{Bert.alert(Alert.warning);}
      }else{Bert.alert(Alert.warning);}
    }else{Bert.alert(Alert.warning);}
  }

  render() {
        	    
    const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
    let done = this.props.item.finishedAt !== false;

    return(
      <Model
        button='Split Panel'
        title='Split Panel Into Its Units'
        color='yellowT'
        icon='fa-cut'
        lock={done || this.props.item.units < 2 || !auth}
        noText={this.props.noText}>
        <p className='medBig space'>
          <b>Transform this item into new individual units</b><br />
          <i>New Items are created with a copy of this item's history</i><br />
          <i>NonConformances WILL BE LOST</i><br />
          <i>The new serial numbers are NOT checked for duplicates</i><br />
          <i>The highest serial number is NOT saved in the app settings</i><br />
          <i>The original IS deleted</i><br />
        </p>
        <br />
        <form
          className='centre'
          onSubmit={this.splitApart.bind(this)}>
          <div className='balance'>
            <p>
              <textarea
                id='serials'
                ref={(i)=> this.serials = i}
                onChange={this.setSerials.bind(this)}
                cols='5'
                rows='5'
                defaultValue=''
                autoFocus='true'></textarea>
              <label htmlFor='con'>New serials for each new item</label>
              <br />
              <em>{this.props.item.units} numbers, seperated by a space</em>
            </p>
            <ol className='medBig'>
              {this.state.newSerials.map( (entry, index)=>{
                return( <li key={index}>{entry}</li> );
              })}
            </ol>
          </div>
          <p>
            <button
              ref={(i)=> this.go = i}
              disabled={this.state.newSerials.length !== this.props.item.units}
              className='action clearGreen'
              type='submit'>Split</button>
          </p>
        </form>
      </Model>
    );
  }
}