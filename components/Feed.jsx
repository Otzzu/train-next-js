'use client'

import { useState, useEffect} from 'react'

import PromptCard from '@components/PromptCard'

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard key={post.id} post={post} handleTagClick={handleTagClick}/>
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState('')
  const [posts, setPosts] = useState([])

  const handleTagClick = (tag) => {
    setSearchText(tag)
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt')
      const data = await response.json()

      setPosts(data)
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      const fetchPosts = async () => {
        let response

        const text = searchText.replace('#', '')

        if (!text) {
          response = await fetch('/api/prompt')
        } else if (searchText){
          response = await fetch(`/api/prompt/search/${text}`) 
        }

        const data = await response.json()
        // alert(JSON.stringify(data))
        setPosts(data)
      }
  
      fetchPosts()
    }, 2000)

    return () => {
      clearTimeout(searchTimeout)
    }
  }, [searchText])

  return (
    <section className='feed'>
      <form className='relative w-full flex-center' onSubmit={e => e.preventDefault()}>
        <input type='text' placeholder='Search for a tag or a username' value={searchText} onChange={(e) => setSearchText(e.target.value)} required className='search_input peer'/>
      </form>

      <PromptCardList data={posts} handleTagClick={handleTagClick}/>
    </section>
  )
}

export default Feed
