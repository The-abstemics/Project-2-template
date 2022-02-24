function capuccino(event){
   event.preventDefault();
    let input = document.getElementById('drinkName').value
    const value=document.getElementById('adress').href=`/profile/add-drink/#${input}`
    window.location.assign(value)
}
