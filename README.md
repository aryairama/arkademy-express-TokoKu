<br />
<p align="center">
<div align="center">
  <img height="150" src="https://drive.google.com/uc?export=view&id=1_qgXTPQC_IuvHMWXam6ezA0qWEYEdx0C"/>
</div>
  <h3 align="center">TokoKu : Backend E-Commerce</h3>
  <p align="center">
    <a href="https://github.com/aryairama/arkademy-express-TokoKu"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://bit.ly/_tokoku">View Demo</a>
    ·
    <a href="https://github.com/aryairama/arkademy-express-TokoKu/issues">Report Bug</a>
    ·
    <a href="https://github.com/aryairama/arkademy-express-TokoKu/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Setup .env example](#setup-env-example)
- [Rest Api](#rest-api)
- [Contributing](#contributing)
- [Related Project](#related-project)
- [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project

This api is for my Tokoku e-commerce application, one of which is for handling product sales, product purchases, user registration, and others.

### Built With

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Nodemailer]('https://nodemailer.com/about/')
- and other

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* [nodejs](https://nodejs.org/en/download/)

### Requirements
* [Node.js](https://nodejs.org/en/)
* [Postman](https://www.getpostman.com/) for testing
* [Database](database-example.sql)

### Installation

- Clone This Back End Repo
```
git clone https://github.com/aryairama/arkademy-express-TokoKu.git
```
- Go To Folder Repo
```
cd arkademy-express-TokoKu
```
- Install Module
```
npm install
```
- Development mode
```
npm run serve
```
- Deploy mode
```
npm start
```

### Setup .env example

Create .env file in your root project folder.

```env

# Database
DB_HOST = [DB_HOST]
DB_USER = = [DB_USER]
DB_NAME = [DB_NAME]
DB_PASSWORD = [DB_PASSWORD]
DB_PORT = [DB_PORT]
# Aplication
PORT = [PORT_APLICATION]
# Secret key for jwt token
ACCESS_TOKEN_SECRET = [SECRET_KEY_JWT]
REFRESH_TOKEN_SECRET = [SECRET_KEY_JWT]
VERIF_EMAIL_TOKEN_SECRET = [SECRET_KEY_JWT]
# Redis
HOST_REDIS = [REDIS_HOST]
PORT_REDIS = [REDIS_PORT]
AUTH_REDIS = [REDIS_AUTH]
PATH_REDIS = [REDIS_UNIX_SOCKET]
# IP/SOCKET
# Sendmailer SMTP
NODEMAILER_HOST = [SMTP_HOST]
NODEMAILER_PORT = [SMTP_PORT]
NODEMAILER_SECURE = [OPTION_SECURE_SMTP]
NODEMAILER_AUTH_USER = [USER_SMTP]
NODEMAILER_AUTH_PASS = [PASSWORD_SMTP]
# FrontEnd
URL_FRONTEND = [URL_FRONT_END]

```

## Rest Api

You can view my Postman collection [here](https://www.postman.com/crimson-meadow-842892/workspace/TokoKu~7ee35b02-962d-4e0b-8e43-cecbf6d38092/collection/10655215-fd4f1f4d-8b62-419a-807a-cfc45f282ac0)
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/10655215-fd4f1f4d-8b62-419a-807a-cfc45f282ac0?action=collection%2Ffork&collection-url=entityId%3D10655215-fd4f1f4d-8b62-419a-807a-cfc45f282ac0%26entityType%3Dcollection%26workspaceId%3D7ee35b02-962d-4e0b-8e43-cecbf6d38092)

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## Related Project
:rocket: [`Backend TokoKU`](https://github.com/aryairama/arkademy-express-TokoKu)

:rocket: [`Frontend TokoKU`](https://github.com/aryairama/arkademy-react-TokoKu)

:rocket: [`Demo TokoKu`](https://bit.ly/_tokoku)

<!-- CONTACT -->
## Contact

My Email : aryairama987@gmail.com

Project Link: [https://github.com/aryairama/arkademy-express-TokoKu](https://github.com/aryairama/arkademy-express-TokoKu)





