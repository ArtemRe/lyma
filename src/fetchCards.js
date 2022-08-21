import axios from 'axios';

export const fetchCards = async (searchQuery, page, per_page) => {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '29364351-4042f0090539e3343f354af9c';

  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        key: `${KEY}`,
        q: `${searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${page}`,
        per_page: `${per_page}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
