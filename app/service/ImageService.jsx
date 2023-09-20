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
