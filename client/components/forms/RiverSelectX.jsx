import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '../smallUi/ModelSmall';

const RiverSelectX = ({ 
  bID, widget, river, 
  //riverAlt,
  lock, noText, inLine
})=> (
  <ModelSmall
    button={Pref.flow}
    title={'select ' + Pref.flow}
    color='blueT'
    icon='fa-project-diagram'
    lock={!Roles.userIsInRole(Meteor.userId(), 'run') || lock}
    noText={noText}
    inLine={inLine} >
    <RiverSelectForm
      bID={bID}
      widget={widget}
      river={river}
      // riverAlt={riverAlt} 
    />
  </ModelSmall>
);
      
      
const RiverSelectForm = ({ 
  bID, widget, river, 
  //riverAlt, 
  selfclose })=> {

  function save(e) {
    e.preventDefault();
    this.rvrXgo.disabled = true;
    let flow = this.choice.value;
    flow === 'false' ? flow = false : null;
    // let flowAlt = this.choiceAlt.value;
    // flowAlt === 'false' ? flowAlt = false : null;

      Meteor.call('setRiverX', bID, flow, //flowAlt, 
      (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('Saved');
          this.rvrXgo.disabled = false;
          selfclose();
        }else{
          toast.error('Server Error');
          this.rvrXgo.disabled = false;
        }
      });
  }
  
  return(
    <form className='centre vmargin' onSubmit={(e)=>save(e)}>
      <p>
        <select id='choice' defaultValue={river} required>
        <option></option>
        {widget.flows.map( (entry, index)=>{
          return(
           <option key={index} value={entry.flowKey}>{entry.title}</option>
           );
        })}
        </select>
        <label htmlFor='choice'>Select {Pref.buildFlow}</label>
      </p>
      {/*<p>
        <select id='choiceAlt' defaultValue={riverAlt}>
        <option value={false}></option>
        {widget.flows.map( (entry, index)=>{
          return(
           <option key={index} value={entry.flowKey}>{entry.title}</option>
           );
        })}
        </select>
        <label htmlFor='choiceAlt'>Enable <em>optional</em> {Pref.buildFlowAlt}</label>
      </p>*/}
      <br />
      <button
        type='submit'
        id='rvrXgo'
        disabled={false}
        className='action clearGreen'
      >Save</button>
    </form>
  );
};

export default RiverSelectX;