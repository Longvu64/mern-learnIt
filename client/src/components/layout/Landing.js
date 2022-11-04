import {Navigate} from 'react-router-dom'

function Landing() {
    return ( 
        <Navigate to='/login'>
            Landing
        </Navigate>
     );
}

export default Landing;