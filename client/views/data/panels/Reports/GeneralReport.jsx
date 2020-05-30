import { Meteor } from 'meteor/meteor';
import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import ReportRequest from '/client/components/forms/ReportRequest.jsx'; 
import ReportStatsTable from '/client/components/tables/ReportStatsTable.jsx'; 

export default class Reports extends Component {
  
  constructor() {
    super();
    this.state = {
      //tops: false,
      start: false,
      end: false,
      getNC: true,
      getType: true,
      getPhase: true,
      working: false,
      replyData: false
    };
  }
  
  changeNC() {
    if(this.state.getNC === true) {
      this.setState({getNC: false});
      this.setState({getType: false});
      this.setState({getPhase: false});
    }else{
      this.setState({getNC: true});
    }
  }
  changeType() {
    if(this.state.getType === false) {
      this.setState({getNC: true});
      this.setState({getType: true});
    }else{
      this.setState({getType: false});
    }
  }
  changePhase() {
    if(this.state.getPhase === false) {
      this.setState({getNC: true});
      this.setState({getPhase: true});
    }else{
      this.setState({getPhase: false});
    }
  }
  
  getReport(){
    this.setState({working: true});
    this.setState({replyData: false});
    Meteor.call('buildReport', 
      this.state.start, 
      this.state.end,
      this.state.getNC, 
      this.state.getType,
      this.state.getPhase, 
    (error, reply)=> {
      error && console.log(error);
      //this.setState({ tops: reply });
      if(reply) {
        //console.log(reply);
        let arrange = [
          ['Included ' + Pref.batches, reply.batchInclude ],
          [ 'Included Serialized Items', reply.itemsInclude ],
          [ 'Finished Serialized Items', reply.itemStats.finishedItems ],
          [ 'Passed First-offs', reply.itemStats.firstPass ],
          [ 'Rejected First-offs', reply.itemStats.firstFail ],
          [ 'Scrapped Serialized Items', reply.itemStats.scraps ],
          [ 'Failed Tests', reply.itemStats.testFail ],
          [ 'Part Shortfalls', reply.shortfallCount ],
          [ 'Discovered Non-conformances', reply.nonConStats.foundNC ],
          [ 'Items with Non-conformances', reply.nonConStats.uniqueSerials ],
          /*
          [ 'Serial Numbers with Non-conformances', 
            this.state.getNC ?
              [  [ 'Quantity of Items', reply.nonConStats.uniqueSerials ],
                [ 'Percent of All Items', reply.itemsWithPercent ] ]
            : false
          ],
          */
          [ 'Non-conformance Types', reply.nonConStats.typeBreakdown ],
          [ 'Non-conformance Departments', reply.nonConStats.phaseBreakdown ]
        ];
        this.setState({working: false});
        this.setState({replyData: arrange});
      }
    });
  }
  
  render () {
    
    //console.log(this.state);
    
    const lock = !this.state.start || !this.state.end;
    
    const g = this.props.groupData;
    const w =this.props.widgetData;
    const b = this.props.batchData;
    const a = this.props.app;
    
    
    return(
      <div className='overscroll'>
        <div className='centre wide space noPrint'>
        
          
          <h2>Generate Basic Report</h2>
          
          <ReportRequest 
            setFrom={(v)=>this.setState({start: v})}
            setTo={(v)=>this.setState({end: v})}
            ncCheck={this.state.getNC}
            setNC={(v)=>this.changeNC(v)}
            typeCheck={this.state.getType}
            setType={(v)=>this.changeType(v)}
            phaseCheck={this.state.getPhase}
            setPhase={(v)=>this.changePhase(v)} />
          
          <div className='space'>
            <button 
              className='action clearWhite'
              onClick={this.getReport.bind(this)} 
              disabled={lock || this.state.working}
            >Generate Report</button>
          </div>
        
        </div>
        
        {this.state.working ?
          <div>
            <p className='centreText'>This may take a while...</p>
            <CalcSpin />
          </div>
        :
          <ReportStatsTable 
            title='basic report' 
            dateString={`${this.state.start}to${this.state.end}`}
            rows={this.state.replyData}
            extraClass='max500' />
        }
            
      </div>
    );
  }
}