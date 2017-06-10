import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

export default class BlockForm extends Component {

	 constructor() {
    super();
    this.state = {
      show: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ show: !this.state.show });
  }

  addBlock(e) {
    e.preventDefault();
    this.go.disabled = true;
    const batchId = this.props.id;
    
    const blKey = this.props.edit ? this.props.edit.key : false;
    const text = this.blTxt.value.trim().toLowerCase();
    
    if(blKey) {
      Meteor.call('editBlock', batchId, blKey, text, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          this.setState({ show: !this.state.show });
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
          this.setState({ show: !this.state.show });
        }else{
          Bert.alert(Alert.danger);
        }
      });
    }
  }


  render () {
    
    const edit = this.props.edit;
    const eTx = edit ? edit.block : '';
    const title = edit ? 'edit' : 'Add ' + Pref.block;

    return (
      <div>
        { !this.state.show ?
          <div className='centre'>
					  <button className='action yellow wide cap' onClick={this.handleClick}>{title}</button>
				  </div>
          :
          <div className='actionBox yellow'>
            <button className='action clear rAlign' onClick={this.handleClick}>{Pref.close}</button>
              <br />
              <br />
              <form className='centre' onSubmit={this.addBlock.bind(this)}>
                <p><label htmlFor='blk'>Describe the Impediment</label><br />
                  <input
                    type='text'
                    id='blk'
                    ref={(i)=> this.blTxt = i}
                    placeholder='110072 short 25pcs'
                    defaultValue={eTx}
                    autoFocus='true'
                    required />
                </p>
                <br />
                <p><button
                  type='submit'
                  ref={(i)=> this.go = i}
                  disabled={this.props.lock}
                  className='action clear'>{Pref.post}</button>
                </p>
              </form>
              <br />
            </div>
        }
      </div>
    );
  }
}


export class SolveBlock extends Component {
  
  addSolve() {
		const id = this.props.id;
		const blKey = this.props.blKey;
    const act = this.slv.value.trim().toLowerCase();
      Meteor.call('solveBlock', id, blKey, act, (error, reply)=> {
        if(error)
          console.log(error);
        reply ? Bert.alert(Alert.success) : Bert.alert(Alert.warning); 
			});
  }
  
  render() {
    return(
      <form className='hiddenInput inlineForm' onSubmit={this.addSolve.bind(this)}>
        <input
          ref={(i)=> this.slv = i}
          rows='2'
          disabled={false} />
        <br />
        <button
          type='submit'
          ref={(i)=> this.go = i}
          className='smallAction clear greenT'
          disabled={this.props.lock}>Solve</button>
      </form>
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
        className='miniAction clear redT'
        onClick={this.remove.bind(this)}
        disabled={this.props.lock}>Remove</button>
    );
  }
}