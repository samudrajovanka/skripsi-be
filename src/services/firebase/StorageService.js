const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../../utils/firebase/connection');
const InvariantError = require('../../exceptions/InvariantError');

class FirebaseStorageService {
  uploadFile(file, { folderName }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!file) {
          reject(new InvariantError('Tidak ada file yang diupload'));
        }

        const metadata = {
          contentType: file.mimetype,
        };


        const fileName = `${+Date.now()}-${file.originalname}`;
        const pathFileName = folderName
          ? `${folderName}/${fileName}`
          : fileName;
        const storageRef = ref(storage, pathFileName);

        const snapshot = await uploadBytes(storageRef, file.buffer, metadata);

        const url = await getDownloadURL(snapshot.ref);

        resolve({
          url,
          originalName: file.originalname,
          fileName
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = FirebaseStorageService;