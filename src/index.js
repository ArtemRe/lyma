import { fetchCards } from './fetchCards';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let page = null;
let totalPages = null;
const per_page = 40;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});

const getSearchQuery = () => {
  return refs.searchForm.elements.searchQuery.value.trim();
};

const showLoadMoreBtn = () => {
  refs.loadMoreBtn.classList.remove('hidden');
};
const hideLoadMoreBtn = () => {
  refs.loadMoreBtn.classList.add('hidden');
};

const renderCards = photoCards => {
  const cardsMarkup = photoCards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a href="${largeImageURL}">
    <img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info_item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info_item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info_item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info_item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
  </div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', cardsMarkup);
};
const removeCards = () => {
  refs.gallery.innerHTML = '';
};

const search = async searchQuery => {
  try {
    const data = await fetchCards(searchQuery, page, per_page);
    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      totalPages = Math.ceil(data.totalHits / per_page);
      if (page === 1) {
        Notify.info(`Hooray! We found ${data.totalHits} images.`);
      }
      renderCards(data.hits);

      if (page >= totalPages) {
        hideLoadMoreBtn();
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        showLoadMoreBtn();
      }
      page += 1;
      lightbox.refresh();
    }
  } catch (error) {
    console.log(error);
  }
};

const scroll = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const onSearchClick = async e => {
  e.preventDefault();
  removeCards();
  hideLoadMoreBtn();
  const searchQuery = getSearchQuery();
  page = 1;

  if (searchQuery !== '') {
    await search(searchQuery);
  }
};
const onLoadMoreClick = async () => {
  const searchQuery = getSearchQuery();
  await search(searchQuery);
  scroll();
};

refs.searchForm.addEventListener('submit', onSearchClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
