import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

export default class Slides extends Component	{
  
  constructor() {
    super();
    this.state = {
      sect: 0
    };
  }
  
  handleClick(clk) {
    this.setState({sect: clk});
  }
  
  render() {
    
    const menu = this.props.menu;
    let show = this.state.sect;
    
    return (
      <div className='slidesLayout'>
        <div className='slidesMenu'>
          {menu.map( (entry, index)=>{
            let clss =  show === index ? 'slideMenuButton slideOn' : 'slideMenuButton slideOff';
            return (
              <button
                key={index}
                onClick={this.handleClick.bind(this, index)}
                className={clss}
              >{entry}</button>
          )})}
        </div>
        <div className='slidesSlide'>

          {this.props.children[show]}
        
        </div>
      </div>
    );
  }
}