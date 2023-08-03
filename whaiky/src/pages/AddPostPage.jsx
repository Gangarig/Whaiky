import React from 'react'
import AddPost from '../components/post/AddPost'
import Navbar from '../components/Navbar'
const AddPostPage = () => {
  return (
    <>
    <Navbar/>
    <div className='paddingFromNav'>
      <AddPost/>
    </div>
    </>
  )
}

export default AddPostPage