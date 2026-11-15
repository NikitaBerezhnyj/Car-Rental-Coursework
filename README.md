# Car Rental Management System

Car Rental Management System is a web application developed as a coursework project. It is designed to simplify the management of a car rental business by providing tools for handling vehicles, customers, employees, rentals, payments, and related operations.

The system allows users to:

- Manage cars and their categories.
- Manage customer and employee records.
- Create and manage car rentals.
- Track rental statuses and payment balances.
- Manage additional services and rental extras.
- Record vehicle maintenance.
- View dashboard statistics and business reports.

## Technologies

- [Next.js](https://nextjs.org/) — React framework used to build the web application.
- [React](https://react.dev/) — library for building the user interface.
- [TypeScript](https://www.typescriptlang.org/) — typed programming language.
- [PostgreSQL](https://www.postgresql.org/) — relational database.
- [Docker](https://www.docker.com/) — containerization and application environment management.
- [Docker Compose](https://docs.docker.com/compose/) — orchestration of application services.
- [pgAdmin](https://www.pgadmin.org/) — PostgreSQL database management tool.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/gettingstarted/)

### Environment Configuration

Create the environment files required by Docker Compose:

- `.env.dev` — development environment.
- `.env.prod` — production environment.

Set up the required environment variables using `.env.example` as a template before starting the application.

### Development

Start the development environment:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml up --build
```

### Production

Start the production environment:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yaml up --build
```

## Application Links

When the corresponding services are running, they are available at:

- Web application: [http://localhost:3000](http://localhost:3000)
- PostgreSQL: [localhost:5432](localhost:5432)
- pgAdmin: [http://localhost:5050](http://localhost:5050)

## Database

The PostgreSQL database is initialized using SQL scripts located in `db/init/`:

- `01_schema.sql` — database schema and table definitions.
- `02_seed.sql` — initial data for the application.
