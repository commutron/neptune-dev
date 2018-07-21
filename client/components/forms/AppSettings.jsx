import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

export class OptionAdd extends Component	{
  
  addOp(e) {
    e.preventDefault();
    this.go ? this.go.disabled = true : false;
    const act = this.props.action;
    const action = act === 'nc' ? 'addNCOption' :
                   act === 'ncA' ? 'addPrimaryNCOption' :
                   act === 'ncB' ? 'addSecondaryNCOption' :
                   act === 'track' ? 'addTrackOption' :
                   act === 'count' ? 'addCountOption' :
                   act === 'miss' ? 'addMissingType' :
                   act === 'anc' ? 'addAncOp' :
                   act === 'tag' ? 'addTagOp' :
                   act === 'help' ? 'setHelpDocs' :
                   act === 'wi' ? 'setInstruct' :
                   act === 'time' ? 'setTimeClock' : false;
    let newOp = this.iop.value.trim();
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
    
    const rndmKey = this.props.rndmKey;
    
    return(
      <div>
        <form onSubmit={this.addOp.bind(this)} className='inlineForm'>
          <label htmlFor={rndmKey}>{this.props.title}<br />
            <input
              type='text'
              id={rndmKey}
              ref={(i)=> this.iop = i}
              required
            />
          </label>
            {this.props.action === 'track' || this.props.action === 'count' ?
              <label htmlFor={rndmKey + 'type'}>Type<br />
                <select id={rndmKey + 'type'} ref={(i)=> this.type = i} required >
                  <option></option>
                  <option value='first' disabled={this.props.action === 'count'}>first</option>
                  <option value='build'>build</option>
                  <option value='inspect'>inspect</option>
                  <option value='test'>test</option>
                  <option value='checkpoint'>checkpoint</option>
                  <option value='nest' disabled={this.props.action === 'count'}>nest</option>
                  <option value='finish' disabled={this.props.action === 'track'}>finish</option>
                </select>
              </label>
            : null}
          <label htmlFor={rndmKey + 'add'}><br />
            <button
              type='submit'
              id={rndmKey + 'add'}
              ref={(i)=> this.go = i}
              className='smallAction clearGreen'
              disabled={false}
            >Set</button>
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

export const SetScale = ({ curScale })=> {
  let df = curScale || { low: 5, high: 10, max: 25 };
  
  function handle(e) {
    e.preventDefault();
    let l = this.low.value;
    let h = this.high.value;
    let m = this.max.value;
    Meteor.call('addNCScale', l, h, m, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.danger);
      }
    });
  }
  
  return(
    <div>
      <label htmlFor='scaleForm'>Set Scale</label>
      <form id='scaleForm' className='inlineForm' onSubmit={(e)=>handle(e)}>
        <input type='number' id='low' className='miniNumIn' defaultValue={df.low} />
        <input type='number' id='high' className='miniNumIn' defaultValue={df.high} />
        <input type='number' id='max' className='miniNumIn' defaultValue={df.max} />
        <button type='submit' className='smallAction clearGreen'>Save</button>
      </form>
    </div>
  );
};


export const MethodOptionAdd = ({ existOps, trackedSteps })=> {
  
  function handle(e) {
    e.preventDefault();
    let title = this.tooltitle.value;
    let steps = Array.from(
                  this.corrSteps.options, 
                    x => x.selected === true && x.value
                  ).filter( 
                    y => y !== false
                  );
    Meteor.call('addToolOp', title, steps, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
        this.tooltitle.value = '';
        this.corrSteps.value = null;
      }else{
        Bert.alert(Alert.danger);
      }
    });
  }
  
  return(
    <div>
      <form id='toolForm' onSubmit={(e)=>handle(e)}>
        <label htmlFor='tooltitle'>{Pref.method} name</label>
        <br />
        <input type='text' id='tooltitle' list='preExist' required />
        <datalist id='preExist'>
          {existOps.map( (entry, index)=>{
            return(
              <option key={index} value={entry.title}>{entry.title}</option>
            );
          })}
        </datalist>
        <br />
        <label htmlFor='steps'>Corresponding Steps</label>
        <br />
        <select id='corrSteps' multiple required>
          {trackedSteps.map( (entry)=>{
            if(entry.type === 'first') {
              return(
                <option key={entry.key} value={entry.key}>{entry.step}</option>
              );
            }else{null}
          })}
        </select>
        <br />
        <button type='submit' className='smallAction clearGreen'>Save</button>
      </form>
    </div>
  );
};


export const OverrideLastestSerial = ({dfNine, dfTen})=> {
  
  function handle(e) {
    e.preventDefault();
    const serialNine = this.srlNine.value;
    const serialTen = this.srlTen.value;
    Meteor.call('setlastestSerial', serialNine, serialTen, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.danger);
      }
    });
  }
  
  let ldBox = {
    display: 'inline-block',
    width: '22px',
    fontWeight: '600',
    textAlign: 'center',
  };
  
  return(
    <div>
      <label htmlFor='scaleForm'>Manualy Override Last Serial</label>
      <form onSubmit={(e)=>handle(e)}>
        <label htmlFor='srlNine'>
          <span style={ldBox}>9</span>
          <input
            id='srlNine'
            type='text'
            maxLength={9}
            minLength={9}
            pattern='[0000000000-9999999999]*'
            inputMode='numeric'
            defaultValue={dfNine}
            required />
        </label>
        <br />
        <label htmlFor='srlNine'>
          <div style={ldBox}>10</div>
          <input
            id='srlTen'
            type='text'
            maxLength={10}
            minLength={10}
            pattern='[0000000000-9999999999]*'
            inputMode='numeric'
            defaultValue={dfTen} 
            required />
        </label>
        <br />
        <input type='reset' className='smallAction blackT clear' />
        <button
          type='submit'
          className='smallAction blackT clearGreen'
        >Save</button>
      </form>
    </div>
  );
};
