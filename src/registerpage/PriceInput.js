import React from 'react'

import { Button, Form } from 'react-bootstrap'

import {numToKorean} from 'num-to-korean'


function price_num_to_kor_text_cut_at_uk(price_num){
    let uk_unit_num = Number(price_num) / 100000000
    
    return uk_unit_num

}

function price_text_to_num(price_text){
    let t = price_text.trim()
    t = t.replace(/,/g,'')


    return t
}


function parse_price_text_to_kor_text(price_text) {


    let num_text = price_text_to_num(price_text)


    let kor_text = numToKorean(Number(num_text))

    if(kor_text!==""){
        kor_text += " 원"
    }

    return kor_text
}

class PriceInput extends React.Component {


    constructor(props) {
        super(props)


        this.update_price_text = this.update_price_text.bind(this)
        
    }


    num_to_price_text(num_text){
        let output=""

        let char_left = num_text.length

        for(let i=0;i<num_text.length;i++){
            output += num_text[i]
            char_left-=1
            if(char_left>0 && char_left%3==0){
                output += ","
            }
        }

        return output
    }

    update_price_text(new_text) {

        let num_text = price_text_to_num(new_text)


        let converted_text = this.num_to_price_text(num_text)


        this.props.updatePriceText(converted_text)
        
    }

    // parse_price_text_to_kor_text(price_text) {


    //     let num_text = price_text_to_num(price_text)


    //     let kor_text = numToKorean(Number(num_text))

    //     if(kor_text!==""){
    //         kor_text += " 원"
    //     }

    //     return kor_text
    // }


    render() {
        return <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }}>
            <Form.Control style={{width: "70%"}} value={this.props.price_text} onKeyPress={e=>{
                

                const allowed_key_arr = ['0','1','2','3','4','5','6','7','8','9',',']

                if(!allowed_key_arr.includes(e.key)){
                    e.preventDefault()
                }
            }} onChange={e => {
                
                this.update_price_text(e.target.value)}} />
            <span style={{width: "20%"}}>{parse_price_text_to_kor_text(this.props.price_text)}</span>
        </div>
    }
}

export default PriceInput
export {price_text_to_num, parse_price_text_to_kor_text, price_num_to_kor_text_cut_at_uk}