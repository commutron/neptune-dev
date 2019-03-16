import React, {Component} from 'react';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import { NonConTypeChart } from '/client/components/charts/NonConOverview.jsx';

export default class NonConMultiBatchBar extends Component {
  
  componentDidMount() {
    this.loop();
  }
  
  constructor() {
    super();
    this.state = {
      counts: false
    };
  }
  
  loop() {
    Meteor.call('nonConBatchesTypes', this.props.batchIDs, (error, reply)=>{
      error && console.log(error);
      this.setState({ counts: reply });
    });
  }
  
  render () {
    
    const counts = this.state.counts;
    
    if(!counts) {
      return(
        <CalcSpin />
      );
    }
    
    return(
      <NonConTypeChart
        counts={counts}
        stack={false} />
    );
  }
}