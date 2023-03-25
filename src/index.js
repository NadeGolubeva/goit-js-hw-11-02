import Notiflix from "notiflix";
// import "./css/styles.css";
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  btnSearch: document.querySelector(".search"),
  form: document.querySelector(".search-form"),
  input: document.querySelector("input"),
  btnLoadMore: document.querySelector(".load-more"),
  gallery: document.querySelector(".gallery"),
};
// console.log(refs.form);
// console.log(refs.btnSearch);
// console.log(refs.btnLoadMore);
refs.btnLoadMore.classList.add("is-hidden");
refs.form.addEventListener("submit", onSubmit);
refs.btnLoadMore.addEventListener("click", onLoadMoreClick);

let searchPhotos = "";

function onSubmit(e) {
  e.preventDefault();
  page = 1;
  refs.gallery.innerHTML = "";
  refs.btnLoadMore.classList.add("is-hidden");
  const searchPhotos = refs.input.value.trim();
  console.log(searchPhotos);
  apiBase(searchPhotos, page);
  refs.btnLoadMore.classList.remove("is-hidden");
  //   refs.input.value = "";
}
function onLoadMoreClick(e) {
  const searchPhotos = refs.input.value.trim();
  page += 1;
  apiBase(searchPhotos, page);
}

// function onInput(e) { console.log(e); }

async function apiBase(searchPhotos, page) {
  const BASE_URL = "https://pixabay.com/api/";
  const options = {
    params: {
      key: "34597953-a4e95632ef22c5c1cfd0a734f",
      q: searchPhotos,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: "true",
      page: page,
      per_page: 40,
    },
  };
  try {
    const response = await axios.get(BASE_URL, options);
    console.log(response);
    console.log(response.data);

    if (response.data.hits.length === 0) {
      Notiflix.Notify.warning(
        "Sorry, there are no images matching your search query. Please try again."
      );
    }
    if (response.data.hits.length < 40 && response.data.hits.length > 1) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      refs.btnLoadMore.classList.add("is-hidden");
    }
    if (page === 1 && response.data.hits.length > 1) {
      const amount = response.data.total;
      Notiflix.Notify.success(`"Hooray! We found ${amount} images. `);
    }
    console.log(response.data.total);
    markup(response.data);
  } catch (error) {
    console.log(error);
  }
}

function markup(posts) {
  const post = posts.hits
    .map(
      (pic) => `
      
      <a class="photo" href="${pic.largeImageURL}"
       <div class="photo-card">
     <img src="${pic.webformatURL}" alt="${pic.tags}"  loading="lazy" />
     <div class="info">
       <p class="info-item">
         <b> Likes </b>
         ${pic.likes}
       </p>
       <p class="info-item">
         <b> Views </b>
         ${pic.views}
       </p>
       <p class="info-item">
         <b> Comments </b>
         ${pic.comments}
       </p>
       <p class="info-item">
         <b> Downloads </b>
         ${pic.downloads}
       </p>
     </div>
   </div> </a> `
    )
    .join(" ");
  //   console.log(post);
  refs.gallery.insertAdjacentHTML("beforeend", post);
  lightbox.refresh();
}

const lightbox = new SimpleLightbox(".gallery a", {
  captionDelay: 250,

  captionsData: "alt",
});
