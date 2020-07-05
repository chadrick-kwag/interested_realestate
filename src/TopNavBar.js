import React from 'react'
import {withRouter} from 'react-router'

class TopNavBar extends React.Component {



    render() {
        return (
            <div >

                <button onClick={e=>this.props.history.push('/register')}>register</button>
                <button onClick={e => this.props.toggleCallback()}>change</button>


            </div>
        )

    }
}

export default withRouter(TopNavBar)