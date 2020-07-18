import React from 'react'
import { withRouter } from 'react-router'

import './RegisterPage.css'

import RealEstate, { house_type } from '../RealEstate'

import { Button, Form } from 'react-bootstrap'


import AddressPositionSearch from './AddressPositionSearchComponent.js'
import PriceInput, {price_text_to_num} from './PriceInput'
import AreaInput from './AreaInput'
import CommuteTimeComponent from './CommuteTimeComponent'



class RegisterPage extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            _house_type: null,
            address: "",
            area: "",
            commute_time: "",
            position: null,
            price_text: "",
            area_text: "",
            is_area_unit_metric: true
        }

        this.trysubmit = this.trysubmit.bind(this)
        this.update_price_text_callback = this.update_price_text_callback.bind(this)
        this.updateAreaUnitIsMetric = this.updateAreaUnitIsMetric.bind(this)

    }


    update_price_text_callback(new_text) {

        this.setState({
            price_text: new_text
        })

    }

    trysubmit() {


        // verify if all inputs are filled in properly

        if (this.state._house_type == null) {
            alert("invalid house type")
            return
        }

        if (this.state.address == "") {
            alert("no address")
            return
        }

        if (this.state.price_text == "") {
            alert("no price")
            return
        }

        if (this.state.area_text == "") {
            alert("no area")
            return
        }

        if (this.state.commute_time == "") {
            alert("no commute time")
            return
        }

        let price = price_text_to_num(this.state.price_text)
        console.log("submit price: " + price)

        let rs = new RealEstate(this.state._house_type, price, this.state.address, this.state.position, this.state.commute_time, this.state.area_text)


        let result = this.props.submitCallback(rs)

        if (result) {
            this.props.history.push('/')
        }
        else {
            alert("error registering")
        }
    }

    updateAreaUnitIsMetric(newval) {
        this.setState({
            is_area_unit_metric: newval
        })
    }



    render() {

        return (
            <div>

                <div>
                    <span>house type</span>
                    <div>
                        <Button variant={this.state._house_type == house_type.BUY ? "warning" : "light"} onClick={e => this.setState({
                            _house_type: house_type.BUY
                        })}>매매</Button>
                        <Button variant={this.state._house_type == house_type.JEONSAE ? "warning" : "light"} onClick={e => this.setState({ _house_type: house_type.JEONSAE })}>전세</Button>
                        <Button variant={this.state._house_type == house_type.CHUNGYAK ? "warning" : "light"} onClick={e => this.setState({ _house_type: house_type.CHUNGYAK })}>청약</Button>
                    </div>
                </div>
                <AddressPositionSearch updateAddress={(val) => {
                    console.log("updating address: " + val)
                    this.setState({ address: val })

                }} address={this.state.address} />
                <div>
                    <span>price</span>

                    <PriceInput updatePriceText={this.update_price_text_callback} price_text={this.state.price_text} />
                </div>
                <div>
                    <span>area</span>
                    {/* <input type="number" value={this.state.area} onChange={e => this.setState({ area: e.target.value })}></input> */}
                    <AreaInput area_text={this.state.area_text} updateAreaUnitIsMetric={this.updateAreaUnitIsMetric} updateAreaText={a => this.setState({ area_text: a })} area_unit_is_metric={this.state.is_area_unit_metric} />
                </div>
                <div>
                    <span>commute time</span>
                    <CommuteTimeComponent commute_time={this.state.commute_time} update_commute_time={(val) => this.setState({
                        commute_time: val
                    })} />
                </div>

                <div>
                    <button onClick={e => this.trysubmit()}>submit</button>
                </div>
            </div>
        )
    }
}

export default withRouter(RegisterPage)