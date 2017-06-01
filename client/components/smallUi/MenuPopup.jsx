import React, {Component} from 'react';

export default class MenuPopup extends Component {
  
    constructor() {
    super();
    this.state = {
      hud: false
    };
    this.show = this.show.bind(this);
    //this.hide = this.hide.bind(this);
  }
    
    show() {
      this.setState({ hud: true });
      Meteor.setTimeout(
      ()=> { if(this) {this.setState({ hud: false }) }else{null} }
      , 5000);
    }
    
    /* 
    // this is some work in progress
    
    show() {
      this.setState({ hud: true });
    }
    
    hide() {
      function poof() {
          setTimeout(function() {
            return false;
          }, 2000);
        }
      // stupid timeout isn't working
      if(this.state.hud) {
        let go = poof();
        this.setState({ hud: go });
      }else{null}
    }
    */
        
        
  render () {
    
    const open = this.state.hud ? 'popLittle open' : 'popLittle';

    return (
      <div className='subMenu' /*onMouseLeave={this.hide}*/>
        <a onClick={this.show}>
          <i className="fa fa-bars"></i>
        </a>
        <div className={open}>
        hi
        </div>
      </div>
    );
  }
}