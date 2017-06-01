import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

export default class NCChange extends Component {

  handleChange() {
		const id = this.props.id;
    const ncKey = this.props.ncKey;
    const type = this.refs.ncType.value;
      
    Meteor.call('editNC', id, ncKey, type, (error)=> {
      if(error)
        console.log(error);
			Bert.alert(Alert.success);
		});
  }
        
  render() {
    return (
      <select 
        onChange={this.handleChange.bind(this)}
        ref='ncType'
        id='nonode'
        className='cap'
        defaultValue={this.props.type}
        disabled={this.props.lock}
        required>
        {this.props.nons.map( (entry, index)=>{
            return( <option key={index} value={entry}>{entry}</option> );
            })}
      </select>
    );
  }
}