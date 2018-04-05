import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import NumBox from '/client/components/uUi/NumBox.jsx';

const BestWorstBatch = ({ groupData, widgetData, app })=> (
  <div>
    <h3 className='centreText'>Best and Worst by Number of {Pref.nonCon}s</h3>
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
      start: false,
      end: false,
    };
  }
  
  tops() {
    this.setState({ tops: false });
    const best = this.props.app.ncScale.low;
    const worst = this.props.app.ncScale.max;
    const start = this.state.start;
    const end = this.state.end;
    Meteor.call('BestWorstStats', best, worst, start, end, (error, reply)=> {
      error ? console.log(error) : null;
      this.setState({ tops: reply });
    });
  }
  
  render () {
    
    const tops = this.state.tops;
    
    return(
      <div className='centre'>
      
        <div className=''>
          <span>
            <label htmlFor='startRange'> FROM </label>
          </span>
          <span>
            <input
              type='date'
              id='startRange'
              title='From'
              defaultValue={moment().startOf('week').add(1, 'day').format('YYYY-MM-DD')}
              onChange={(e)=>this.setState({start: startRange.value})} />
          </span>
          <span>
            <label htmlFor='endRange'> TO </label>
          </span>
          <span>
            <input
              type='date'
              id='endRange'
              title='To'
              defaultValue={moment().format('YYYY-MM-DD')}
               onChange={(e)=>this.setState({end: endRange.value})} />
          </span>
          <span className='breath' />
          <span>
            <button
              className='smallAction clearWhite'
              onClick={(e)=>this.tops()}
            > <i className='fas fa-sync fa-fw'></i> REFRESH </button>
          </span>
        </div>
        
        {!tops ?
          <CalcSpin />
        :
          <div className='wide space balance'>
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
          </div>
        }
        
        
        
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