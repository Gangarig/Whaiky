// ImageService.js

import ImagePicker from 'react-native-image-crop-picker';

export const selectImageFromGallery = (width, height) => {
  return new Promise((resolve, reject) => {
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
    })
    .then((image) => {
      resolve(image.path);
    })
    .catch((error) => {
      reject(error);
    });
  });
};

export const takePhotoWithCamera = (width, height) => {
  return new Promise((resolve, reject) => {
    ImagePicker.openCamera({
      width,
      height,
      cropping: true,
    })
    .then((image) => {
      resolve(image.path);
    })
    .catch((error) => {
      reject(error);
    });
  });
};

// function to select multiple images from gallery for addpost
export const selectMultipleImagesFromGallery = (width, height, maxImages = 3) => {
  return new Promise((resolve, reject) => {
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      multiple: true,
      maxFiles: maxImages,
    })
    .then((images) => {
      const paths = images.map(image => image.path);
      resolve(paths);
    })
    .catch((error) => {
      reject(error);
    });
  });
};
