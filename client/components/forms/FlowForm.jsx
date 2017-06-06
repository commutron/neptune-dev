import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';
import FlowBuilder from '../bigUi/FlowBuilder.jsx';

// requires
// id = widget ID
// existFlows = existing flows
// options = buildStep options from the app settings
// end = lastStep from app settings

export default class FlowForm extends Component	{

  constructor() {
    super();
    this.state = {
      fill: false,
      warn: false,
      flow: false
   };
  }
  
  back() {
    this.setState({ fill: false});
    this.setState({ warn: false});
  }
  
  setFlow(recSet) {
    let input = recSet;
    this.setState({ flow: [...input] });
  }
  
  clearFlow() {
    this.setState({ flow: false });
  }
  
  
  save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const widgetId = this.props.id;
    const flowObj = this.state.flow;
    
    const flowTitle = this.title.value.trim().toLowerCase();
    
    if(!flowObj) {
      Bert.alert(Alert.warning);
    }else{
      Meteor.call('pushFlow', widgetId, flowTitle, flowObj, (error)=>{
        if(error)
          console.log(error);
        Bert.alert(Alert.success);
        this.title.value = '';
        this.out.value = 'saved';
        this.setState({ flow: false });
      });
    }
    
    /*
    function edit(id, rma, ncar, bars, after) {
      Meteor.call('editRMA', id, rma, ncar, bars);
    }*/
  }
    
  clean() {
    this.out.value = '';
  }
  
  option() {
    const optn = this.pick.value;
    if(optn !== 'blank') { 
      Meteor.call('activeFlowCheck', optn, (error, reply)=>{
        if(error)
          console.log(error);
        this.setState({ warn: reply});
        this.setState({ fill: optn});
      });
    }else{
      this.setState({ fill: optn});
    }
  }

  render() {
    
    const f = this.state.fill;
    const e = f ? this.props.existFlows.find( x => x.flowKey === f ) : false;
    
    const warn = this.state.warn ? this.state.warn : false;
    console.log(warn);
    
    const eN = e ? e.title : '';

    return (
      <Model
        button='flow form'
        title='flow form'
        lock={!Roles.userIsInRole(Meteor.userId(), 'power') || this.props.lock}>
        
        
        {!this.state.fill ?
        
          <div className='centre'>
          <p>choose</p>
            <select ref={(i)=> this.pick = i} onChange={this.option.bind(this)}>
              <option></option>
              <option value='blank'>New</option>
              {this.props.existFlows.map( (entry, index)=>{
                return(
                  <option key={index} value={entry.flowKey}>{entry.title}</option>
              )})}
            </select>
          </div>
          
          :
    
    
        <div>
          <div className='space'>
          <button className='action clear' onClick={this.back.bind(this)}>back</button>
            <form
              id='flowSave'
              className='centre'
              onSubmit={this.save.bind(this)}
              onChange={this.clean.bind(this)}
            >
            {warn ?
              <div className='centre'>
                <p><b>{eN}</b> is in used by</p>
                {warn === 'liveRiver' ?
                  <h3>An Active {Pref.batch} as the {Pref.buildFlow}</h3>
                : warn === 'liveAlt' ?
                  <h3>An Active {Pref.batch} as the {Pref.buildFlowAlt}</h3>
                : warn === 'liveAlt' ?
                  <h3>An Inactive {Pref.batch} as the {Pref.buildFlow}</h3>
                : warn === 'liveAlt' ?
                  <h3>An Inactive {Pref.batch} as the {Pref.buildFlowAlt}</h3>
                :
                  <p>something</p>}
              </div>
            : null}
              <p><label htmlFor='flwttl'>{Pref.flow} title</label><br />
                <input
                  type='text'
                  ref={(i)=> this.title = i}
                  id='flwttl'
                  defaultValue={eN}
                  placeholder='title the defines this flow'
                  required />
              </p>
            </form>
          </div>
          
          <hr />
          
          <FlowBuilder
            options={this.props.options}
            end={this.props.end}
            onClick={e => this.setFlow(e)}
            onClear={e => this.clearFlow()} />
            
          <hr />
  
          <div className='space centre'>
            <button
              type='submit'
              ref={(i)=> this.go = i}
              disabled={!this.state.flow}
              form='flowSave'
              className='action clear greenT'>SAVE</button>
            <p><output ref={(i)=> this.out = i} /></p>
            <br />
          </div>
        </div>}
      </Model>
    );
  }
}


export class FlowRemove extends Component	{
  
  pull() {
    Meteor.call('pullFlow', this.props.id, this.props.fKey, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply === 'inUse') {
        Bert.alert(Alert.inUse);
      }else if(reply) {
        Bert.alert( Alert.success );
      }else{
        Bert.alert( Alert.warning );
      }
    });
  }
  
  render() {
    
    return(
      <button
        className='actionSmall clear redT'
        onClick={this.pull.bind(this)}
        disabled={!Roles.userIsInRole(Meteor.userId(), 'power')}
      >delete</button>
    );
  }
}