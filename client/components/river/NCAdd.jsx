import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

//requires
// id
// barcode
// app

export default class NCAdd extends Component {

  handleNC(e) {
    e.preventDefault();
    this.go.disabled = true;
    const bar = this.props.barcode;
    const batchId = this.props.id;  
    const type = this.ncType.value.trim().toLowerCase();
    const where = this.discStp.value.trim().toLowerCase();
    
    const refEntry = this.ncRefs.value.trim().toLowerCase();
    const refSplit = refEntry.split(/\s* \s*/);
      
      for(var ref of refSplit) {
        Meteor.call('addNC', batchId, bar, ref, type, where, (error)=>{
          if(error)
            console.log(error);
        });
      }
      
      this.ncRefs.value='';
      this.go.disabled = false;
      const findBox = document.getElementById('find');
      findBox.focus();
  }


  render () {

		let now = Session.get('nowStep');
		let lock = now === 'done';

    return (
      <form
        className='actionForm'
        onSubmit={this.handleNC.bind(this)}>
      
        <select
          id='currep'
          ref={(i)=> this.discStp = i}
          className='cap redIn'
          defaultValue={now}
          disabled={lock}
          required >
          <optgroup label='auto'>
            <option value={now} className='nowUp'>{now}</option>
          </optgroup>
          <optgroup label={Pref.ancillary}>
            {this.props.app.ancillaryOption.map( (entry, index)=>{
              return (
                <option key={index} value={entry}>{entry}</option>
                );
            })}
          </optgroup>
          <optgroup label='build steps'>
            {this.props.app.trackOption.map( (entry, index)=>{
              if(entry.type === 'build') {
                return (
                  <option key={index} value={entry.step}>{entry.step}</option>
                );
              }else{null}
            })}
          </optgroup>
        </select>
        <input
          type='text'
          id='nonponent'
          ref={(i)=> this.ncRefs = i}
          className='redIn'
          placeholder={Pref.nonConRef}
          disabled={lock}
          required />

        <select 
          id='nonode'
          ref={(i)=> this.ncType = i}
          className='cap redIn'
          disabled={lock}
          required >
          {this.props.app.nonConOption.map( (entry, index)=>{
            return ( 
              <option key={index} value={entry}>{entry}</option>
              );
          })}
        </select>
        
        <button
          type='submit'
          ref={(i)=> this.go = i}
          disabled={lock}
          className='smallAction clear redT'
        >{Pref.post} NonCon</button>
            
      </form>
    );
  }
}