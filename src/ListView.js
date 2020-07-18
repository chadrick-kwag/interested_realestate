import React from 'react'
import './ListView.css'

import { Table, Button } from 'react-bootstrap'



class ListView extends React.Component {


    constructor(props) {

        super(props)

    }


    render() {


        return (
            <Table striped>
                <thead>

                    <th>주소</th>
                    <th>가격</th>
                    <th>면적</th>
                    <th>타입</th>
                    <th>출퇴근소요시간</th>
                </thead>
                <tbody>
                    {this.props.data.map(d =>
                        <tr >
                            <td>{d.address}</td>
                            <td>{d.price}</td>
                            <td>{d.area}</td>
                            <td>{d.house_type}</td>
                            <td>{d.commute_time}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        )
    }
}


export default ListView