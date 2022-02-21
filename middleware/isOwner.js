function isOwner() {
    if(req.session.user && drink.owner._id == req.session.user._id){
       /* roomOwner = true;
        res.render("rooms/room-details", {room, roomOwner})
    }
    res.render("rooms/room-details", room)
    */
}
}
