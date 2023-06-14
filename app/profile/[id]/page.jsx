'use client'

import { useEffect, useState } from 'react'

import Profile from "@components/Profile"
import { useSearchParams } from 'next/navigation'

const MyProfile = ( {params} ) => {
  const [posts, setPosts] = useState([])
  const searchParams = useSearchParams()
  const name = searchParams.get('name')
  
  useEffect(() => {
    const fetchPosts = async () => {
        const response = await fetch(`/api/users/${params.id}/posts`)
        const data = await response.json()

        setPosts(data)
    }

    fetchPosts()
 
  }, [])

  return (
    <Profile name={name} desc='Welcome to your personalized profile page' data={posts}/>
  )
}


export default MyProfile
