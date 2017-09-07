import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import Model from '../smallUi/Model.jsx';
import NCSkip from '../river/NCSkip.jsx';
import {NCSnooze} from '../river/NCSkip.jsx';
import {NCUnSkip} from '../river/NCSkip.jsx';

/*
ncData={batchData.nonCon}
id={batchData._id}
serial={itemData.serial}
nons={app.nonConOption}
*/

export default class NonConSkip extends Component {
  
  nonCons() {
    relevant = this.props.ncData.filter( 
        x => x.serial === this.props.serial && x.inspect === false );
    relevant.sort((n1, n2)=> {
      if (n1.ref < n2.ref) { return -1 }
      if (n1.ref > n2.ref) { return 1 }
      return 0;
    });
    return relevant;
  }
        
  render () {
    
    let nc = this.nonCons();
    
    let now = Session.get('nowStep');
		let lock = now === 'done';
    
    let button = 
      <span className='actionIconWrap'>
        <label htmlFor='dtToggle' id='boltSwitch' className='navIcon'>
          <i className="fa fa-angle-double-right fa-2x fa-inverse yellowT"></i>
          <span className='actionIconText yellowT'>skip {Pref.nonCon}s</span>
        </label>
      </span>;
    

    return (
      <Model
        button={button}
        title={'Skip ' + Pref.nonCon + 's for ' + this.props.serial}
        type='transparent'
        lock={lock}>
        <div>
          <p>Repaired and inspected {Pref.nonCon}s are locked</p>
          <p>Snoozed {Pref.nonCon}s will automaticaly by re-activated at the finish step</p>
          <br />
          <table className='wide'>
            <tbody>
              {nc.map( (entry, index)=>{
                return (
                  <EditLine
                    key={index}
                    id={this.props.id}
                    ncKey={entry.key}
                    ncref={entry.ref}
                    nctype={entry.type}
                    skip={entry.skip}
                    comm={entry.comm}
                    lock={entry.inspect}
                    nons={this.props.nons}
                  />
                )})}
            </tbody>
          </table>
          <br />
        </div>
      </Model>
    );
  }
}



class EditLine extends Component {
    
  render() {
    return(
      <tr>
        <td className='bigger up'>
          {this.props.ncref}
        </td>
        <td className='bigger cap'>
          {this.props.nctype}
        </td>
        <td>
          {!this.props.skip ?
            null
          :
            this.props.comm === 'sn00ze' ?
              <span>
                <i className='fa fa-clock-o fa-2x'></i>
                <i className='big'>{Pref.snoozeDescribe}</i>
              </span>
            :
              <span>
                <i className='fa fa-truck fa-2x'></i>
                <i className='big'>{Pref.skipDescribe}</i>
              </span>
          }
        </td>
        <td>
          {!this.props.skip || this.props.comm === 'sn00ze' ?
            <NCSkip 
              id={this.props.id}
              ncKey={this.props.ncKey}
              lock={this.props.lock} />
          : null}
        </td>
        <td>
          {this.props.skip ?
            <NCUnSkip
              id={this.props.id}
              ncKey={this.props.ncKey}
              lock={this.props.lock} />
          : 
            <NCSnooze 
              id={this.props.id}
              ncKey={this.props.ncKey}
              lock={this.props.lock} />
          }
        </td>
      </tr>
    );
  }
}