const deleteImage = (index, post, setPost) => {
    const updatedImages = [...post.images];
    updatedImages.splice(index, 1);
    setPost({ ...post, images: updatedImages });
  };
  
  export default deleteImage;
  