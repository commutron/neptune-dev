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
    !this.props.hold ? null : Session.set(this.props.sessionTab, clk);
  }
  
  render() {
    
    const tabs = this.props.tabs;
    let show = this.state.sect;
    const stick = this.props.stick ? 'stickyBar' : '';
    const styl = this.props.wide ? { width: 100 / tabs.length + '%'} : null;
    
    return (
      <div>
        <div className={stick}>
          {tabs.map( (entry, index)=>{
            let clss =  show === index ? 'action cap tabOn' : 'action cap tabOff';
            return (
              <button
                key={index}
                onClick={this.handleClick.bind(this, index)}
                className={clss}
                style={styl}
              >{entry}</button>
          )})}
        </div>
        <AnimateWrap type='cardTrans'>
          <div className='tabBody'>

            {this.props.children[show]}
          
          </div>
        </AnimateWrap>
      </div>
    );
  }
  componentDidMount() {
    if(!this.props.hold) { 
      null;
    }else{
      const hold = Session.get(this.props.sessionTab);
      !hold ? null : this.setState({ sect: hold });
    }
  }
}