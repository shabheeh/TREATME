import { useState } from 'react'
import Profile from '../../components/patient/Profile'
import EditProfile from '../../components/patient/EditProfile'

const MyAccount = () => {
    const [isEditing, setIsEditing] = useState(false)

    const switchToEdit = () => {
        setIsEditing(true)
    }

    const switchToProfile = () => {
        setIsEditing(false)
    }

    return (
        <>
            {isEditing 
                ? <EditProfile handleSave={switchToProfile} /> 
                : <Profile handleEdit={switchToEdit} />
            }
        </>
    )
}

export default MyAccount