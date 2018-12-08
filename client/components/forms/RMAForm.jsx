import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';
import FlowBuilder from '../bigUi/FlowBuilder.jsx';
//requires
// id
// barcode

export default class RMAForm extends Component {
  
  constructor() {
    super();
    this.state = {
      flow: false,
      nonCons: []
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
  
  handleNC() {
    const type = this.ncType.value.trim().toLowerCase();
    
    const refEntry = this.ncRefs.value.trim().toLowerCase();
    const refSplit = refEntry.split(/\s* \s*/);
    
    let allNonCons = this.state.nonCons;
    
    if(refSplit.length > 0 && refSplit[0] !== '') {
      for(let ref of refSplit) {
        ref = ref.replace(",", "");
        allNonCons.push({ref: ref, type: type});
      }
      this.setState({'nonCons': allNonCons });
      this.ncRefs.value = '';
    }else{null}
  }
  
  save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const cKey = this.props.edit.key;
    const id = this.props.id;
    const flowObj = this.state.flow;
    const nonConArr = this.state.nonCons;
    
    const rmaId = this.rmaNum.value.trim().toLowerCase();
    const quantity = this.quant.value.trim().toLowerCase();
    const comm = this.comm.value.trim().toLowerCase();
    
    if(cKey) {
      Meteor.call('editRMACascade', id, cKey, rmaId, quantity, comm, (error)=>{
        if(error)
          console.log(error);
        toast.success('Saved');
        this.out.value = 'saved';
      });
      
    }else{
    
      if(!flowObj) {
        toast.warning('Not saved');
      }else{
        Meteor.call('addRMACascade', id, rmaId, quantity, comm, flowObj, nonConArr, (error)=>{
          if(error)
            console.log(error);
          toast.success('Saved');
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
        icon='fa-exchange-alt'
        smIcon={this.props.small}
        lock={!Roles.userIsInRole(Meteor.userId(), ['qa'])}
        noText={this.props.noText}>
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
        
        <div className='centre'>
        
          <p><em>{Pref.nonCon}s to be attached automatically to every activated {Pref.item}</em></p>
          
          <br />
        
          <div className='inlineForm'>
      
            <input
              type='text'
              id='ncRefs'
              ref={(i)=> this.ncRefs = i}
              className='redIn up'
              placeholder={Pref.nonConRef} />
        
            <select 
              id='ncType'
              ref={(i)=> this.ncType = i}
              className='cap redIn'>
              {this.props.app.nonConOption.map( (entry, index)=>{
                return ( 
                  <option key={index} value={entry}>{index + 1}. {entry}</option>
                  );
              })}
            </select>
        
            <button
              type='button'
              id='addNC'
              onClick={(e)=>this.handleNC(e)}
              disabled={false}
              className='smallAction clearRed'
            >Add</button>
          
          </div>
          
          <br />
          
          <div>
            <dl>
              {this.state.nonCons.map( (entry, index)=>{
                return(
                  <dt key={index}>{entry.ref} - {entry.type}</dt>
              )})}
            </dl>
          </div>
              
      
        </div>

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