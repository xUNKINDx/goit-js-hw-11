import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPhotos } from './getPhotos/getPhotos';
import throttle from 'lodash.throttle';

const ITEMS_PER_PAGE = 40;

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

let page = 1;
let totalHits = 0;
let searchText;

refs.searchForm.addEventListener('submit', onSearchFormSubmitHandler);

const throttledHandler = throttle(onWindowScrollHandler, 300);

const lightbox = new SimpleLightbox('.gallery a');

function onSearchFormSubmitHandler(event) {
  event.preventDefault();
  refs.gallery.innerHTML = '';
  page = 1;

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  searchText = searchQuery.value.trim();

  if (searchText === '' || searchText === undefined) {
    return;
  }

  getAndDisplayPhotos(searchText);
  window.addEventListener('scroll', throttledHandler);
}

function getAndDisplayPhotos() {
  getPhotos(searchText, page, ITEMS_PER_PAGE).then(photos => {
    if (photos.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    displayPhotos(photos.hits);
    totalHits = photos.totalHits;

    if (page === 1) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    if (page * ITEMS_PER_PAGE < totalHits) {
    } else {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}

function displayPhotos(photos) {
  const markup = photos
    .map(
      photo =>
        `<div class="gallery__item">            
            <a href="${photo.largeImageURL}">
              <img class="gallery__image" src="${photo.webformatURL}" alt="${photo.tags}" width ="350px" height ="230px" loading="lazy" />
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

  lightbox.refresh();
}

function onWindowScrollHandler(event) {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  if (endOfPage) {
    page++;
    if (page * ITEMS_PER_PAGE >= totalHits) {
      removeInfiniteScroll();
    }
    getAndDisplayPhotos(searchText);
  }
}

const removeInfiniteScroll = () => {
  window.removeEventListener('scroll', throttledHandler);
};
