import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import ScrapForm from '../forms/ScrapForm.jsx';
//requires
// id
// barcode

export default class NCButton extends Component {

	 constructor() {
    super();
    this.state = {
      show: false,
      scrap: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.showScrap = this.showScrap.bind(this);
    this.hideScrap = this.hideScrap.bind(this);
  }
    handleClick() {
      this.setState({ show: !this.state.show });
    }
    showScrap() {
      if(this.ncType.value === 'scrap') {
        this.setState({ scrap: true });
      }else{
        this.setState({ scrap: false });
      }
    }
    hideScrap() {
      this.setState({ scrap: false });
    }

    handleNC(e) {
      e.preventDefault();
      this.go.disabled = true;
      const bar = this.props.barcode;
      const batchId = this.props.id;  
      const type = this.ncType.value.trim().toLowerCase();
      const where = this.discStp.value.trim().toLowerCase();
      
      const refEntry = this.ncRefs.value.trim().toLowerCase();
      const refSplit = refEntry.split(' ');
        
      //for(var bar of bars) { // for applying an nc to an array of barcodes
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
      //}
    }


  render () {

		let now = Session.get('nowStep');
		
		if(this.state.scrap) {
		  return (
  		  <div className='actionBox red'>
  		    <button className='action clear rAlign' onClick={this.hideScrap}>{Pref.close}</button>
  		    <br />
  		      <ScrapForm
  		        barcode={this.props.barcode}
  		        id={this.props.id}
  		        ancs={this.props.ancs} />
          <br />
        </div>
        );
		}

    return (
      <div>
        { !this.state.show ?
				<div className='centre'>
					<button
					  className='action red wide cap'
					  onClick={this.handleClick}
					  disabled={now === 'done'}
					  >{Pref.nonCon}</button>
				</div>
        :
        <div className='actionBox red'>
          <button className='action clear rAlign' onClick={this.handleClick}>{Pref.close}</button>
            <br />
            <br />
            <form className='centre' onSubmit={this.handleNC.bind(this)}>
              <p><label htmlFor='currep'>discovered at</label><br />
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
              <p><label htmlFor='nonponent'>{Pref.nonConRef}</label><br />
                <input
                  type='text'
                  id='nonponent'
                  ref={(i)=> this.ncRefs = i}
                  placeholder='eg. R45'
                  autoFocus='true'
                  required />
              </p>
              <p><label htmlFor='nonode'>{Pref.nonConType}</label><br />
                <select 
                  id='nonode'
                  ref={(i)=> this.ncType = i}
                  className='cap'
                  onChange={this.showScrap.bind(this)}
                  required >
                  {this.props.nons.map( (entry, index)=>{
                    return ( 
                      <option key={index} value={entry}>{entry}</option>
                      );
                  })}
                  {Roles.userIsInRole(Meteor.userId(), 'power') ?
                    <option value='scrap'>scrap</option>
                    : null}
                </select>
              </p>
              <br />
              <p><button type='submit' ref={(i)=> this.go = i} disabled={false} className='action clear'>{Pref.post}</button></p>
            </form>
            <br />
        </div>
        }
      </div>
    );
  }
}