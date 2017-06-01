import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

// props
/// id={b._id}
/// barcode={i.serial}
/// river={b.river}
/// riverAlt={b.riverAlt}
/// flows={w.flows}

export default class RiverFork extends Component {
  
  activate(input) {
    const id = this.props.id;
    const bar = this.props.barcode;
    const choice = input;
    
    Meteor.call('forkItem', id, bar, choice, (error, reply)=>{
      if(error)
      console.log(error);
    reply ? null : Bert.alert(Alert.warning);
    });
  }
  
  
  render() {
    
    let flow = this.props.flows.find(x => x.flowKey === this.props.river);
    flow ? flow = flow.title : flow = false;
    let flowAlt = this.props.flows.find(x => x.flowKey === this.props.riverAlt);
    flowAlt ? flowAlt = flowAlt.title : flowAlt = false;
    
    let sty = {
      height: '5em',
      fontSize: '1.5rem'
    };
    
    return (
      <div className='wide'>
        <button
          title='regular flow'
          className='action clear blueT wide'
          style={sty}
          onClick={this.activate.bind(this, 'no')}
          disabled={!flow}
        >{flow}</button>
        <button
          title={'alternative ' + Pref.buildFlow}
          className='action clear blueT wide'
          style={sty}
          onClick={this.activate.bind(this, 'yes')}
          disabled={!flowAlt}
        >{flowAlt}</button>
      </div>
    );
  }
}