# What is this?

This is a small clean architecture project with 3 layers, and this is just the second layer of the three; this is the **application layer**.

[Repository for the first layer, domain](https://github.com/ProfeJulianLasso/todo-backend-domain)

The exercise involves a simple ToDo with a username and password. The names I use may sometimes seem to be extracted from Domain-Driven Design (DDD).

![Clean Architecture](./assets/clean_architecture.jpg)

## Thoughts

This package by itself doesn't work, as it is a collection of behaviors, that is, the use cases, which the future infrastructure layer should execute to make the solution work.

## The Repository

I will try my best to follow the "[Conventional Commits](https://www.conventionalcommits.org/)" philosophy for commits and also apply "[Release Flow](http://releaseflow.org/)."

## How to make it work?

I started working with NPM, but now I am using PNPM for speed and storage space savings. So the steps would be as follows to test it more than make it work since this package by itself should not function.

**NOTE**: If you don't know what PNPM is, I invite you to give it a try by clicking [here](https://pnpm.io/).

### Step 1: Clone the repository

```bash
git clone https://github.com/ProfeJulianLasso/todo-backend-application
```

### Step 2: Install dependencies

```bash
pnpm install
```

### Optional Step: Run tests

```bash
pnpm test
```

Or, if you want to see the coverage, it would be as follows:

```bash
pnpm test:cov
```

### Step 3: Build the package

```bash
pnpm build
```

### Step 4: Create the symbolic link to include the package in the application layer

```bash
pnpm link domain --global
```

**NOTE**: Remember that `domain` is the name of the project in the domain layer. If you want to give a different name to the domain layer so it's not as generic, you can modify the project name in the `package.json` file of the domain layer. However, don't forget that you need to recreate the global link and link it again with the new name in the application layer.
