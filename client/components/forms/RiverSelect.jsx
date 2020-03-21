import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

const RiverSelect = ({ id, widget, river, riverAlt, lock, noText })=> (
  <ModelMedium
    button={Pref.flow}
    title={'select ' + Pref.flow}
    color='greenT'
    icon='fa-project-diagram'
    lock={!Roles.userIsInRole(Meteor.userId(), 'run') || lock}
    noText={noText}>
    <RiverSelectForm
      id={id}
      widget={widget}
      river={river}
      riverAlt={riverAlt} />
  </ModelMedium>
);
      
      
const RiverSelectForm = ({ id, widget, river, riverAlt, selfclose })=> {

  function save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const batchID = id;
    let flow = this.choice.value;
    flow === 'false' ? flow = false : null;
    let flowAlt = this.choiceAlt.value;
    flowAlt === 'false' ? flowAlt = false : null;

      Meteor.call('setRiver', batchID, flow, flowAlt, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('Saved');
          selfclose();
        }else{
          toast.error('Server Error');
          this.go.disabled = false;
        }
      });
  }
  
  return(
    <form className='centre' onSubmit={(e)=>save(e)}>
      <p>
        <select id='choice' defaultValue={river} required>
        <option></option>
        {widget.flows.map( (entry, index)=>{
          return(
           <option key={index} value={entry.flowKey}>{entry.title}</option>
           );
        })}
        </select>
        <label htmlFor='choice'>Enable {Pref.buildFlow}</label>
      </p>
      <p>
        <select id='choiceAlt' defaultValue={riverAlt}>
        <option value={false}></option>
        {widget.flows.map( (entry, index)=>{
          return(
           <option key={index} value={entry.flowKey}>{entry.title}</option>
           );
        })}
        </select>
        <label htmlFor='choiceAlt'>Enable <em>optional</em> {Pref.buildFlowAlt} if needed</label>
      </p>
      <br />
      <button
        type='submit'
        id='go'
        disabled={false}
        className='action clearGreen'
      >Save</button>
    </form>
  );
};

export default RiverSelect;