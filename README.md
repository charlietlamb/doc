# doc demo

## tech stack

I'm using Hono as a TypeScript API framework, drizzle as an ORM (hosted on Neon) & postgres. For the frontend I'm using nextjs & react - I'm serving the api from /api for conviencience. I'm using turborepo to encapsulte the logic of commonly used internal packages e.g. database.

## replication

To run this yourself create a .env file in the root dir with the following:

```
DATABASE_URL=${db_url}
LOG_LEVEL=debug
NODE_ENV=development

NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

Then run with the package manager of your choosing - I prefer bun. `bun sync` runs a script I wrote to copy the root env to other dirs.

```
bun install && bun sync
```

Then run the development server with

```
turbo dev
```

To build the project run

```
turbo build
```

## Checkpoints

### Functionality

The api works well with open api documentation available at /api/reference - to build this up further we could add some unit tests with vitetest + clean the code up further.

### Code Quality

The code quality may have suffered due this application being a lot larger than a simple api. I wanted to use production grade tech & that's when I went for turborepo & a packages architecture I could easily use if I needed to create another app or an external api.

### Git commit history

I'm commited frequently but in all honesty my commit messages were slightly generic - when working in a team or on larger projects I take much more care with my commits. I'm a big fan of `git add -p` - when working on this purely for speed I was using my `gp $message` alias which runs

`git add . && git commit -m $message && git push`

In hinesight I should have taken more care with my commits although if I did want to go back to a certain point in the history I can easily see what I was working on.

### Dockerization

Haven't had time for this yet...

### Database design

Database design is pretty clean - some standard relational postgres schema. After going through and implementing everything I realised i neglected the bookings table and just toggle the status on the slots. This means there is not a reason for a booking saved on the app - I don't think this is the end of the world - wouldn't be difficult to implement just time consuming after I've already done the whole implementation so hope that's understandable.

### Frontend

Went a bit overkill here and should've spent more time on optimising the backend.

## Final comments

In all honesty I should have spent more time optimising the backend rather than making it a fully functional full stack app however I hope this shows off my ability as a confident full stack developer. All this code was written in a 24 hour time span over the weekend with a lot of that time not doing coding - bear this in mind when taking a look at it - I haven't had time to go through every file and optimize everything.
