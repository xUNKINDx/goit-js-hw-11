import axios from 'axios';
export { getPhotos };

const API_KEY = '32843722-0ef105cddfccbed0a9837eafd';
const URI = 'https://pixabay.com/api/';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFESEARCH = 'true';

async function getPhotos(searchText) {
  const query = encodeURIComponent(searchText.replace(' ', '+'));

  const url = `${URI}?key=${API_KEY}&q=${query}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFESEARCH}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
