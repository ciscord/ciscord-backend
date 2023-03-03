# Backend
Node Version: 14.16.0
========= Currently migrating from prisma2 to prisma v4 ========
## 1. install packages
### 1) install global packages
install prisma2 (tested: 2.0.0-preview024)
```
npm install -g prisma2
```

install prisma-multi-tenant (tested: prisma-multi-tenant v2.0.0-alpha23)
```
npm i -g prisma-multi-tenant@alpha
```

### 2) install packages
install npm packages

```
cd backend
npm install
```

init setup & config prisma multi tenant
```
npx prisma-multi-tenant init
```

set the management database url to:

development:
> postgresql://admin@localhost:5432/ciscord?schema=management

( ----- ***NOTE*** -----:
1. Please check prisma-multi-tenant is installed correctly.
Run this command to check it
```
npx prisma-multi-tenant list
```
You will see below response(if you can't see below response, prisma-multi-tenant is not installed correctly)
>Fetching available tenants...
  List of available tenants
```
┌────────┬────────────┬───────────┐
│ Name   │ Provider   │ URL       │
├────────┼────────────┼───────────┤
│ dev    │ postgresql │ postgre.. │
└────────┴────────────┴───────────┘
```


2. delete this default tenant in the database. **important**
```
prisma-multi-tenant delete tenant
```
)


After it run this command
```
npm install
prisma-multi-tenant migrate up
npm run dev
```

## 2. Create the tenant

### 1) Create the tenant using postman
>POST:http://localhost:4000/register
Content-Type: application/json
Body:
{
  "tenantName": "first",
  "username": "username1",
  "fullname": "Denis P",
  "description": "This is my company description",
  "email": "username1@gmail.com"
}

you may got error when you create first tenant.
close(Ctrl + C) and run npm run dev again
And create second tenant.

You will get success response like this via postman:
>{
    "success": true
}

# Error handling
- Error: missing-env
If you get this error when you create the tenant, update .env.development
```
DATABASE_URL="postgresql://admin@localhost:5432/ciscord"
MANAGEMENT_PROVIDER=postgresql
MANAGEMENT_URL=postgresql://admin@localhost:5432/ciscord?schema=management
```

### 2) create tenant using website
>visit http://localhost:3000/register
input the company name
login twitter

# Frontend
```
npm install
npm run dev
```
