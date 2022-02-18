Nameless(yet)

## Description
- Nameless is an app to check your blood alcohol content (BAC).

## User levels
There are 2 types of users. The unregistered user, and the registered one. In addition the registered one can be owner of their added drinks.


## Unregistered Users
- This type of users can just check the drinks DB.

## Registered Users
- Upon register fase, users can login to access their profiles. They can modify their profile (edit, delete). They can also add drinks to the DB and in this case they become the owner of the drink and they have access to modify it (edit, delete). Registered users can also make a drink their favourite one. This will be reflected on their profile as well as on the DB.

## Wireframes

[Excalidraw link](https://excalidraw.com/#json=rmGAtg7W5lFWjOn63pIyx,5jz3hKWhlHvgEqSPTeF8RA)

## Pages


| Route                                         | Description                                         | Persmissions   |
| --------------------------------------------- | --------------------------------------------------- | -------------- |
| GET "/home"                                   | Renders the homepage/login                          | All            |
| **/auth**                                     |                                                     |                |
| GET "/auth/signup"                            | Renders the signup form for drinkers                | All            |
| POST “/auth/signup”                           | Create a user in the DB.                            | All            |
| GET “/auth/login"                             | Signed up users can login into their account        | User           |
| POST “/auth/login”                            | Create a session for an existing users              | User           |
| **/profile **                                 |                                                     |                |
| GET “/profile/:id”                            | Shows the user profile                              | User           |
| POST “/profile/:id/logout”                    | Logout the user                                     | User           |
| POST ”/profile/:id/reset-counter”             | Reset the users stats                               | User           |
| GET “/profile/:id/edit-user”                  | Shows profile editor                                | User           |
| POST “/profile/:id/edit-user“                 | Update the details of the user in a form            | User           |
| POST “/profile/:id/delete-user”               | Delete the user                                     | User           |
| GET “/profile/add-drinks”                     | Render a list of drinks to update the quantity of drinks on your profile            | User           |
| POST “/profile/add-drinks”                    | Add/remove drinks to the users displayed drinks   ] | User           |
| **/drinks **                                  |                                                     |                |
| GET "/drinks"                                 | Renders list of drinks                              | All            |
| GET “/drinks/create-drink’                    | Shows a form to create a new drink to the DB        | User           |
| POST “/drinks/create-drink’                   | Create the drink to the DB                          | User           |
| GET “/drinks/:id/edit-drink”                  | shows a form to edit an existing drink of the DB    | Owner           |
| POST “/profile/:id/delete-user”               | Update the edited drink on the DB                   | Owner           |
| POST “/profile/:id/delete-user”               | Delete the drink from the DB                        | Owner           |

## Models 
```
User : {
	username: {
		type: String,
		required: true, 
		unique: true
		}
	password: {
		type: String,
		required: true
		}
	age: {
		type: Number,
		required: true
		}
	sex: {
		type: String,
		required: true
	        }
	height:  {
		type: Number,
		required: true
		}
	weight:  {
		type: Number,
		required: true
		}
	image: {
		type: [String], 
		default: “url: defaultimage.url”
		}
	alcohol-lvl: {
		       type: Number,
		       }
	consumptions: [{ 
			type: Schema.Types.ObjID, 
			ref: “Drink”
			}]
	}
```

```
Drink: {	
	name: { 
		type: String, 
		required: true 
	},
	description: {
		type: String,
		required: true,
		}
	origin: {
		type: String,
		required: true,
		}
	alcohol-content: {
		type: Number,
		required: true,
		}
	likes: Number
	size: {
		type: Number,
		required: true,
		default: 33
	          }
	}
```
