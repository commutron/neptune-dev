import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

export default class NCSkip extends Component {

	handleSkip(e) {
    e.preventDefault();
		const id = this.props.id;
    const ncKey = this.props.ncKey;
    const comm = this.skom.value.trim().toLowerCase();
    Meteor.call('skipNC', id, ncKey, comm, (error)=> {
			if(error)
        console.log(error);
		});
	}
        
  render () {
    
    let run = Roles.userIsInRole(Meteor.userId(), 'run');
    
    return (
      <form className='inlineForm' onSubmit={this.handleSkip.bind(this)}>
				<input
          type='text'
          ref={(i)=> this.skom = i}
          placeholder='Comment'
          disabled={this.props.lock || !run}
        />
        <button
          type='submit'
          className='miniAction yellowT'
          value='Skip'
          disabled={this.props.lock || !run}>
          <i className='fa fa-truck fa-2x'></i>
          <i className='big cap'>{Pref.skip}</i>
        </button>
      </form>
    );
  }
}

export class NCSnooze extends Component {

  // records a skip with the snooze keyword in the comment
  
	handleSnooze() {
		const id = this.props.id;
    const ncKey = this.props.ncKey;
    const comm = 'sn00ze';
    Meteor.call('skipNC', id, ncKey, comm, (error)=> {
			if(error)
        console.log(error);
		});
	}
        
  render () {
    return (
      <button
        type='submit'
        className='miniAction yellowT'
        value='Skip'
        onClick={this.handleSnooze.bind(this)}
        disabled={this.props.lock}>
        <i className='fa fa-clock-o fa-2x'></i>
        <i className='big cap'>{Pref.snooze}</i>
      </button>
    );
  }
}

export class NCUnSkip extends Component {

	handleUnSkip() {
		const id = this.props.id;
    const ncKey = this.props.ncKey;
    Meteor.call('UnSkipNC', id, ncKey, (error)=> {
      if(error)
        console.log(error);
		});
  }
        
  render () {
    return (
      <button
        className='miniAction yellowT'
        onClick={this.handleUnSkip.bind(this)}
        disabled={this.props.lock}>
        <i className='fa fa-play fa-2x'></i>
        <i className='big'>Activate</i>
      </button>
    );
  }
}