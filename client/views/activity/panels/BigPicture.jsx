import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

export default class BigPicture extends Component	{
  
  constructor() {
    super();
    this.state = {
      now: false,
    };
  }
  
  relevant() {
    Meteor.call('bigNow', (error, reply)=> {
      error ? console.log(error) : null;
      this.setState({'now': reply});
    });
  }

  render() {
    
    const now = this.state.now;
    
    if(!now) {
      return (
        <div>
          loading...
        </div>
      );
    }
    
    return (
      <div className='section'>
        <div className=''>
          <i>Active: {now.active}</i>
          <i>Active Today: {now.today}</i>
          <i>Finished Today: {now.doneToday}</i>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.relevant();
  }
}