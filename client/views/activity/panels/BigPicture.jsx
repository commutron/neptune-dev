import React, {Component} from 'react';
import moment from 'moment';
import timezone from 'moment-timezone';
import Pref from '/client/global/pref.js';
import NumBox from '/client/components/uUi/NumBox.jsx';
import NonConTypePie from '/client/components/charts/NonConTypePie.jsx';

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
    
    return (
      <div className='wipCol'>
        <div className='centreRow wide'>
          <NumBox
            num={now.outstanding}
            name={'Outstanding ' + Pref.batch + 's'}
            color='blueT' />
          <NumBox
            num={now.today}
            name={'Active ' + Pref.batch + 's'}
            color='blueT' />
          <NumBox
            num={now.newHistoryTotal}
            name='History Pings'
            color='blueT' />
          <NumBox
            num={now.doneBatches}
            name={'finished ' + Pref.batch + 's'}
            color='greenT' />
        </div>
        <section>
          <em>current benchmarks, coming soon</em>
        </section>
        <section className='wide centre'>
          <i className='redT cap centreText'>{'types of discovered ' + Pref.nonCon + 's'}</i>
          <NonConTypePie ncTypes={now.ncTypeCounts} fullWidth={true} />
        </section>
      </div>
    );
  }
}