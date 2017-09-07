import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

export class OptionAdd extends Component	{
  
  addOp(e) {
    e.preventDefault();
    this.go ? this.go.disabled = true : false;
    const act = this.props.action;
    const action = act === 'nc' ? 'addNCOption' :
                   act === 'track' ? 'addTrackOption' :
                   act === 'anc' ? 'addAncOp' :
                   act === 'tool' ? 'addToolOp' :
                   act === 'wi' ? 'setInstruct' :
                   act === 'time' ? 'setTimeClock' : false;
    let newOp = this.iop.value.trim().toLocaleLowerCase();
    newOp = newOp.replace("|", "-");
    
    let type = this.type ? this.type.value.trim() : false;
    if(type) { newOp = newOp + '|' + type }
    
    if(action) {
      Meteor.call(action, newOp, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          this.iop.value = '';
          this.type ? this.type.value = '' : false;
          this.go ? this.go.disabled = false : false;
        }else{
          Bert.alert(Alert.warning);
          this.go ? this.go.disabled = false : false;
        }
      });
    }else{
      alert('action not found');
      this.go ? this.go.disabled = false : false;
    }
  }
  
  render() {
    return(
      <div>
        <form onSubmit={this.addOp.bind(this)} className='inlineForm'>
          <label htmlFor='iOp'>{this.props.title}<br />
            <input
              type='text'
              id='iOp'
              ref={(i)=> this.iop = i}
              required
            />
          </label>
            {this.props.action === 'track' ?
              <label htmlFor='type'>Type<br />
                <select id='type' ref={(i)=> this.type = i} required >
                  <option></option>
                  <option value='first'>first</option>
                  <option value='build'>build</option>
                  <option value='inspect'>inspect</option>
                  <option value='test'>test</option>
                </select>
              </label>
            : null}
          <label htmlFor='add'><br />
            <button
              type='submit'
              id='add'
              ref={(i)=> this.go = i}
              className='smallAction clear greenT'
              disabled={false}
            >Set
            </button>
          </label>
        </form>
      </div>
      );
  }
}

/////////////////////////////////////////////////////////////////////

export class FinishTrack extends Component {
  
  endTrack() {
    const last = this.done.value;
    Meteor.call('endTrack', last, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.danger);
      }
    });
  }
  
  render() {
    
    let lt = this.props.last;
    let df = lt.step + '|' + lt.type + '|' + lt.how;
    
    return (
      <div>
        <label htmlFor='dnTrk'><br />
          <select
            id='dnTrk'
            ref={(i)=> this.done = i}
            onChange={this.endTrack.bind(this)}
            defaultValue={df}
            required
          >
            <option value='finish|finish|finish'>Finish</option>
            <option value='pack|finish|pack'>Pack</option>
            <option value='ship|finish|ship'>Ship</option>
          </select>
        </label>
      </div>
      );
  }
}