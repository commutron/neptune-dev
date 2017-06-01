import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import Model from '../smallUi/Model.jsx';
//requires
// id

export default class NCEscape extends Component {

    handleNC(e) {
      e.preventDefault();
      this.refs.go.disabled = true;
      
      const batchId = this.props.id;  
      const type = this.refs.ncType.value.trim().toLowerCase();
      const quant = this.refs.quNum.value.trim().toLowerCase();
      const ncar = this.refs.ncar.value.trim().toLowerCase();
      
      const refEntry = this.refs.ncRefs.value.trim().toLowerCase();
      const refSplit = refEntry.split(' ');
        
      for(var ref of refSplit) {
        Meteor.call('addEscape', batchId, ref, type, quant, ncar, (error)=>{
          if(error)
            console.log(error);
        });
      }
      
      this.refs.ncRefs.value = '';
      this.refs.quNum.value = '';
      this.refs.out.value = 'saved';
    }
    
    on() {
      this.refs.go.disabled = false;
      this.refs.out.value = '';
    }


  render () {

    return (
      <Model
        button='escaped'
        title={'escaped ' + Pref.nonCon}
        type='action clear redT'
        lock={!Meteor.user().power}>
        <div className='actionBox red'>
          <br />
          <form className='centre' onSubmit={this.handleNC.bind(this)} onChange={this.on.bind(this)}>
            <p><label htmlFor='nonponent'>{Pref.nonConRef}</label><br />
              <input
                type='text'
                id='nonponent'
                ref='ncRefs'
                placeholder='eg. R45'
                autoFocus='true'
                required />
            </p>
            <p><label htmlFor='nonode'>{Pref.nonConType}</label><br />
              <select 
                id='nonode'
                ref='ncType'
                className='cap'
                required >
                {this.props.nons.map( (entry, index)=>{
                  return ( 
                    <option key={index} value={entry}>{entry}</option>
                    );
                })}
              </select>
            </p>
            <p><label htmlFor='quant'>Quantity</label><br />
              <input
                type='number'
                id='quant'
                ref='quNum'
                max='100000'
                min='1'
                inputMode='numeric'
                placeholder='10'
                required />
            </p>
            <p><label htmlFor='ncar'>ncar</label><br />
              <input
                type='text'
                id='ncar'
                ref='ncar'
                required />
            </p>
            <br />
            <p><button type='submit' ref='go' disabled={false} className='action clear'>{Pref.post}</button></p>
            <p><output ref='out' /></p>
          </form>
          <br />
        </div>
      </Model>
    );
  }
}