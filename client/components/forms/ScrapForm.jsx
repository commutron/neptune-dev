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
    const bar = this.props.barcode;
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

		let now = Session.get('nowStep');
		
		return (
		  <div>
		    {Roles.userIsInRole(Meteor.userId(), 'qa') ?
    		  <form className='centre' onSubmit={this.handleScrap.bind(this)}>
    		    <br />
    	      <p><b>Are you sure you want to do this? You Cannot Undo This.</b></p>
    	      <br />
    	      <p><label htmlFor='currep'>current process</label><br />
              <select
                id='currep'
                ref={(i)=> this.discStp = i}
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
                ref={(i)=> this.comm = i}
                placeholder='reason for scrapping'
                required
              />
            </p>
            <br />
            <p>
              <button 
                type="submit"
                className='action clear'
                ref={(i)=> this.go = i}
                disabled={false}
                >SCRAP {this.props.barcode}</button>
            </p>
          </form>
          :
          <p>How did you even get here?</p>
		    }
		  </div>
    );
  }
}


export class ScrapButton extends Component {
  
  render() {
    
    return(
      <Model
        button={Pref.scrap}
        title={Pref.scrap + ' ' + Pref.item}
        type='action clear redT'
        lock={this.props.lock}>
        <ScrapForm
		      barcode={this.props.barcode}
		      id={this.props.id}
		      ancs={this.props.ancs} />
      </Model>
      );
  }
}