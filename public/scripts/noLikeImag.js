

function addlike(event){
    event.preventDefault();
    console.log("Somethis addlike", event.target.id)
    axios.post(`/drinks/${event.target.id}/like`)
   .then((response) => {console.log(response)
   document.getElementById(`like-${event.target.id}`).hidden = false
   document.getElementById(`nolike-${event.target.id}`).hidden = true}
   
   )}

   function dislike(event){
    event.preventDefault();
    console.log("Somethis addlike", event.target.id)
    axios.post(`/drinks/${event.target.id}/dislike`)
   .then((response) => {console.log(response)
   document.getElementById(`like-${event.target.id}`).hidden = true
   document.getElementById(`nolike-${event.target.id}`).hidden = false}
   
   )}