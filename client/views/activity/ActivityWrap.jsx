import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import Spin from '../../components/tinyUi/Spin.jsx';
import RangeTools from '/client/components/smallUi/RangeTools.jsx';
import OrgWip from './panels/OrgWIP.jsx';
import BigPicture from './panels/BigPicture.jsx';

export default class OrgWIP extends Component	{
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  constructor() {
    super();
    this.state = {
      wip: false,
      now: false,
      time: false,
      timeRange: 'day',
      timeMod: false
    };
  }
  
  timeRange(keyword, mod) {
    this.setState({
      timeRange: keyword,
      timeMod: mod,
      now: false,
      wip: false,
      time: moment().format()
    }, ()=>{
      this.relevant();
    });
  }
  
  relevant() {
    this.setState({
      now: false,
      wip: false,
      time: moment().format()
    });
    let clientTZ = moment.tz.guess();
    let range = this.state.timeRange;
    let mod = this.state.timeMod;
    Meteor.call('activitySnapshot', range, clientTZ, mod, (error, reply)=> {
      error ? console.log(error) : null;
      this.setState({ now: reply.now, wip: reply.wip });
      console.log('newData');
    });
  }
  
  render() {
    
    if(!this.state.wip || !this.state.now) {
      return (
        <Spin />
      );
    }
    
    return(
      <AnimateWrap type='contentTrans'>
        <div className='denseData' key={0}>
          <RangeTools
            onChange={(r, m) => this.timeRange(r, m)}
            dfkeyword={this.state.timeRange}
            dfmod={this.state.timeMod}
            update={this.state.time} />
          <span>
            <BigPicture
              g={this.props.g}
              w={this.props.w}
              b={this.props.b}
              a={this.props.a}
              now={this.state.now} />
          </span>
          <span>
            <OrgWip 
              g={this.props.g}
              w={this.props.w}
              b={this.props.b}
              a={this.props.a}
              wip={this.state.wip} />
          </span>
        </div>
      </AnimateWrap>
    );
  }
  componentDidMount() {
    this.relevant();
    this.interval = setInterval(() => this.relevant(), 1000*60*60);
  }
}