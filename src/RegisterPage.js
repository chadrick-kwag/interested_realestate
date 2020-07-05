import React from 'react'
import { withRouter } from 'react-router'

import './RegisterPage.css'

import RealEstate, { house_type } from './RealEstate'

import { Button } from 'react-bootstrap'




class AddressPositionSearch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            address: this.props.address,
            position: this.props.position,
            address_search_results: []
        }


        this.attempt_address_search = this.attempt_address_search.bind(this)

    }

    attempt_address_search(){
        if(this.state.address===null || this.state.address==""){
            return
        }

        let fetch_url = 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode'+'?query=' + this.state.address

        fetch(fetch_url, {
            headers: {
                "X-NCP-APIGW-API-KEY-ID": "bz0k7065a0",
                "X-NCP-APIGW-API-KEY": "hh75tiXOGrIdpc7FQZIN7woY5j7w0SrbkDcqPWZm"
            }
        }).then(d=>d.json())
        .then(d=>console.log(d))
    }


    render() {
        return (

            <div>


                <span>address</span>
                <input type="text" value={this.state.address} onChange={e => this.setState({ address: e.target.value })}></input>
                <button onClick={e=>this.attempt_address_search()}>search</button>

                <div style={{display: "flex", flexDirection: "row"}}>
        {this.state.address_search_results.length==0? <span>no results</span> : this.state.address_search_results.map(d=> <div>{d.roadAddress}</div>)}
                </div>


            </div>
        )
    }
}


class RegisterPage extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            _house_type: null,
            address: "",
            price: "",
            area: "",
            commute_time: "",
            position: null
        }

        this.trysubmit = this.trysubmit.bind(this)
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
                <AddressPositionSearch/>
                <div>
                    <span>price</span>
                    <input type="number" value={this.state.price} onChange={e => this.setState({ price: e.target.value })}></input>
                </div>
                <div>
                    <span>area</span>
                    <input type="number" value={this.state.area} onChange={e => this.setState({ area: e.target.value })}></input>
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