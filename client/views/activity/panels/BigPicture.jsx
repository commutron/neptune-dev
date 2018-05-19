import React, {Component} from 'react';
import moment from 'moment';
import timezone from 'moment-timezone';
import Pref from '/client/global/pref.js';
import NumBox from '/client/components/uUi/NumBox.jsx';
import PopGroupWIP from '/client/components/charts/PopGroupWIP.jsx';
import NonConTypePie from '/client/components/charts/NonConTypePie.jsx';

export default class BigPicture extends Component	{

  render() {
    
    const now = this.props.now;
    const wip =this.props.wip;
    
    let range = moment(now.start).isSame(now.end, 'day') ? 'today' : 'this week';
    
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
        <section className='wide centre'>
          <p className='centreText'>
            <i className='blueT cap'>{Pref.group + 's in Progress'}</i>
          </p>
          <PopGroupWIP wip={wip} />
        </section>
        <section className='wide centre'>
          <p className='centreText'>
            <i className='redT cap'>{'types of ' + Pref.nonCon + 's'}</i>
            <br /><i>Discovered {range}</i>
          </p>
          <NonConTypePie ncTypes={now.ncTypeCounts} fullWidth={true} />
        </section>
      </div>
    );
  }
}