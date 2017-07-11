import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import FirstForm from './FirstForm.jsx';

export default class StoneSelect extends Component	{
  
  constructor() {
    super();
    this.state = {
      show: false,
      lock: true
    };
    this.reveal = this.reveal.bind(this);
  }
  
  reveal() {
    this.setState({show: !this.state.show});
  }
  
  // close first-off form and recheck the lock when switching items 
  componentWillReceiveProps(nextProps) {
    if(this.props.flowStep.key !== nextProps.flowStep.key || this.props.barcode !== nextProps.barcode) {
      this.setState({show: false});
      this.setState({lock: true});
      this.unlock();
    }else{null}
  }
  
  unlock() {
    Meteor.setTimeout(()=> {
    	if(!Roles.userIsInRole(Meteor.userId(), 'inspect')) {
    		null;
    	}else{
  		  let iky = Session.get('ikyView');
  		  !iky || iky === false ? // if item card is displayed
  		    this.setState({lock: false})
  		  : null;
  	  }
  	}, 3000);
  }
  
  
  render() {

    const dt = this.props;
    const self = dt.history.find(x => x.key === dt.flowStep.key);
    
    if(dt.flowStep.type === 'first' && !self) {
      return (
        <div>
        { !this.state.show ?
				<div className='centre'>
					<button
					  className='action blue wide cap'
					  onClick={this.reveal}
					  disabled={this.state.lock}
					  >New {Pref.trackFirst}</button>
				</div>
        :
        <div className='actionBox blue'>
          <button
            className='action clear rAlign'
            onClick={this.reveal}
          >{Pref.close}</button>
          <br />
          <br />
            <FirstForm
              id={dt.id}
              barcode={dt.barcode}
              sKey={dt.flowStep.key}
              step={dt.flowStep.step}
              type={dt.flowStep.type}
              users={dt.users}
              methods={dt.methods}
              onPass={e => this.unlock()} />
            <br />
          </div>
        }
        </div>
      );
    }
    
    return (
      <div></div>
    );
  }
  
  componentDidMount() {
    this.unlock();
  }
}