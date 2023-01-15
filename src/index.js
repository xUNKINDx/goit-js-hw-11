import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPhotos } from './getPhotos/getPhotos';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearchFormSubmitHandler);

new SimpleLightbox('.gallery a');

function onSearchFormSubmitHandler(event) {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  const text = searchQuery.value.trim();

  if (text === '' || text === undefined) {
    return;
    refs.gallery.innerHTML = '';
  }
  getPhotos(text).then(photos => {
    console.log(photos);

    refs.gallery.innerHTML = '';

    if (photos.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    displayPhotos(photos.hits);
  });
}

function displayPhotos(photos) {
  // <a class="gallery__item" href="${photo.original}">
  //     <img class="gallery__image" src="${photo.preview}" alt="${photo.description}" />
  // </a>
  const markup = photos
    .map(
      photo =>
        `<div class="gallery__item">            
            <a href="${photo.largeImageURL}">
              <img class="gallery__image" src="${photo.webformatURL}" alt="" width ="350px" height ="230px" loading="lazy" />
            </a>
            <div class="info">
            <p class="info-item">
                <b>Likes</b>
                <br>
                ${photo.likes}
            </p>
            <p class="info-item">
                <b>Views</b>
                <br>
                ${photo.views}
            </p>
            <p class="info-item">
                <b>Comments</b>
                <br>
                ${photo.comments}
            </p>
            <p class="info-item">
                <b>Downloads</b>
                <br>
                ${photo.downloads}
            </p>
            </div>
        </div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
