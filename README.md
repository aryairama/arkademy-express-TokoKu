# express-TokoKu
express-TokoKu adalah aplikasi back end yang dibuat dengan framework express js dengan tujuan menghandle proses berjalannya aplikasi ecommerce toko-ku

## Products
Endpoint CRUD untuk Products

### GET -> Read Products
>http://localhost:3000/products?search=T-shirt&order=desc&fieldOrder=quantity&limit=10&page=2

Request Params
Params | value | Rules
--- | --- | ---
search | T-shirt | String
order | desc | String desc/asc
fieldOrder | quantity | String name/price/quantity/product_id
limit | 10 | Number
page | 2 | Number

### POST -> POST Product
>http://localhost:3000/products

Request Body
Body | value | Rules
--- | --- | ---
name | T-shirt Dark Face | String
brand | zalora | String
price | 85000 | Number
colors | white | Enum
size | 42 | Number
quantity | 4 | Number
product_status | new | Enum new/former
description | i dont know about this product | String
category_id | 6 | Number

### PUT -> PUT Product
>http://localhost:3000/products/id

Request Body
Body | value | Rules
--- | --- | ---
name | T-shirt Dark Face | String
brand | zalora | String
price | 85000 | Number
colors | black | Enum
size | 42 | Number
quantity | 4 | Number
product_status | new | Enum new/former
description | i dont know about this product | String
category_id | 6 | Number

### DELETE -> DELETE Product
>http://localhost:3000/products/id

## Categories
Endpoint CRUD untuk Categories

### GET -> Read Category
>http://localhost:3000/categories/?fieldOrder=category_id&limit=5&page=1

Request Params
Params | value | Rules
--- | --- | ---
search | sekolah | String
order | desc | String desc/asc
fieldOrder | quantity | String name/category_id
limit | 10 | Number
page | 2 | Number

### POST -> POST Category
>http://localhost:3000/categories

Request Body
Body | value | Rules
--- | --- | ---
name | T-shirt | String

### PUT -> PUT Category
>http://localhost:3000/categories/id

Request Body
Body | value | Rules
--- | --- | ---
name | T-shirt | String

### DELETE -> DELETE Category
>http://localhost:3000/categories/id

## Users
Endpoint CRUD untuk Users

### POST -> POST User/Register User
>http://localhost:3000/products

Request form-data
form-data | value | Rules
--- | --- | ---
name | marshal gelong | String
email | marshalgelong@gmail.com | Email
password | josgandos | String
phone_number | 1234567891 | Number
gender | male | Enum male/female
date_of_birth | 2021-07-15 | Date
avatar | Img | Img format png/jpg

### POST -> POST Update User
>http://localhost:3000/users/9

Request form-data
form-data | value | Rules
--- | --- | ---
name | marshal gelong | String
email | marshalgelong@gmail.com | Email
new_password | josgandos | String
old_password | 234jos | String
phone_number | 1234567891 | Number
gender | male | Enum male/female
date_of_birth | 2021-07-15 | Date
avatar | Img | Img format png/jpg

### GET -> Read Users
>http://localhost:3000/users/?search=987&order=asc&fieldOrder=user_id&limit=10&page=2

Request Params
Params | value | Rules
--- | --- | ---
search | arya | String
order | desc | String desc/asc
fieldOrder | quantity | String name/date_of_birth/user_id
limit | 10 | Number
page | 2 | Number

### DELETE -> DELETE User
>http://localhost:3000/users/id

## Orders
Endpoint CRUD untuk Orders

### GET -> VIEW Detail Order
>http://localhost:3000/orders/detail/id

### POST -> CREATE Order
>http://localhost:3000/orders

Request Body
Body | value | Rules
--- | --- | ---
user_id | 1 | Number
product_id | [1,2] | Array Number
quantity | [2,2] | Array Number


### PATCH -> UPDATE Order Status
>http://localhost:3000/orders/id

Request Body
Body | value | Rules
--- | --- | ---
status | processed | Enum submit/cancel/processed/sent/completed/paid

### GET -> READ Order
>http://localhost:3000/orders?search=8cb4907c&order=asc&fieldOrder=total_price&page=2&limit=10

Request Params
Params | value | Rules
--- | --- | ---
search | 8cb4907c | String
order | desc | String desc/asc
fieldOrder | quantity | String order_id/total_price
limit | 10 | Number
page | 2 | Number