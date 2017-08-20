import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

export default class Tabs extends Component	{
  
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
    
    let show = this.state.sect;
    const stick = this.props.stick ? 'stickyBar' : '';
    
    return (
      <div>
        <div className={stick}>
          { this.props.tabs.map( (entry, index)=>{
            let styl =  show === index ? 'action cap tabOn' : 'action cap tabOff';
            return (
              <button
                key={index}
                onClick={this.handleClick.bind(this, index)}
                className={styl}
              >{entry}</button>
            );
          })}
        </div>
        <AnimateWrap type='cardTrans'>

          {this.props.children[show]}
        
        </AnimateWrap>
      </div>
    );
  }
}