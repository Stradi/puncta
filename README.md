# The Puncta

Rating platform for students to rate their academic staff. Users can login and rate their teachers. Users specify their university and department. The system only allows users to rate their own teachers.
## Monorepo Structure

**Client**: This is the frontend application. It uses TypeScript, React, Next.js, Tailwind CSS, Apollo Client, Formik.

**Server**: The API that handles everything about database. Handles authentication too. It uses TypeScript and Nest.js with GraphQL API.

**Scraper**: This project scrapes all the universities and academic staff from [YÖK](yokatlas.yok.gov.tr) (which only contains data from Turkey). You only need to run this project once in before initial deployment to seed the database.
## Installation

Clone the `git` repository and `cd` into it.

```bash
git clone https://github.com/Stradi/puncta
cd ./puncta
```

Install dependencies. This command will install both frontend and backend dependencies in root `node_modules` folder.

```bash
npm i
```

Fill the `.env` files. Project needs two `.env` files. One is at `/apps/web`, other is at `/apps/api` folder. Just copy the `.env.example` files in respective directories and fill the blanks.

To start in development mode, just run `npm run dev` in root folder. This command will start `api` (GraphQL backend based on Nest.js) and `web` (frontend based on Next.js) projects.
## Environment Variables

For the `apps/web/.env` file:

- `NEXT_PUBLIC_API_URL`: This is the URL of the API.

For the `apps/api/.env` file:

- `DATABASE_URL`: URL of the MySQL database. The format should be like this: `mysql://USER:PASSWORD@HOST:PORT/DATABASE`.
- `JWT_SECRET`: This is used when generating JWT _access tokens_. Don't put something dummy if you're planning to deploy this application.
- `JWT_REFRESH_SECRET`: Same as `JWT_SECRET` but this is used when generating JWT _refresh tokens_.
- `ADMIN_EMAIL`: Email address of admin user. This user can create/read/update/delete all the resources in backend. You can use this while authenticating with the API.
- `ADMIN_PASSWORD`: Again, this will be used while authenticating with the API.

For the `tools/university-scraper/.env` file:

- `DATABASE_URL`: URL of the MySQL database. This is the same as `apps/api/.env`'s `DATABASE_URL`.
- `CONCURRENT_REQUESTS`: Limits the concurrent requests to YÖK's website.
## License

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/) (Basically you can do whatever you want with this but you can't publish closed-source version of this project.)
