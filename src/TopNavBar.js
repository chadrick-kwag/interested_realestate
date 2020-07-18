import React from 'react'
import {withRouter} from 'react-router'
import {Button} from 'react-bootstrap'

class TopNavBar extends React.Component {



    render() {
        return (
            <div >

                <Button onClick={e=>this.props.history.push('/register')}>register</Button>
                <Button onClick={e => this.props.toggleCallback()}>change</Button>


            </div>
        )

    }
}

export default withRouter(TopNavBar)