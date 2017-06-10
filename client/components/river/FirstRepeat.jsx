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
  
  // close first-off form when switching items 
  componentWillReceiveProps() {
    this.setState({show: false});
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
  
  // check for "inspect" permission
  componentDidMount() {
    Roles.userIsInRole(Meteor.userId(), 'inspect') ? this.setState({lock: false}) : null;
  }
}