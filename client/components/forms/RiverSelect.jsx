import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

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
        reply ? toast.success('Saved') : toast.error('Server Error');
        this.go.disabled = false;
      });
  }
  

  render() {
    return (
      <ModelMedium
        button={Pref.flow}
        title={'select ' + Pref.flow}
        color='greenT'
        icon='fa-project-diagram'
        lock={!Roles.userIsInRole(Meteor.userId(), 'run') || this.props.lock}
        noText={this.props.noText}>
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
            <label htmlFor='fch'>Enable {Pref.buildFlow}</label>
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
            <label htmlFor='fch'>Enable <em>optional</em> {Pref.buildFlowAlt} if needed</label>
          </p>
          <br />
          <button
            type='submit'
            ref={(i)=> this.go = i}
            disabled={false}
            className='action clearGreen'
          >Save</button>
        </form>
      </ModelMedium>
    );
  }
}