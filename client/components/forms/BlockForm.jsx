import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

export default class BlockForm extends Component {

  addBlock(e) {
    e.preventDefault();
    this.go.disabled = true;
    const batchId = this.props.id;
    
    const blKey = this.props.edit ? this.props.edit.key : false;
    const text = this.blTxt.value.trim();
    
    if(blKey) {
      Meteor.call('editBlock', batchId, blKey, text, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
        }else{
          Bert.alert(Alert.danger);
        }
      });
    }else{
      Meteor.call('addBlock', batchId, text, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          this.blTxt.value='';
        }else{
          Bert.alert(Alert.danger);
        }
      });
    }
  }


  render () {
    
    const edit = this.props.edit;
    const eTx = edit ? edit.block : '';
    const bttn = edit ? 'edit' : 'Add ' + Pref.block;
    const title = edit ? 'edit ' + Pref.block : 'add ' + Pref.block;

    return (
      <Model
        button={bttn}
        title={title}
        color='yellowT'
        icon='fa-exclamation-triangle'
        smIcon={this.props.smIcon}
        lock={!Roles.userIsInRole(Meteor.userId(), 'run') || this.props.lock}
        noText={this.props.noText}>
        <div>
          <form className='centre centreTrue' onSubmit={this.addBlock.bind(this)}>
            <p>
              <textarea
                type='text'
                id='blk'
                ref={(i)=> this.blTxt = i}
                placeholder='110072 short 25pcs'
                defaultValue={eTx}
                autoFocus='true'
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
      </Model>
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
      Meteor.call('solveBlock', id, blKey, act, (error, reply)=> {
        if(error)
          console.log(error);
        reply ? Bert.alert(Alert.success) : Bert.alert(Alert.warning); 
			});
    }
  }
  
  render() {
    return(
      <button
        type='button'
        title='solve this block'
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
      Meteor.call('removeBlock', id, blKey, (error, reply)=> {
        if(error)
          console.log(error);
        reply ? Bert.alert(Alert.success) : Bert.alert(Alert.warning); 
			});
  }
  
  render() {
    return(
      <button
        type='button'
        title='remove this block'
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