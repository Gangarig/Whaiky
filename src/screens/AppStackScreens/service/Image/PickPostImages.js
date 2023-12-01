import ImageCropPicker from 'react-native-image-crop-picker';
import { showMessage } from 'react-native-flash-message';

const pickImages = async (post, setPost) => {
  try {
    const currentImageCount = post.images.length;
    const maxImageCount = 3;

    if (currentImageCount >= maxImageCount) {
      showMessage({
        message: 'You can upload up to three images.',
        type: 'warning',
      });
      return;
    }

    const remainingImageCount = maxImageCount - currentImageCount;

    const images = await ImageCropPicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      compressImageQuality: 0.7,
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      cropping: false,
      maxFiles: remainingImageCount,
    });

    if (!images || images.length === 0) {
      // No images selected or user canceled
      return;
    }

    const updatedImages = [...post.images, ...images.slice(0, remainingImageCount)];

    setPost({ ...post, images: updatedImages });
  } catch (error) {
    if (error.message && error.message.includes('User cancelled image selection')) {
      // User canceled image selection, no need to show an error message
      return;
    }

    console.error('Error picking images:', error);

    // Handle other errors, such as network issues or unexpected errors
    showMessage({
      message: 'An error occurred while picking images. Please try again later.',
      type: 'danger',
    });
  }
};

export default pickImages;
