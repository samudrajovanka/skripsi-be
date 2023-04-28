const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');
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

  uploadFiles(files, { folderName }) {
    return new Promise(async (resolve, reject) => {
      try {
        const filesResult = await Promise.all(
          files.map(async (file) => {
            const result = await this.uploadFile(file, {
              folderName,
            });

            return result;
          })
        );

        resolve(filesResult);
      } catch (error) {
        reject(error);
      }
    });
  }

  getPathFromUrl(url) {
    // https://firebasestorage.googleapis.com/v0/b/spakip-88b20.appspot.com/o/6440391f1b1b4844a5a59382%2F643ecf6e0042e7b8f680c4d8%2F1682265607995-Jovanka%20Samudra-resume.pdf?alt=media&token=8aaca794-f8fa-4c46-b788-42d109e7294e

  
  }

  deleteFile(path) {
    return new Promise(async (resolve, reject) => {
      try {
        const fileRef = ref(storage, path);

        await deleteObject(fileRef);

        resolve(true);
      } catch (error) {
        reject(error)
      }
    })
    
    
  }
}

module.exports = FirebaseStorageService;