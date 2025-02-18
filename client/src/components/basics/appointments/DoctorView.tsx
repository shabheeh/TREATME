
import { useLocation } from 'react-router-dom'

const DoctorView = () => {

    const location = useLocation()

    const state = location.state

    console.log(state, state)

  return (
    <div>DoctorView</div>
  )
}

export default DoctorView