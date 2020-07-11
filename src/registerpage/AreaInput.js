import React from 'react'

import { Button, Form } from 'react-bootstrap'


class AreaInput extends React.Component {

    constructor(props){
        super(props)
        this.update_area_text = this.update_area_text.bind(this)
    }

    update_area_text(new_text){
        this.props.updateAreaText(new_text)
    }


    render() {
        let pyung_variant
        let metric_variant


        if (this.props.area_unit_is_metric) {
            pyung_variant = 'secondary'
            metric_variant = 'warning'
        }
        else {
            pyung_variant = 'warning'
            metric_variant = 'secondary'
        }


        return <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }}>
            <Form.Control style={{width: "80%"}} value={this.props.area_text}  onChange={e=>this.update_area_text(e.target.value)}
            onKeyPress={e=>{
                

                const allowed_key_arr = ['0','1','2','3','4','5','6','7','8','9']

                if(!allowed_key_arr.includes(e.key)){
                    e.preventDefault()
                }
            }}
            />

            <div style={{width: "20%"}}>
                <Button variant={pyung_variant} onClick={e => this.props.updateAreaUnitIsMetric(false)}>평</Button>
                <Button variant={metric_variant} onClick={e => this.props.updateAreaUnitIsMetric(true)}>m3</Button>
            </div>

        </div>
    }
}

export default AreaInput