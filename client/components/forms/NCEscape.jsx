import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import Model from '../smallUi/Model.jsx';
//requires
// id

export default class NCEscape extends Component {

    handleNC(e) {
      e.preventDefault();
      this.go.disabled = true;
      
      const batchId = this.props.id;  
      const type = this.ncType.value.trim().toLowerCase();
      const quant = this.quNum.value.trim().toLowerCase();
      const ncar = this.ncar.value.trim().toLowerCase();
      
      const refEntry = this.ncRefs.value.trim().toLowerCase();
      const refSplit = refEntry.split(' ');
        
      for(var ref of refSplit) {
        Meteor.call('addEscape', batchId, ref, type, quant, ncar, (error)=>{
          if(error)
            console.log(error);
        });
      }
      
      this.ncRefs.value = '';
      this.quNum.value = '';
      this.out.value = 'saved';
    }
    
    on() {
      this.go.disabled = false;
      this.out.value = '';
    }


  render () {

    return (
      <Model
        button='escaped'
        title={'record escaped ' + Pref.nonCon}
        color='orangeT'
        icon='fa-bug'
        lock={!Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])}
        noText={this.props.noText}>
        <div className='centre'>
          <br />
          <form className='centre' onSubmit={this.handleNC.bind(this)} onChange={this.on.bind(this)}>
            <p>
              <input
                type='text'
                id='nonponent'
                ref={(i)=> this.ncRefs = i}
                className='redIn'
                placeholder='eg. R45'
                autoFocus='true'
                required />
              <label htmlFor='nonponent'>{Pref.nonConRef}</label>
            </p>
            <p>
              <select 
                id='nonode'
                ref={(i)=> this.ncType = i}
                className='cap redIn'
                required >
                {this.props.nons.map( (entry, index)=>{
                  return ( 
                    <option key={index} value={entry}>{entry}</option>
                    );
                })}
              </select>
              <label htmlFor='nonode'>{Pref.nonConType}</label>
            </p>
            <p>
              <input
                type='number'
                id='quant'
                ref={(i)=> this.quNum = i}
                className='redIn'
                max='100000'
                min='1'
                inputMode='numeric'
                placeholder='10'
                required />
              <label htmlFor='quant'>Quantity</label>
            </p>
            <p>
              <input
                type='text'
                id='ncar'
                ref={(i)=> this.ncar = i}
                className='redIn'
                required />
              <label htmlFor='ncar'>ncar</label>
            </p>
            <p>
              <button
                type='submit'
                ref={(i)=> this.go = i}
                disabled={false}
                className='action clearRed'
              >{Pref.post}</button>
            </p>
            <p><output ref={(i)=> this.out = i} /></p>
          </form>
        </div>
      </Model>
    );
  }
}