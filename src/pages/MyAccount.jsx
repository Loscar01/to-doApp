import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom"
import { supabase } from '../server/server'
import "./css/account.css"

function MyAccount() {
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(()=>{
        const fetchSession = async() => {
            setLoading(true)
            try {
                const { data, error } = await supabase.auth.getSession()
                if(!data || data === undefined || data=== null){
                    navigate('/')
                }else{
                    setUserData(data.session.user);
                }
            } catch (error) {
                console.log("Error fetching data user: ",error)
            }finally{
                setLoading(false)
            }
        }
        fetchSession()
    },[navigate])

    if (loading) {
        setTimeout(() => {
            return <p>loading...</p>
        }, 1000);
    }
  return (
    <div>
      <nav>
        <ul>
          <li><button onClick={()=> navigate('/home')} className='btn__nav'>Home</button></li>
        </ul>
      </nav>
      <div className='account__container'>
        
        {userData &&
            <div>
                <h1>Name: {userData.name}</h1>
                <h1>Email: {userData.email}</h1>
            </div>
        }
      </div>
    </div>
  )
}

export default MyAccount
