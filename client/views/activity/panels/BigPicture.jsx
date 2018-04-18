import React, {Component} from 'react';
import moment from 'moment';
import timezone from 'moment-timezone';
import Pref from '/client/global/pref.js';
import NumBox from '/client/components/uUi/NumBox.jsx';
import NonConTypePie from '/client/components/charts/NonConTypePie.jsx';

import SimpleRate from '/client/components/charts/SimpleRate.jsx';

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
    
    // now.todayNC = quantity of batches with new nonCons
    
    return (
      <div className='wipCol'>
        <section className='balance dblSection'>
          <div className='centreRow'>
            <NumBox
              num={now.outstanding}
              name={'Outstanding ' + Pref.batch + 's'}
              color='blueT' />
            <NumBox
              num={now.today}
              name={'Active ' + Pref.batch + 's'}
              color='blueT' />
            {/*
            <NumBox
              num={now.historyCount}
              name={'Total History Events'}
              color='blueT' />
            */}
            <NumBox
              num={now.doneBatches}
              name={'finished ' + Pref.batch + 's'}
              color='greenT' />
            <NumBox
              num={now.doneItems}
              name={'finished ' + Pref.item + 's'}
              color='greenT' />
            <NumBox
              num={now.doneUnits}
              name={'finished ' + Pref.unit + 's'}
              color='greenT' />
          </div>
        </section>
        <section>
          <SimpleRate
            dataOne={[]}
            titleOne={false}
            dataTwo={now.newNCOverTime}
            titleTwo={Pref.nonCon + 's'}
            dataThree={now.doneUnitsOT}
            titleThree={'finished ' + Pref.unit + 's'}
            lastDay={now.end}
            live={now.live}
            timeRange={this.props.timeRange} />
        </section>
        <section className='wide centre'>
          <i className='redT cap centreText'>{'types of discovered ' + Pref.nonCon + 's'}</i>
          <NonConTypePie ncTypes={now.ncTypeCounts} fullWidth={true} />
        </section>
      </div>
    );
  }
}