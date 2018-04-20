import React, {Component} from 'react';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import { NonConTypeChart } from '/client/components/charts/NonConOverview.jsx';

export default class NonConMultiBatchBar extends Component {
  
  constructor() {
    super();
    this.state = {
      counts: false
    };
  }
  
  loop() {
    Meteor.call('nonConBatchesTypes', this.props.batchIDs, (error, reply)=>{
      if(error)
        console.log(error);
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

    const labels = !counts[0] ? [] :  Array.from(counts[0].value, x => x.meta);
    
    return(
      <NonConTypeChart
        counts={counts}
        labels={labels}
        stack={false} />
    );
  }
  componentDidMount() {
    this.loop();
  }
}