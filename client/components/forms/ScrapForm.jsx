import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

//requires
// id
// barcode

export default class ScrapForm extends Component {
  
  handleScrap(e) {
    e.preventDefault();
    this.refs.go.disabled = true;
    const batchId = this.props.id;  
    const bar = this.props.barcode;
    const where = this.refs.discStp.value.trim().toLowerCase();
    const comm = this.refs.comm.value.trim().toLowerCase();
      
    Meteor.call('scrapItem', batchId, bar, where, comm, (error, reply)=> {
      if(error)
        console.log(error);
      if(reply) {
        Meteor.call('updateScrap', batchId);
        Bert.alert(Alert.caution);
      }else{
        console.log('BLOCKED BY SERVER METHOD');
        Bert.alert(Alert.danger);
      }
    });
  }
    
  render () {

		let now = Session.get('nowStep');
		
		return (
		  <div>
		    {Meteor.user().power ?
    		  <form className='centre' onSubmit={this.handleScrap.bind(this)}>
    	      <p><b>Are you sure you want to do this? You Cannot Undo This.</b></p>
    	      <br />
    	      <p><label htmlFor='currep'>current process</label><br />
              <select
                id='currep'
                ref='discStp'
                className='cap'
                defaultValue={now}
                required >
                <option value={now} id='riverStep'>{now}</option>
                {this.props.ancs.map( (entry, index)=>{
                  return ( 
                    <option key={index} value={entry}>{entry}</option>
                    );
                })}
              </select>
            </p>
    	      <p><label htmlFor='scomment'>comment</label><br />
              <input
                type='text'
                id='scomment'
                ref='comm'
                placeholder='reason for scrapping'
                required
              />
            </p>
            <br />
            <p>
              <button 
                type="submit"
                className='action clear'
                ref='go'
                disabled={false}
                >SCRAP {this.props.barcode}</button>
            </p>
          </form>
          :
          <p>How did you even get here? This function is limited to powerusers</p>
		    }
		  </div>
    );
  }
}