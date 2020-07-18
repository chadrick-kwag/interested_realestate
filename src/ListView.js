import React from 'react'
import './ListView.css'

import { Table, Button } from 'react-bootstrap'
import { house_type_kor_text } from './RealEstate'



class ListView extends React.Component {


    constructor(props) {

        super(props)

        this.state = {
            address_ascending: null,
            price_ascending: null,
            area_ascending: null,
            house_type_ascending: null,
            commute_time_ascending: null,

            ascending_options: {
                address: null,
                price: null,
                area: null,
                house_type: null,
                commute_time: null
            }


        }

        this.update_processed_ascending_options = this.update_processed_ascending_options.bind(this)
        this.get_new_toggled_new_val_for_ascending_option = this.get_new_toggled_new_val_for_ascending_option.bind(this)
        this.get_ascending_icon_for_type = this.get_ascending_icon_for_type.bind(this)

    }

    update_processed_ascending_options(key, newval) {

        let new_ao = {}
        Object.keys(this.state.ascending_options).map(k => {

            if (k == key) {
                new_ao[key] = newval
            }
            else {
                new_ao[k] = null
            }
        })


        this.setState({
            ascending_options: new_ao
        })

    }

    get_ascending_icon_for_type(key) {
        if (this.state.ascending_options[key] == null) {
            return null
        }
        else {
            if (this.state.ascending_options[key] == true) {
                return '△'
            }
            else {
                return '▽'
            }
        }
    }


    get_new_toggled_new_val_for_ascending_option(key) {
        let current_val = this.state.ascending_options[key]
        let newval
        if (current_val == null) {
            newval = true
        }
        else {
            if (current_val == true) {
                newval = false
            }
            else {
                newval = true
            }
        }

        return newval
    }

    render() {


        return (
            <Table striped>
                <thead>

                    <th><Button onClick={e => {

                        let newval = this.get_new_toggled_new_val_for_ascending_option("address")

                        this.update_processed_ascending_options("address", newval)

                        this.props.sort_by_key("address", newval)
                    }}>주소{this.get_ascending_icon_for_type("address")}</Button></th>
                    <th><Button onClick={e => {
                        let newval = this.get_new_toggled_new_val_for_ascending_option("price")

                        this.update_processed_ascending_options("price", newval)

                        this.props.sort_by_key("price", newval)


                    }}>가격{this.get_ascending_icon_for_type("price")}</Button></th>
                    <th><Button onClick={e => {
                        let newval = this.get_new_toggled_new_val_for_ascending_option("area")

                        this.update_processed_ascending_options("area", newval)

                        this.props.sort_by_key("area", newval)
                    }}>면적{this.get_ascending_icon_for_type("area")}</Button></th>
                    <th><Button onClick={e => {
                        let newval = this.get_new_toggled_new_val_for_ascending_option("house_type")

                        this.update_processed_ascending_options("house_type", newval)

                        this.props.sort_by_key("house_type", newval)
                    }}>타입{this.get_ascending_icon_for_type("house_type")}</Button></th>
                    <th><Button onClick={
                        e => {
                            let newval = this.get_new_toggled_new_val_for_ascending_option("commute_time")

                            this.update_processed_ascending_options("commute_time", newval)

                            this.props.sort_by_key("commute_time", newval)
                        }
                    }>출퇴근소요시간{this.get_ascending_icon_for_type("commute_time")}</Button></th>
                </thead>
                <tbody>
                    {this.props.data.map(d => {
                        
                        return <tr >
                            <td>{d.address}</td>
                            <td>{d.price}</td>
                            <td>{d.area}㎡</td>
                            <td>{house_type_kor_text[d.house_type]}</td>
                            <td>{d.commute_time}</td>
                        </tr>
                    }
                    )}
                </tbody>
            </Table>
        )
    }
}


export default ListView