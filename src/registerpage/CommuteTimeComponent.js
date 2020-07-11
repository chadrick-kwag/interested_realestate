import React from 'react'

import { Button, Form } from 'react-bootstrap'


class CommuteTimeComponent extends React.Component {


    constructor(props){
        super(props)

        this.parse_commute_time_to_text = this.parse_commute_time_to_text.bind(this)
        this.calculate = this.calculate.bind(this)

    }

    parse_commute_time_to_text(){
        if(this.props.commute_time==0 || this.props.commute_time==null){
            return ""
        }

        return this.props.commute_time
    }

    calculate(){
        // using naver api routes, calculate commute time

        let commute_time = 10
        this.props.updateCommuteTime(commute_time)
    }

    render() {
        return <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }}>

            <span>{this.parse_commute_time_to_text()}</span>

            <Button onClick={e=>this.calculate()}>계산</Button>

        </div>
    }
}