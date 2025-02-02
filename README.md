# doc demo

## replication

To run this yourself create an env file with the following:

```
DATABASE_URL=${db_url}
LOG_LEVEL=debug
NODE_ENV=development

NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

Then run with the package manager of your choosing - I prefer bun.

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

The api works well with open api documentation available at /api/reference

### Code Quality

I created this full stack

###
