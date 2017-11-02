import React, {Component} from 'react';
import moment from 'moment';
import timezone from 'moment-timezone';
import Pref from '/client/global/pref.js';
import NumBox from '/client/components/uUi/NumBox.jsx';

import RangeTools from '/client/components/smallUi/RangeTools.jsx';

export default class BigPicture extends Component	{

  render() {
    
    const now = this.props.now;
    
    if(!now) {
      return (
        <div className='space'>
          <i className='fa fa-circle-o-notch fa-spin fa-3x' aria-hidden='true'></i>
          <span className='sr-only'>Loading...</span>
        </div>
      );
    }
    
    console.log(now.ncTypeCounts);
    
    // now.todayNC = quantity of batches with new nonCons
    
    return (
      <div className='wipCol'>
        <section className='space'>
          <div>
            <NumBox
              num={now.active}
              name={'Outstanding ' + Pref.batch + 's'}
              color='blueT' />
            <NumBox
              num={now.today}
              name={'Active ' + Pref.batch + 's'}
              color='blueT' />
            <NumBox
              num={now.newNC}
              name={'new ' + Pref.nonCon + 's'}
              color='redT' />
            <NumBox
              num={now.doneToday}
              name={'finished ' + Pref.batch + 's'}
              color='greenT' />
            <NumBox
              num={now.doneItemsToday}
              name={'finished ' + Pref.item + 's'}
              color='greenT' />
          </div>
        </section>
      </div>
    );
  }
}