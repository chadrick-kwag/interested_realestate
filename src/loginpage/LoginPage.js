import React from 'react'

import {Form, Button} from 'react-bootstrap'

class LoginPage extends React.Component{

    render(){
        return <div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <span>username</span>
                <Form.Control></Form.Control>
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}> 
                <span>password</span>
                <Form.Control type='password'></Form.Control>
            </div>

            <Button>login</Button>
        </div>
    }
}


export default LoginPage