import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import AddPost from '../../components/post/AddPost'
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