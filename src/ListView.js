import React from 'react'
import './ListView.css'

import { Table } from 'react-bootstrap'



class ListView extends React.Component {


    constructor(props) {

        super(props)

    }


    render() {


        return (
            <Table striped>
                <thead>

                    <th>주소</th>
                    <th>price</th>
                </thead>
                <tbody>
                    {this.props.data.map(d =>
                        <tr >
                            <td>{d.address}</td>
                            <td>{d.price}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        )
    }
}


export default ListView