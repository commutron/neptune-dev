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
    
    console.log(now.ncTypeCounts);
    
    return (
      <div className='wipCol'>
        <div className=''>
          <p>Active: {now.active}</p>
          <p>Active Today: {now.today}</p>
          <p>{now.newNC} {Pref.nonCon}s discovered today from {now.todayNC} {Pref.batch}s</p>
          <p>{Pref.item}s finished Today: {now.doneItemsToday}</p>
          <p>{Pref.batch}s Finished Today: {now.doneToday}</p>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.relevant();
  }
}