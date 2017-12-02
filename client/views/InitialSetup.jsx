import React, {Component} from 'react';

import Spin from '../components/uUi/Spin.jsx';

export default class InitialSetup extends Component	{
  
  constructor() {
    super();
    this.state = {
      lock: true,
    };
  }
  
  hndlSet() {
    Meteor.call('addSetting', (err, reply)=>{
      if (err)
        console.log(err);
      if(reply) {
        Bert.alert('', 'success', 'fixed-top');
      }else{
        Bert.alert('ERROR', 'danger', 'fixed-top');
      }
    });
  }
  
  unlock() {
    Meteor.setTimeout(()=> {
		  this.state ?
		    this.setState({lock: false})
		  : null;
	  }, 4000);
  }

  render() {
  	
  	if(!this.state.lock) {
      return(
        <div className='space'>
          <p>"{this.props.org}" is a new organization</p>
          <hr />
          <div className='centre'>
            <form onSubmit={this.hndlSet}>
              <button
                className='stone clear'
              >START</button>
            </form>
          </div>
          <hr />
        </div>
      );
  	}
      
    return(
      <Spin />
    );
  }
  
  componentDidMount() {
    this.unlock();
  }
  
}