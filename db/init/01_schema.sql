CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE car_categories (
    category_id  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         VARCHAR(50)   NOT NULL UNIQUE,
    daily_rate   NUMERIC(10,2) NOT NULL CHECK (daily_rate > 0)
);

CREATE TABLE customers (
    customer_id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name      VARCHAR(50)  NOT NULL,
    last_name       VARCHAR(50)  NOT NULL,
    phone           VARCHAR(20)  NOT NULL UNIQUE,
    email           VARCHAR(100) UNIQUE,
    driver_license  VARCHAR(20)  NOT NULL UNIQUE,
    created_at      TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE employees (
    employee_id  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name   VARCHAR(50) NOT NULL,
    last_name    VARCHAR(50) NOT NULL,
    position     VARCHAR(50) NOT NULL,
    phone        VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE cars (
    car_id        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id   INTEGER      NOT NULL REFERENCES car_categories(category_id),
    brand         VARCHAR(50)  NOT NULL,
    model         VARCHAR(50)  NOT NULL,
    plate_number  VARCHAR(15)  NOT NULL UNIQUE,
    year          SMALLINT     NOT NULL CHECK (year BETWEEN 1990 AND 2100),
    status        VARCHAR(15)  NOT NULL DEFAULT 'available'
                  CHECK (status IN ('available', 'maintenance', 'retired'))
);

CREATE TABLE rentals (
    rental_id    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id  INTEGER       NOT NULL REFERENCES customers(customer_id),
    car_id       INTEGER       NOT NULL REFERENCES cars(car_id),
    employee_id  INTEGER       NOT NULL REFERENCES employees(employee_id),
    start_date   DATE          NOT NULL,
    end_date     DATE          NOT NULL,
    daily_rate   NUMERIC(10,2) NOT NULL CHECK (daily_rate > 0),
    status       VARCHAR(15)   NOT NULL DEFAULT 'booked'
                 CHECK (status IN ('booked', 'active', 'completed', 'cancelled')),
    
    CONSTRAINT rentals_dates_chk CHECK (end_date >= start_date),
    
    CONSTRAINT rentals_no_overlap EXCLUDE USING gist (
        car_id WITH =,
        daterange(start_date, end_date, '[]') WITH &&
    ) WHERE (status <> 'cancelled')
);

CREATE TABLE payments (
    payment_id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rental_id    INTEGER       NOT NULL REFERENCES rentals(rental_id),
    amount       NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    method       VARCHAR(10)   NOT NULL CHECK (method IN ('cash', 'card')),
    paid_at      TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE maintenance (
    maintenance_id  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    car_id          INTEGER       NOT NULL REFERENCES cars(car_id),
    start_date      DATE          NOT NULL,
    end_date        DATE,
    description     VARCHAR(200)  NOT NULL,
    cost            NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (cost >= 0),

    CONSTRAINT maintenance_dates_chk CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE additional_services (
    service_id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         VARCHAR(50)   NOT NULL UNIQUE,
    daily_price  NUMERIC(10,2) NOT NULL CHECK (daily_price >= 0)
);

CREATE TABLE rental_services (
    rental_id   INTEGER NOT NULL REFERENCES rentals(rental_id) ON DELETE CASCADE,
    service_id  INTEGER NOT NULL REFERENCES additional_services(service_id),
    price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    PRIMARY KEY (rental_id, service_id)
);