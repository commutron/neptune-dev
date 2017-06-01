import React, {Component} from 'react';

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
            let styl =  show === index ? 'action blue' : 'action clear';
            return (
              <button
                key={index}
                onClick={this.handleClick.bind(this, index)}
                className={styl}
              >{entry}</button>
            );
          })}
        </div>
        <hr />
        {this.props.children[show]}
      </div>
    );
  }
}