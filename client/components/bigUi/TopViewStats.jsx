import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import NumBox from '/client/components/uUi/NumBox.jsx';

export default class TopViewStats extends Component {
  
  constructor() {
    super();
    this.state = {
      counts: false,
    };
  }
  
  counts() {
    let users = this.props.users;
    let groups = this.props.groups;
    let widgets = this.props.widgets;
    let batches = this.props.batches;
    let live = this.props.live;
    Meteor.call('topViewStats', users, groups, widgets, batches, live, (error, reply)=> {
      error ? console.log(error) : null;
      this.setState({ counts: reply });
    });
  }
  
  render () {
    
    const counts = this.state.counts;
    
    if(!counts) {
      return(
        <CalcSpin />
      );
    }
    
    return(
      <div className='centreRow'>
        {this.props.users &&
          <NumBox
            num={counts.usrC}
            name={Pref.user + 's'}
            color='blueT' />}
        {this.props.groups &&
          <NumBox
            num={counts.grpC}
            name={Pref.group + 's'}
            color='blueT' />}
        {this.props.widgets &&
          <NumBox
            num={counts.wdgtC}
            name={Pref.widget + 's'}
            color='blueT' />}
        {this.props.batches &&
          <NumBox
            num={counts.btchC}
            name={'Total ' + Pref.batch + 's'}
            color='blueT' />}
        {this.props.live &&
          <NumBox
            num={counts.btchLv}
            name={'Live ' + Pref.batch + 's'}
            color='blueT' />}
        {this.props.live &&
          <NumBox
            num={counts.btchC - counts.btchLv}
            name={'Finished ' + Pref.batch + 's'}
            color='greenT' />}
      </div>
    );
  }
  componentDidMount() {
    this.counts();
  }
}