import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
//import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Spin from '../../components/uUi/Spin.jsx';
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
    };
  }
  
  timeRange(keyword) {
    this.setState({
      timeRange: keyword,
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
    Meteor.call('activitySnapshot', range, clientTZ, (error, reply)=> {
      error && console.log(error);
      this.setState({ now: reply.now, wip: reply.wip });
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
        <div key={0}>
          <RangeTools
            onChange={(r) => this.timeRange(r)}
            dfkeyword={this.state.timeRange}
            update={this.state.time} />
          <span>
            <BigPicture
              g={this.props.g}
              w={this.props.w}
              b={this.props.b}
              a={this.props.a}
              now={this.state.now}
              wip={this.state.wip}
              timeRange={this.state.timeRange} />
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
    Bert.alert(Alert.wait);
    this.relevant();
    this.interval = setInterval(() => this.relevant(), 1000*60*60);
  }
}