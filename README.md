# Cinema API

This Project was built as a simple backend task that would allow me to earn the opertuninty of doing a co-op training with a company, the main objective of this task was to assess how much I can finish and learn given time constraint.
Task Requiremnts:
The API should feature the following endpoint functionality:

## Public

Public users can browse all movies and perform
* Searching by movie name.
* Filteration by release date.
* Sorting by any field (name, release date or the creation date).
* Pagination.

Public user can create new account and become authenticated user, login and logout.

## Private

Private APIs are protected using JWT using cookies.
If the JWT is missing or invalid, these APIs should deny the request.
 
 The private APIs are accessible by admins and moderators:
 
 * Admins has all the access to perform CRUD operations on Movies, upload images and make moderators by changing user role.
 
 * Moderators can perform CRUD operations on Movies and upload images.


## API documentation:

All API End points and documentation can be found at: Postman documntation.

### The following is just a simple list of the api end points:
### 1- authentication routes


> get /auth/logout

> post /auth/login

> post /auth/register

### 2-user routes

>   get /users/
 
>   get /users/moderators
  
>   patch /users/role
  
>   get /users/:id

### 3-movies routes

>  get /movies/
 
>  post /movies/
   
   
>  post  /movies/uploadImage
  
  
>  get /movies/:id
  
  
>  patch /movies/:id
    
    
>  delete /movies/:id
    
  
## Install the dependencies and start the server to test the Api.
```
npm init
npm start
```

## Todos

    Add more features
    Implement a front-page for the server
    Add unit testing
