import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

export default class BlockForm extends Component {

  addBlock(e) {
    e.preventDefault();
    this.go.disabled = true;
    const batchId = this.props.id;
    
    const blKey = this.props.edit ? this.props.edit.key : false;
    const text = this.blTxt.value.trim();
    
    if(this.props.xBatch) {
      if(blKey) {
        Meteor.call('editBlockX', batchId, blKey, text, (error, reply)=>{
          error && console.log(error);
          !reply && toast.error('Server Error');
        });
      }else{
        Meteor.call('addBlockX', batchId, text, (error, reply)=>{
          error && console.log(error);
          reply ? this.blTxt.value='' : toast.error('Server Error');
        });
      }
    }else{
      if(blKey) {
        Meteor.call('editBlock', batchId, blKey, text, (error, reply)=>{
          if(error)
            console.log(error);
          if(reply) {
          }else{
            toast.error('Server Error');
          }
        });
      }else{
        Meteor.call('addBlock', batchId, text, (error, reply)=>{
          if(error)
            console.log(error);
          if(reply) {
            this.blTxt.value='';
          }else{
            toast.error('Server Error');
          }
        });
      }
    }
  }


  render () {
    
    const edit = this.props.edit;
    const eTx = edit ? edit.block : '';
    const bttn = edit ? 'edit' : 'Add ' + Pref.block;
    const title = edit ? 'edit ' + Pref.block : 'add ' + Pref.block;

    return(
      <ModelMedium
        button={bttn}
        title={title}
        color='yellowT'
        icon='fa-exclamation-triangle'
        smIcon={this.props.smIcon}
        lock={!Roles.userIsInRole(Meteor.userId(), 'run') || this.props.lock}
        noText={this.props.noText}>
        <div>
          <form className='centre' onSubmit={this.addBlock.bind(this)}>
            <p>
              <textarea
                type='text'
                id='blk'
                ref={(i)=> this.blTxt = i}
                cols='30'
                rows='6'
                placeholder='110072 short 25pcs'
                defaultValue={eTx}
                autoFocus={true}
                required>
              </textarea>
              <label htmlFor='blk'>Describe the Impediment</label>
            </p>
            <br />
            <p><button
              type='submit'
              ref={(i)=> this.go = i}
              disabled={this.props.lock}
              className='action clearGreen'>{Pref.post}</button>
            </p>
          </form>
          <br />
        </div>
      </ModelMedium>
    );
  }
}


export class SolveBlock extends Component {
  
  addSolve(e) {
		const id = this.props.id;
		const blKey = this.props.blKey;
    const act = prompt('Solution', '');
    !act ? null : act.trim();
    if(!act || act === '') {
      null;
    }else{
      if(this.props.xBatch) {
        Meteor.call('solveBlockX', id, blKey, act, (error, reply)=> {
          error && console.log(error);
          reply ? toast.success('Saved') : toast.error('Server Error'); 
  			});
      }else{
        Meteor.call('solveBlock', id, blKey, act, (error, reply)=> {
          if(error)
            console.log(error);
          reply ? toast.success('Saved') : toast.error('Server Error');
  			});
      }
    }
  }
  
  render() {
    return(
      <button
        type='button'
        title={'Solve this ' + Pref.block}
        className='transparent'
        ref={(i)=> this.go = i}
        onClick={this.addSolve.bind(this)}
        disabled={this.props.lock}>
        <label className='navIcon actionIconWrap'>
          <i className='fas fa-check-circle greenT'></i>
          {!this.props.noText && <span className='actionIconText greenT'>Solve</span>}
        </label>
      </button>
    );
  }
}

export class RemoveBlock extends Component {
  
  remove() {
		const id = this.props.id;
		const blKey = this.props.blKey;
		if(this.props.xBatch) {
      Meteor.call('removeBlockX', id, blKey, (error, reply)=> {
        error && console.log(error);
        reply ? toast.success('Saved') : toast.error('Server Error');
			});
  }else{
			Meteor.call('removeBlock', id, blKey, (error, reply)=> {
        if(error)
          console.log(error);
        reply ? toast.success('Saved') : toast.error('Server Error');
			});
    }
  }
  
  render() {
    return(
      <button
        type='button'
        title={'Remove this ' + Pref.block}
        className='transparent'
        onClick={this.remove.bind(this)}
        disabled={this.props.lock}>
        <label className='navIcon actionIconWrap'>
          <i className='fas fa-trash redT'></i>
          {!this.props.noText && <span className='actionIconText redT'>Remove</span>}
        </label>
      </button>
    );
  }
}