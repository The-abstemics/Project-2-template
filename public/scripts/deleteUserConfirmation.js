
function deleteUserConfirmation() {
    const confirmation = confirm("Deleting your profile won't make you sober. Are you sure you want to continue?");
    console.log(confirmation)
    if(confirmation) {
        window.open("/profile/delete-profile", "_self");
    }
};