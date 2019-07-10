import React, {PureComponent} from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

export default class TideFollow extends PureComponent {
	_isMounted = false;
	
	constructor() {
		super();
		this.state = {
			engaged: false
		};
	}
	
	componentDidMount() {
	  this._isMounted = true;
	  Meteor.call('engagedState', (err, rtn)=>{
	    err && console.log(err);
	     if(this._isMounted) {
	       this.setState({ engaged : rtn });
	     }
	  });
	  if(!this.props.proRoute) {
  	  this.tickingClock = Meteor.setInterval( ()=>{
        toast.dismiss();
        toast(<i>⏰ Remember, you are still {Pref.engaged} with a {Pref.batch}. 
          <a onClick={()=>this.go()}>Go back there now</a></i>, { 
          autoClose: false
        });
      },1000*60*15);
	  }
	}
  componentWillUnmount() {
    this._isMounted = false;
    if(!this.props.proRoute) { 
      Meteor.clearInterval(this.tickingClock);
    }
  }
	
	go() {
	  Session.set('now', this.state.engaged);
    FlowRouter.go('/production');
	}
	
	render() {
    return(
      <div className={`proRight ${this.props.invertColor ? 'invert' : ''}`}>
        <button 
          title={!this.state.engaged ?
            `Not currently engaged in a ${Pref.batch}` : 
            `Escape Hatch \ngo back to engaged ${Pref.batch}`}
          onClick={()=>this.go()}
          disabled={!this.state.engaged}
        ><i className='fas fa-parachute-box primeRightIcon'></i>
        </button>
      </div>
    );
  }
}