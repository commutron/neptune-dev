import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import DateRangeSelect from '/client/components/smallUi/DateRangeSelect.jsx';
import LeapText from '/client/components/tinyUi/LeapText.jsx';
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
  
  matchWidget(wKey) {
    const widget = this.props.widgetData.find( x => x._id === wKey );
    return widget;
  }
  
  matchGroup(gKey) {
    const group = this.props.groupData.find( x => x._id === gKey );
    return group;
  }
  
  render () {
    
    const tops = this.state.tops;
    
    return(
      <div className='centre'>
      
        <DateRangeSelect
          setFrom={(v)=>this.setState({start: v})}
          setTo={(v)=>this.setState({end: v})}
          doRefresh={(e)=>this.tops()} />
        
        {!tops ?
          <CalcSpin />
        :
          <div className='wide max1000 space balance'>
        
            <BstWrstNCresults
              title='Best'
              color='goodBox'
              results={this.state.tops.bestNC}
              widgetData={this.props.widgetData}
              groupData={this.props.groupData}
            />
            
            <BstWrstNCresults
              title='Worst'
              color='badBox'
              results={this.state.tops.worstNC}
              widgetData={this.props.widgetData}
              groupData={this.props.groupData}
            />
            
          </div>
        }
        
      </div>
    );
  }
  componentDidMount() {
    this.tops();
  }
}

const BstWrstNCresults = ({ title, color, results, widgetData, groupData })=> {
  
  function matchWidget(wKey) {
    const widget = widgetData.find( x => x._id === wKey );
    return widget;
  }
  
  function matchGroup(gKey) {
    const group = groupData.find( x => x._id === gKey );
    return group;
  }
  
  return(
    <div className={'smallResultsBox ' + color}>
      <table className='wide'><tbody>
        <tr colSpan='4'><th>{title}</th></tr>
        {results.map( (entry, index)=>{
          let wdgt = matchWidget(entry.w);
          let grp = !wdgt ? 'unknown' : matchGroup(wdgt.groupId); 
          return(
            <tr key={index}>
              <td>
                <LeapText
                  title={entry.b} 
                  sty={false}
                  address={'/data/batch?request=' + entry.b}
                />
              </td>
              <td>
                <LeapText
                  title={grp.alias} 
                  sty={false}
                  address={'/data/group?request=' + grp.alias}
                />
              </td>
              <td>
                <LeapText
                  title={wdgt.widget} 
                  sty={false}
                  address={'/data/widget?request=' + wdgt.widget}
                />
              </td>
              <td className='medBig'>{entry.value}</td>
            </tr>
        )})}
      </tbody></table>
    </div> 
    
  );
};

export default BestWorstBatch;