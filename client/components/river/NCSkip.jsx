import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

export default class NCSkip extends Component {

	handleSkip(e) {
    e.preventDefault();
		const id = this.props.id;
    const ncKey = this.props.ncKey;
    const comm = this.refs.skom.value.trim().toLowerCase();
    Meteor.call('skipNC', id, ncKey, comm, ()=> {
			Bert.alert(Alert.caution);
		});
	}
        
  render () {
    return (
      <form onSubmit={this.handleSkip.bind(this)}>
				<input
          type='text'
          ref='skom'
          placeholder='Comment'
          disabled={this.props.lock}
        />
        <button
          type='submit'
          className='smallAction yellow'
          value='Skip'
          disabled={this.props.lock}
        >{Pref.skip}</button>
      </form>
    );
  }
}