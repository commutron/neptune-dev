import React, {Component} from 'react';

export default class BoardRow extends Component {
  render() {
    return (
      <tr className='row'>
        <td>{this.props.entry.barcode}</td>
        <td>{this.props.entry.order}</td>
        <td>{this.props.entry.createdAt.toString()}</td>
					{this.props.entry.pass.map( (item, index)=>{
          return <td key={index}>{this.props.entry.pass[index].name} Passed</td>
						})}
			</tr>     
    )
  }
}