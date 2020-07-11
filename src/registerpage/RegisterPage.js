import React from 'react'
import { withRouter } from 'react-router'

import './RegisterPage.css'

import RealEstate, { house_type } from '../RealEstate'

import { Button, Form } from 'react-bootstrap'


import AddressPositionSearch from './AddressPositionSearchComponent.js'
import PriceInput from './PriceInput'
import AreaInput from './AreaInput'



class RegisterPage extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            _house_type: null,
            address: "",
            price: "",
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


    update_price_text_callback(new_text){

        this.setState({
            price_text: new_text
        })

    }

    trysubmit() {


        // verify if all inputs are filled in properly



        let rs = new RealEstate(this.state._house_type, this.state.price, this.state.address, this.state.position, this.state.commute_time, this.state.area)


        let result = this.props.submitCallback(rs)

        if (result) {
            this.props.history.push('/')
        }
        else {
            alert("error registering")
        }
    }

    updateAreaUnitIsMetric(newval){
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
                <AddressPositionSearch />
                <div>
                    <span>price</span>
                    {/* <input type="number" value={this.state.price} onChange={e => this.setState({ price: e.target.value })}></input> */}
                    <PriceInput updatePriceText={this.update_price_text_callback} price_text={this.state.price_text} />
                </div>
                <div>
                    <span>area</span>
                    {/* <input type="number" value={this.state.area} onChange={e => this.setState({ area: e.target.value })}></input> */}
                    <AreaInput area_text={this.state.area_text}  updateAreaUnitIsMetric={this.updateAreaUnitIsMetric} updateAreaText={a=>this.setState({area_text: a})} area_unit_is_metric={this.state.is_area_unit_metric} />
                </div>
                <div>
                    <span>commute time</span>
                    <input type="number" value={this.state.commute_time} onChange={e => this.setState({ commute_time: e.target.value })}></input>
                </div>

                <div>
                    <button onClick={e => this.trysubmit()}>submit</button>
                </div>
            </div>
        )
    }
}

export default withRouter(RegisterPage)