This is a REACT project


First, run the development server:

```bash
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
## Configuration
### ENV Production
file named .env
```
VITE_APP_HOST_API_KEY = (URL odoo production)https://project-production.odoo.com
VITE_APP_DB_NAME =(DB odoo production) db_name
```
### ENV Staging
file named .env.staging
```
VITE_APP_HOST_API_KEY = (URL odoo staging)https://project-staging.dev.odoo.com
VITE_APP_DB_NAME =(DB odoo staging) db_name
```
### ENV Development
file named .env.development
```
VITE_APP_HOST_API_KEY = (URL odoo)http://localhost:8069
VITE_APP_DB_NAME =(DB odoo) db_name
```
## Netlify Configuration
### Staging
edit file redirect.staging
```
/web/*  https://project-staging.dev.odoo.com/web/:splat  200!
/*    /index.html   200
```
### Production
edit file redirect.production
```
/web/*  https://project-production.dev.odoo.com/web/:splat  200!
/*    /index.html   200
```
## Routes Documentation
The script build-routes.mjs is used to generate the routes.tsx file with the next rules:
- the script walk through the pages folder src/pages and get all the files with the extension .tsx for generate the routes
- if the file has  name index.tsx the route will be the name of the folder where the file is located
- if the file has  name different to index.tsx the route will be the name of the file with the folder where the file is located
- it the file has name [_slug].tsx the route will be the name folder/:slug example 
  - [id].tsx -> customer/:id
  - [category_name].tsx -> /:category_name
- if the file has the name _layout.tsx the route will be the name of the folder where the file is located. This file is used to define the layout of the page and children pages
## Debug With WebStorm Configuration
### Configuration
- Go to Run -> Edit Configurations
- Click on the + button and select JavaScript Debug
- Name: Debug
- URL: http://localhost:3000
- Browser: Chrome
### Usage
- Go to Run -> Debug
- Click on the green button with the name Debug or press F9
