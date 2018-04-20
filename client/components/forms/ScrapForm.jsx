import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

//requires
// id
// barcode

export default class ScrapForm extends Component {
  
  handleScrap(e) {
    e.preventDefault();
    this.go.disabled = true;
    const batchId = this.props.id;  
    const bar = this.props.item.serial;
    const where = this.discStp.value.trim().toLowerCase();
    const comm = this.comm.value.trim().toLowerCase();
      
    Meteor.call('scrapItem', batchId, bar, where, comm, (error, reply)=> {
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.caution);
      }else{
        console.log('BLOCKED BY SERVER METHOD');
        Bert.alert(Alert.danger);
      }
    });
  }
    
  render () {
		
		let done = this.props.item.finishedAt !== false;
    let scrap = done ? this.props.item.history.find(x => x.type === 'scrap') : false;
		
		return (
		  <Model
        button={Pref.scrap}
        title={Pref.scrap + ' ' + Pref.item}
        color='redT'
        icon='fa-trash'
        lock={!Roles.userIsInRole(Meteor.userId(), 'qa') || scrap}
        noText={this.props.noText}>
    		  <form className='centre' onSubmit={this.handleScrap.bind(this)}>
    		    <br />
    	      <p><b>Are you sure you want to do this? You Cannot Undo This.</b></p>
    	      <br />
    	      <p>
              <input
                id='currep'
                ref={(i)=> this.discStp = i}
                className='cap redIn'
                list='shortcuts'
                required />
              <label htmlFor='currep'>current process</label>
              <datalist id='shortcuts' className='cap'>
                  {this.props.anc.map( (entry, index)=>{
                    return ( 
                      <option key={index} value={entry}>{entry}</option>
                  )})}
              </datalist>
            </p>
    	      <p>
              <textarea
                id='scomment'
                ref={(i)=> this.comm = i}
                className='redIn'
                placeholder='reason for scrapping'
                rows='5'
                required></textarea>
              <label htmlFor='scomment'>comment</label>
            </p>
            <br />
            <p>
              <button 
                type="submit"
                className='action clearRed'
                ref={(i)=> this.go = i}
                disabled={false}
                >SCRAP {this.props.item.serial}</button>
            </p>
          </form>
      </Model>
    );
  }
}