import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

// props
/// id={b._id}
/// widget={w}
/// lock={!more}

export default class RiverSelect extends Component	{

  save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const batchID = this.props.id;
    let flow = this.choice.value;
    flow === 'false' ? flow = false : null;
    let flowAlt = this.choiceAlt.value;
    flowAlt === 'false' ? flowAlt = false : null;

      Meteor.call('setRiver', batchID, flow, flowAlt, (error, reply)=>{
        if(error)
          console.log(error);
        reply ? Bert.alert(Alert.success) : Bert.alert(Alert.warning);
        this.go.disabled = false;
      });
  }
  

  render() {
    return (
      <Model
        button={Pref.flow}
        title={'Select ' + Pref.flow}
        type='action clear greenT'
        lock={!Roles.userIsInRole(Meteor.userId(), 'run') || this.props.lock}
      >
        <form className='centre' onSubmit={this.save.bind(this)}>
          <p>
            <select id='fch' ref={(i)=> this.choice = i} defaultValue={this.props.river} required>
            <option></option>
            {this.props.widget.flows.map( (entry, index)=>{
              return(
               <option key={index} value={entry.flowKey}>{entry.title}</option>
               );
            })}
            </select>
            <label htmlFor='fch'>Choose {Pref.buildFlow}</label>
          </p>
          <br />
          <br />
          <p>
            <select id='fch' ref={(i)=> this.choiceAlt = i} defaultValue={this.props.riverAlt}>
            <option value={false}></option>
            {this.props.widget.flows.map( (entry, index)=>{
              return(
               <option key={index} value={entry.flowKey}>{entry.title}</option>
               );
            })}
            </select>
            <label htmlFor='fch'>Choose {Pref.buildFlowAlt}</label>
          </p>
          <br />
          <button
            type='submit'
            ref={(i)=> this.go = i}
            disabled={false}
            className='action clear greenT'
          >Save</button>
        </form>
      </Model>
    );
  }
}