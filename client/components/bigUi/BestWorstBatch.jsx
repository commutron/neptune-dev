import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import NumBox from '/client/components/uUi/NumBox.jsx';

const BestWorstBatch = ({ groupData, widgetData, app })=> (
  <div>
    <p className='centreText'>Best and Worst</p>
    <BestWorstContent
      groupData={groupData}
      widgetData={widgetData}
      app={app} />
  </div>
);

class BestWorstContent extends Component {
  
  constructor() {
    super();
    this.state = {
      tops: false,
    };
  }
  
  tops() {
    const best = this.props.app.ncScale.low;
    const worst = this.props.app.ncScale.max;
    Meteor.call('BestWorstStats', best, worst, (error, reply)=> {
      error ? console.log(error) : null;
      this.setState({ tops: reply });
    });
  }
  
  render () {
    
    const tops = this.state.tops;
    
    if(!tops) {
      return(
        <CalcSpin />
      );
    }
    
    return(
      <div className='wide balance'>
        <div>
          <i>Best</i>
          {this.state.tops.bestNC.map( (entry, index)=>{
            return(
              <dl key={index}>
                <dt>{entry.b}</dt>
                <dd>{entry.w}</dd>
                <dd>{entry.value}</dd>
              </dl>
          )})}
        </div>
        
        <div>
          <i>Worst</i>
          {this.state.tops.worstNC.map( (entry, index)=>{
            return(
              <dl key={index}>
                <dt>{entry.b}</dt>
                <dd>{entry.w}</dd>
                <dd>{entry.value}</dd>
              </dl>
          )})}
        </div>
        
        
        
        {this.props.users &&
          <NumBox
            num={counts.usrC}
            name={Pref.user + 's'}
            color='blueT' />}
        
        
      </div>
    );
  }
  componentDidMount() {
    this.tops();
  }
}

export default BestWorstBatch;