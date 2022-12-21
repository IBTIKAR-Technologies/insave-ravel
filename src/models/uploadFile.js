import { Image } from 'react-native-compressor';

const api = 'https://ciblagetest.vercel.app/api/upload';

export async function uploader(filename) {
  const newFiles = await Promise.all(async () => {
    const result = await Image.compress(filename.assets[0].uri, {
      compressionMethod: 'auto',
    });
    return result;
  });
  fetch(api, {
    method: 'POST',
    headers: { 'content-type': 'multipart/form-data' },
    body: JSON.stringify({ theFiles: [newFiles] }),
  })
    .then(() => console.log('succ'))
    .catch(e => console.log('er', e));
}
