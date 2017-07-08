import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

// id={this.props.id}
// barcode={this.props.barcode}
// sKey={thhis.props.sKey}
// step={this.props.step}
// type={this.props.type}
// users={this.props.users}
// methods={this.props.methods}
// onPass={e => this.unlock()}

export default class FirstForm extends Component	{
  
    //// Action for a first off inspection
		passF(e) {
			e.preventDefault();
			this.go.disabled = true;
			this.setState({lock: true});
      const id = this.props.id;
      const bar = this.props.barcode;
      const sKey = this.props.sKey;
			const step = this.props.step;
      const type = this.props.type;
      const comm = this.comm ? this.comm.value.trim().toLowerCase() : '';
      const good = this.good.checked;
      
      const howB = this.methodB.value;
      const howI = this.methodI.checked ? 'auto' : 'manual';
      const diff = this.change.value.trim().toLowerCase();
      const ng = this.issue.value.trim().toLowerCase();
            
			const whoSelect = this.wB.selectedOptions;
			const whoB = [];
			for(let who of whoSelect) { whoB.push(who.value) }
      
			Meteor.call('addFirst', id, bar, sKey, step, type, comm, good, whoB, howB, howI, diff, ng, (error, reply)=>{
			  if(error)
			    console.log(error);
			  if(reply) {
			    this.props.onPass;
       		const findBox = document.getElementById('find');
  			  findBox.focus();
  			 }else{
  			   Bert.alert(Pref.blocked, 'danger');
  			 }
			});
		}


  render() {
    
    const aoi = this.props.step.includes('smt') ? true : false;
     
    return (
      <form className='stoneForm centre' onSubmit={this.passF.bind(this)}>
        <p className='bigger'>{this.props.step}</p>
        <br />
        <label className='beside' htmlFor='cptbl'>
          <input
            type='checkbox'
            id='cptbl'
            className='mini15x'
            ref={(i)=> this.good = i}
            defaultChecked='true'
            readOnly />
          {Pref.good}
        </label>
       <br />
        <label className='beside' htmlFor='mthi'>
          <input
            type='checkbox'
            id='mthi'
            className='mini15x'
            ref={(i)=> this.methodI = i}
            defaultChecked={aoi}
            readOnly />
          {Pref.autoI}
        </label>
        <p>
          <select id='wuilt' ref={(i)=> this.wB = i} className='cap' multiple required>
            {this.props.users.map( (entry, index)=>{
              return( <option key={index} value={entry._id}>{entry.username}</option> );
            })}
          </select>
          <label htmlFor='wuilt'>{Pref.builder}</label>
        </p>
        <p>
          <select ref={(i)=> this.methodB = i} id='mthb' className='cap' required>
            <option></option>
            {this.props.methods.map( (entry, index)=>{
              return ( <option key={index} value={entry}>{entry}</option> );
            })}
          </select>
          <label htmlFor='mthb'>{Pref.method}</label>
        </p>
        <details>
          <summary>more</summary>
          <p>
            <textarea
    			    type='text'
    			    id='proC'
    			    ref={(i)=> this.change = i}></textarea>
    			  <label htmlFor='proC'>{Pref.proChange}</label>
  			  </p>
  			  <p>
            <textarea
    			    type='text'
    			    id='oIss'
    			    ref={(i)=> this.issue = i}></textarea>
    			  <label htmlFor='oIss'>{Pref.outIssue}</label>
  			  </p>
          <p>
            <textarea
    			    type='text'
    			    id='gcom'
    			    ref={(i)=> this.comm = i}></textarea>
    			  <label htmlFor='gcom'>{Pref.gComm}</label>
  			  </p>
			  </details>
        <p>
          <button
            type='submit'
            ref={(i)=> this.go = i}
            className='action clear'
            disabled={false}
          >{Pref.post}</button></p>
      </form>
    );
  }
}