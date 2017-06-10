import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';
import FlowBuilder from '../bigUi/FlowBuilder.jsx';
//requires
// id
// barcode

export default class RMAForm extends Component {
  
  constructor() {
    super();
    this.state = {
      flow: false
    };
  }
  
  setFlow(recSet) {
    let input = recSet;
    if(!input) {
      this.setState({ flow: false });
    }else{
      this.setState({ flow: [...input] });
    }
  }
  
  save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const cKey = this.props.edit.key;
    const id = this.props.id;
    const flowObj = this.state.flow;
    
    const rmaId = this.rmaNum.value.trim().toLowerCase();
    const quantity = this.quant.value.trim().toLowerCase();
    const comm = this.comm.value.trim().toLowerCase();
    
    if(cKey) {
      Meteor.call('editRMACascade', id, cKey, rmaId, quantity, comm, (error)=>{
        if(error)
          console.log(error);
        Bert.alert(Alert.success);
        this.out.value = 'saved';
      });
      
    }else{
    
      if(!flowObj) {
        Bert.alert(Alert.warning);
      }else{
        Meteor.call('addRMACascade', id, rmaId, quantity, comm, flowObj, (error)=>{
          if(error)
            console.log(error);
          Bert.alert(Alert.success);
          this.rmaNum.value = '';
          this.quant.value = '';
          this.comm.value = '';
          this.out.value = 'saved';
          this.setState({ flow: false });
        });
      }
    }
  }
  
  clean() {
    this.out.value = '';
  }

  render () {
    
    const edit = this.props.edit ? this.props.edit : false;
    const numE = edit ? edit.rmaId : '';
    const quE = edit ? edit.quantity : '';

    return (
      <Model
        button='rma'
        title={'create ' + Pref.rma}
        type='action clear yellowT'
        lock={!Roles.userIsInRole(Meteor.userId(), ['edit', 'qa'])}>
        <div className='space'>
          <form
            id='rmaSave'
            className='centre'
            onSubmit={this.save.bind(this)}
            onChange={this.clean.bind(this)}
          >
            <p><label htmlFor='rum'>RMA number</label><br />
              <input
                type='text'
                id='rum'
                ref={(i)=> this.rmaNum = i}
                defaultValue={numE}
                placeholder='RMA Number'
                required />
            </p>
            <p><label htmlFor='qu'>Quantity</label><br />
              <input
                type='number'
                id='qu'
                ref={(i)=> this.quant = i}
                placeholder='0 is infinite' />
            </p>
            <p><label htmlFor='comm'>Comment</label><br />
              <input
                type='text'
                id='comm'
                ref={(i)=> this.comm = i}
                placeholder='other details' />
            </p>
          </form>
        </div>
        
        <hr />
        
        {!this.props.edit ?
        
          <FlowBuilder
            options={this.props.options}
            end={this.props.end}
            baseline={false}
            onClick={e => this.setFlow(e)} />
            
        : <p>{Pref.flow} is locked</p>}
          
        <hr />
        
        <div className='space centre'>
          <button
            type='submit'
            ref={(i)=> this.go = i}
            disabled={!this.state.flow}
            form='rmaSave'
            className='action clear greenT'>SAVE</button>
          <p><output ref={(i)=> this.out = i} /></p>
          <br />
        </div>
      </Model>
    );
  }
  
  componentDidMount() {
    this.props.edit ? this.setState({ flow: true }) : null;
  }
}