<a name="readme-top"></a>

[![MIT License][license-shield]][license-url]




<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/NEONdAPP/neon-libraries">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Coingecko API Interface</h3>

  <p align="center">
    Simple library for using Coingecko APIs
    <br />
    <a href="https://www.coingecko.com/api/documentation"><strong>Explore API docs »</strong></a>
    <br />
    <br />
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#functions">Functions</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Simple and easy to use API interface for Coingecko API to get Price and chart for any tokens. The library uses the Free API endpoints with limitations.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

Here the list of any major frameworks/libraries used to build the library.

* [![Javascript][Javascript]][Javascript-url]
* [![Axios][Axios]][Axios-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

In the main project install axios
* npm
  ```sh
  npm install axios
  ```

### Installation

_Once imported follow these simple steps to use the library_

1. Copy the `coingecko-api-interface` in your repos
2. Import where needed the costruct
   ```js
   import coingeckoAPI from '*YOUR DIRECTORY*/coingecko-api-interface/index.js';
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- FUNCTIONS -->
## Functions
_Following all the function integrated_

### Chain List
_Get the name of chains that Coingecko API uses_
1. Function call
   ```js
   let chainList = await coingeckoAPI.get.chainList();
   ```
2. Responce
   ```js
   chainList.code //function status. Error if !=200
   chainList.msg  //function message status
   chainList.data //list [array] of all chains
   ```

### Get token price from address
_Get the token price from any address_
1. Function call
   ```js
   let tkPrice = await coingeckoAPI.get.tokenPrice.fromAddress(
      ChainID,      //chain ID as number
      TokenAddress  //token address as string
   );
   ```
2. Responce
   ```js
   tkPrice.code     //function status. Error if !=200
   tkPrice.msg      //function message status
   tkPrice.price    //token price as number (expressed in usd)
   ```

### Get token price from API ID
_Get the token price from coingecko API ID_
1. Function call
   ```js
   let tkPrice = await coingeckoAPI.get.tokenPrice.fromAPIId(
      IdAPI      //coingecko API id as string
   );
   ```
2. Responce
   ```js
   tkPrice.code     //function status. Error if !=200
   tkPrice.msg      //function message status
   tkPrice.price    //token price as number (expressed in usd)
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Neon Protocol - [@NEONprotocolio](https://twitter.com/NEONprotocolio)- https://neonprotocol.io/

Gloom0x0 - [@gloom0x0](https://twitter.com/gloom0x0)

Hyper0x0 - [@hyper0x0](https://twitter.com/hyper0x0)

Project Link: [https://github.com/NEONdAPP/neon-libraries/coingecko-api-interface](https://github.com/NEONdAPP/neon-libraries/coingecko-api-interface)

<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/NEONdAPP/neon-libraries/data/coingecko-api-interface/LICENSE.txt
[Javascript]: https://img.shields.io/badge/javascript-000000?style=for-the-badge&logo=javascript&logoColor=yellow
[Javascript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript?retiredLocale=it
[Axios]: https://img.shields.io/badge/Axios-000000?style=for-the-badge&logo=axios&logoColor=violet
[Axios-url]: https://axios-http.com/
