function capuccino(event){
   event.preventDefault();
    let input = document.getElementById('drinkName').value.split(' ')[0]
    const value=document.getElementById('adress').href=`/profile/add-drink/#${input}`
    window.location.assign(value)
}
