import React from 'react'

import { Button, Form } from 'react-bootstrap'


class CommuteTimeComponent extends React.Component {


    constructor(props){
        super(props)

        this.state={
            disable_main_input_box : false,
            is_manual_input: true

        }

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

        let commute_time_text = this.props.commute_time == null ? "" : this.props.commute_time

        let manual_input_variant, auto_calc_variant

        if(this.state.is_manual_input){
            manual_input_variant = 'warning'
            auto_calc_variant = 'secondary'
        }
        else{
            manual_input_variant = 'secondary'
            auto_calc_variant = 'warning'
        }

        return <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }}>
            <Form.Control value={commute_time_text} disabled={this.state.disable_main_input_box} onChange={e=>this.props.update_commute_time(e.target.value)}></Form.Control>
            {this.props.commute_time!==""? <span>분</span> : null}

            <Button variant={manual_input_variant} onClick={e=>this.setState({is_manual_input : true})}>직접입력</Button>
            <Button variant={auto_calc_variant} onClick={e=>this.setState({is_manual_input : false})}>자동계산</Button>

        </div>
    }
}

export default CommuteTimeComponent