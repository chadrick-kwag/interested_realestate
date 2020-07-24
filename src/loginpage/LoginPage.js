import React from 'react'

import { Form, Button } from 'react-bootstrap'
import "./loginpage.css"

class LoginPage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            username: 'a',
            password: 'b'
        }

        this.onsubmit = this.onsubmit.bind(this)
    }

    onsubmit() {
        fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true,
            credentials: 'include',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }).then(d => d.json())
            .then(d => {
                console.log(d)

            })
            .catch(e => {
                console.log(e)
            })
    }

    render() {
        return <div>
            <div className="background">
            </div>
            <div className="title-div noselect">
                <h1 className="title-h1">부동산 트래커</h1>
            </div>
            <div className="loginbox">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <span>username</span>
                    <Form.Control value={this.state.username} onChange={e => this.setState({
                        username: e.target.defaultValue
                    })}></Form.Control>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <span>password</span>
                    <Form.Control type='password' value={this.state.password} onChange={e => this.setState({
                        password: e.target.value
                    })}></Form.Control>
                </div>
                <Button onClick={e => this.onsubmit()}>login</Button>
            </div>
        </div>

    }
}


export default LoginPage