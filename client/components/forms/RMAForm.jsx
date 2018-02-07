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
    const quC = edit ? edit.comm : '';
    const title = edit ? 'edit ' + Pref.rmaProcess : 'create ' + Pref.rmaProcess;
    const bttn = edit ? 'edit' : Pref.rmaProcess;
    
    return (
      <Model
        button={bttn}
        title={title}
        color='orangeT'
        icon='fa-cog'
        smIcon={this.props.small}
        lock={!Roles.userIsInRole(Meteor.userId(), ['qa'])}>
        <div className='space'>
          <form
            id='rmaSave'
            className='centre'
            onSubmit={this.save.bind(this)}
            onChange={this.clean.bind(this)}
          >
            <p>
              <input
                type='text'
                id='rum'
                ref={(i)=> this.rmaNum = i}
                defaultValue={numE}
                placeholder='RMA Number'
                required />
              <label htmlFor='rum'>RMA number</label>
            </p>
            <p>
              <input
                type='number'
                id='qu'
                ref={(i)=> this.quant = i}
                defaultValue={quE}
                placeholder='0 is infinite' />
              <label htmlFor='qu'>Quantity</label>
            </p>
            <p>
              <input
                type='text'
                id='comm'
                ref={(i)=> this.comm = i}
                defaultValue={quC}
                placeholder='other details' />
              <label htmlFor='comm'>Comment</label>
            </p>
          </form>
        </div>
        
        <hr />
        
        {!this.props.edit ?
        
          <FlowBuilder
            options={this.props.options.filter( x => x.type !== 'first')}
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
            className='action clearGreen'>SAVE</button>
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