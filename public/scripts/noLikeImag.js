function toggleLike(event) {
  event.preventDefault();
  const isLike = !document.getElementById(`like-${event.target.id}`).hidden;
  if (!isLike) {
    document.getElementById(`like-${event.target.id}`).hidden = false;
    document.getElementById(`nolike-${event.target.id}`).hidden = true;
    document.getElementById(`likeBtn-${event.target.id}`).textContent =
      "Dislike";
    axios
      .post(`/drinks/${event.target.id}/like`, { withCredentials: true })
      .then((response) => {
        document.getElementById(`likeCounter-${event.target.id}`).textContent =
          response.data;
      })
      .catch(console.log);
  } else {
    document.getElementById(`like-${event.target.id}`).hidden = true;
    document.getElementById(`nolike-${event.target.id}`).hidden = false;
    document.getElementById(`likeBtn-${event.target.id}`).textContent = "Like";
    axios
      .post(`/drinks/${event.target.id}/dislike`, { withCredentials: true })
      .then((response) => {
        document.getElementById(`likeCounter-${event.target.id}`).textContent =
          response.data;
      })
      .catch(console.log);
  }
}
