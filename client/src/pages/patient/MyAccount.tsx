import { useState } from 'react'
import Profile from '../../components/patient/profile/Profile'
import EditProfile from '../../components/patient/profile/EditProfile'
import EditAddress from '../../components/patient/profile/EditAddress';

type CurrentState = "view-account" | 'edit-profile' | 'edit-address';

const MyAccount = () => {
    const [currentState, setCurrentState] = useState<CurrentState>("view-account")

    const switchToEditProfile = () => {
        setCurrentState('edit-profile')
    }

    const swithToEditAddress = () => {
        setCurrentState('edit-address')
    }

    const switchToViewProfile = () => {
        setCurrentState('view-account')
    }

    return (
        <>
            { currentState === 'view-account' && <Profile handleEditProfile={switchToEditProfile} handleEditAddress={swithToEditAddress} /> }
            { currentState === 'edit-profile' && <EditProfile handleSave={switchToViewProfile} /> }
            { currentState === "edit-address" && <EditAddress handleSave={switchToViewProfile} /> }
        </>
    )
}

export default MyAccount