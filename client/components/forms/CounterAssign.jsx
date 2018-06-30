import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

// props
/// id={b._id}
/// widget={w}
/// lock={!more}

export default class CounterAssign extends Component	{

  handleAssign(e) {
    e.preventDefault();
    this.go.disabled = true;
    const batchID = this.props.id;
    let wfKey = this.choice.value;
    const option = this.props.app.countOption.find( x => x.key === wfKey);
    const wfGate = option ? option.gate : null;
    if(typeof wfKey === 'string' && wfGate) {
      Meteor.call('addCounter', batchID, wfKey, wfGate, (error, reply)=>{
        error && console.log(error);
        reply ? Bert.alert(Alert.success) : Bert.alert(Alert.warning);
        this.go.disabled = false;
        this.choice.value = '';
      });
    }else{
      Bert.alert(Alert.warning);
    }
  }
  
  handleRemove(wfKey) {
    const batchID = this.props.id;
    Meteor.call('removeCounter', batchID, wfKey, (error, reply)=>{
      error && console.log(error);
      reply ? reply === 'inUse' ?
      Bert.alert(Alert.inUse) :
      Bert.alert(Alert.success) : 
      Bert.alert(Alert.warning);
    });
  }

  render() {
    
    const cOp = this.props.app.countOption || [];
    
    return (
      <Model
        button={Pref.counter + 's'}
        title={'assign ' + Pref.counter + 's'}
        color='blueT'
        icon='fa-stopwatch'
        lock={!Roles.userIsInRole(Meteor.userId(), 'run') || this.props.lock}
        noText={this.props.noText}>
        <div>
          <p className='centreText'>A process gate marks the end of one phase and the start of the next.</p>
          <p className='centreText'>A counter is a record of items, without serial numbers, passing through a gate.</p>
          <form className='centre' onSubmit={this.handleAssign.bind(this)}>
            <p>
              <select id='fch' ref={(i)=> this.choice = i} required>
              <option></option>
              {cOp.map( (entry)=>{
                let opLock = this.props.waterfall.find( x => x.wfKey === entry.key);
                return(
                  <option 
                    key={entry.key} 
                    value={entry.key}
                    disabled={opLock}
                  >{entry.gate}</option>
                 );
              })}
              </select>
              <label htmlFor='fch'>Process Gate</label>
            </p>
            <p>
              <button
                type='submit'
                ref={(i)=> this.go = i}
                disabled={false}
                className='action clearGreen'
              >Add A Counter</button>
            </p>
          </form>
          <hr />
          <p className='centreText'>Saved, assigned counters.</p>
          <p className='centreText'>To preserve important data, only unstarted counters can be removed</p> 
          <div className='gateList'>
            {this.props.waterfall.map( (entry)=> {  
              return (                 
                <div key={entry.wfKey}>                      
                  <div>
                    {entry.gate}
                  </div>
                  <div>
                    <button
                      type='button'
                      name='Remove'
                      ref={(i)=> this.ex = i}
                      className='smallAction redHover'
                      onClick={this.handleRemove.bind(this, entry.wfKey)}
                      disabled={entry.counts.length > 0}
                    ><i className='fas fa-times'></i></button>
                  </div>
                </div>
              )})}
          </div>
        </div>
      </Model>
    );
  }
}