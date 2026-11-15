CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE car_categories (
    category_id  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         VARCHAR(50)   NOT NULL UNIQUE,
    daily_rate   NUMERIC(10,2) NOT NULL CHECK (daily_rate > 0),

    CONSTRAINT car_categories_name_chk CHECK (btrim(name) <> '')
);

CREATE TABLE customers (
    customer_id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name      VARCHAR(50)  NOT NULL,
    last_name       VARCHAR(50)  NOT NULL,
    phone           VARCHAR(20)  NOT NULL UNIQUE,
    email           VARCHAR(100) UNIQUE,
    driver_license  VARCHAR(20)  NOT NULL UNIQUE,
    created_at      TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT customers_names_chk   CHECK (btrim(first_name) <> '' AND btrim(last_name) <> ''),
    CONSTRAINT customers_phone_chk   CHECK (phone ~ '^\+?[0-9]{10,15}$'),
    CONSTRAINT customers_email_chk   CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    CONSTRAINT customers_license_chk CHECK (btrim(driver_license) <> '')
);

CREATE TABLE employees (
    employee_id  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name   VARCHAR(50) NOT NULL,
    last_name    VARCHAR(50) NOT NULL,
    position     VARCHAR(50) NOT NULL,
    phone        VARCHAR(20) NOT NULL UNIQUE,

    CONSTRAINT employees_names_chk    CHECK (btrim(first_name) <> '' AND btrim(last_name) <> ''),
    CONSTRAINT employees_position_chk CHECK (position IN ('Менеджер', 'Адміністратор', 'Механік', 'Директор')),
    CONSTRAINT employees_phone_chk    CHECK (phone ~ '^\+?[0-9]{10,15}$')
);

CREATE TABLE cars (
    car_id        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id   INTEGER      NOT NULL REFERENCES car_categories(category_id),
    brand         VARCHAR(50)  NOT NULL,
    model         VARCHAR(50)  NOT NULL,
    plate_number  VARCHAR(15)  NOT NULL UNIQUE,
    year          SMALLINT     NOT NULL CHECK (year BETWEEN 1990 AND 2100),
    status        VARCHAR(15)  NOT NULL DEFAULT 'available'
                  CHECK (status IN ('available', 'retired')),

    CONSTRAINT cars_brand_model_chk CHECK (btrim(brand) <> '' AND btrim(model) <> ''),
    CONSTRAINT cars_plate_chk       CHECK (plate_number ~ '^[A-Z0-9]{4,10}$')
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

    CONSTRAINT maintenance_dates_chk       CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT maintenance_description_chk CHECK (btrim(description) <> ''),
    CONSTRAINT maintenance_no_overlap EXCLUDE USING gist (
        car_id WITH =,
        daterange(start_date, COALESCE(end_date, 'infinity'), '[]') WITH &&
    )
);

CREATE TABLE additional_services (
    service_id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         VARCHAR(50)   NOT NULL UNIQUE,
    daily_price  NUMERIC(10,2) NOT NULL CHECK (daily_price > 0),

    CONSTRAINT additional_services_name_chk CHECK (btrim(name) <> '')
);

CREATE TABLE rental_services (
    rental_id   INTEGER NOT NULL REFERENCES rentals(rental_id) ON DELETE CASCADE,
    service_id  INTEGER NOT NULL REFERENCES additional_services(service_id),
    price       NUMERIC(10,2) NOT NULL CHECK (price > 0),
    PRIMARY KEY (rental_id, service_id)
);

CREATE VIEW car_details AS
SELECT c.car_id,
       c.brand,
       c.model,
       c.plate_number,
       c.year,
       c.category_id,
       cat.name       AS category_name,
       cat.daily_rate AS daily_rate,
       CASE
           WHEN c.status = 'retired' THEN 'retired'
           WHEN EXISTS (
               SELECT 1 FROM maintenance m
               WHERE m.car_id = c.car_id
                 AND m.start_date <= CURRENT_DATE
                 AND (m.end_date IS NULL OR m.end_date >= CURRENT_DATE)
           ) THEN 'maintenance'
           WHEN EXISTS (
               SELECT 1 FROM rentals r
               WHERE r.car_id = c.car_id AND r.status = 'active'
           ) THEN 'rented'
           ELSE 'available'
       END AS status
FROM cars c
JOIN car_categories cat USING (category_id);

CREATE VIEW rental_summary AS
SELECT t.rental_id,
       t.days,
       t.rental_cost,
       t.extras_cost,
       t.paid_amount,
       t.rental_cost + t.extras_cost AS total_cost,
       CASE
           WHEN t.status = 'cancelled' THEN 0
           ELSE t.rental_cost + t.extras_cost - t.paid_amount
       END AS balance
FROM (
    SELECT r.rental_id,
           r.status,
           (r.end_date - r.start_date + 1)                               AS days,
           (r.end_date - r.start_date + 1) * r.daily_rate                AS rental_cost,
           (r.end_date - r.start_date + 1) * COALESCE(ex.daily_total, 0) AS extras_cost,
           COALESCE(pay.paid, 0)                                         AS paid_amount
    FROM rentals r
    LEFT JOIN (
        SELECT rental_id, SUM(price) AS daily_total
        FROM rental_services
        GROUP BY rental_id
    ) ex ON ex.rental_id = r.rental_id
    LEFT JOIN (
        SELECT rental_id, SUM(amount) AS paid
        FROM payments
        GROUP BY rental_id
    ) pay ON pay.rental_id = r.rental_id
) t;

CREATE FUNCTION check_car_retirement() RETURNS trigger AS $$
BEGIN
    IF NEW.status = 'retired' AND EXISTS (
        SELECT 1 FROM rentals r
        WHERE r.car_id = NEW.car_id AND r.status IN ('booked', 'active')
    ) THEN
        RAISE EXCEPTION 'Неможливо списати автомобіль: є активні або заброньовані оренди';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cars_retirement_trg
BEFORE UPDATE OF status ON cars
FOR EACH ROW EXECUTE FUNCTION check_car_retirement();

CREATE FUNCTION check_maintenance_vs_rentals() RETURNS trigger AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM rentals r
        WHERE r.car_id = NEW.car_id
          AND r.status IN ('booked', 'active')
          AND daterange(r.start_date, r.end_date, '[]')
              && daterange(NEW.start_date, COALESCE(NEW.end_date, 'infinity'), '[]')
    ) THEN
        RAISE EXCEPTION 'Неможливо поставити автомобіль на обслуговування: у цей період є активні або заброньовані оренди';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maintenance_vs_rentals_trg
BEFORE INSERT OR UPDATE ON maintenance
FOR EACH ROW EXECUTE FUNCTION check_maintenance_vs_rentals();

CREATE FUNCTION check_rental_car() RETURNS trigger AS $$
BEGIN
    IF NEW.status IN ('booked', 'active') THEN
        IF EXISTS (SELECT 1 FROM cars c WHERE c.car_id = NEW.car_id AND c.status = 'retired') THEN
            RAISE EXCEPTION 'Автомобіль списано, його не можна орендувати';
        END IF;

        IF EXISTS (
            SELECT 1 FROM maintenance m
            WHERE m.car_id = NEW.car_id
              AND daterange(m.start_date, COALESCE(m.end_date, 'infinity'), '[]')
                  && daterange(NEW.start_date, NEW.end_date, '[]')
        ) THEN
            RAISE EXCEPTION 'У цей період автомобіль на обслуговуванні';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rentals_car_available_trg
BEFORE INSERT OR UPDATE ON rentals
FOR EACH ROW EXECUTE FUNCTION check_rental_car();

CREATE UNIQUE INDEX rentals_one_active_per_car ON rentals (car_id) WHERE status = 'active';

CREATE FUNCTION check_rental_status_change() RETURNS trigger AS $$
BEGIN
    IF NEW.status = OLD.status THEN
        RETURN NEW;
    END IF;

    IF NOT (
        (OLD.status = 'booked' AND NEW.status IN ('active', 'cancelled')) OR
        (OLD.status = 'active' AND NEW.status = 'completed')
    ) THEN
        RAISE EXCEPTION 'Недопустима зміна статусу оренди';
    END IF;

    IF NEW.status = 'active' AND CURRENT_DATE NOT BETWEEN NEW.start_date AND NEW.end_date THEN
        RAISE EXCEPTION 'Автомобіль можна видати лише в період оренди: від дати початку до дати завершення';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rentals_status_change_trg
BEFORE UPDATE OF status ON rentals
FOR EACH ROW EXECUTE FUNCTION check_rental_status_change();

CREATE FUNCTION check_payment() RETURNS trigger AS $$
DECLARE
    rental_status  VARCHAR(15);
    rental_balance NUMERIC(10,2);
BEGIN
    -- Блокуємо оренду, щоб дві одночасні оплати разом не перевищили залишок
    PERFORM 1 FROM rentals WHERE rental_id = NEW.rental_id FOR UPDATE;

    SELECT r.status, s.balance
    INTO rental_status, rental_balance
    FROM rentals r
    JOIN rental_summary s USING (rental_id)
    WHERE r.rental_id = NEW.rental_id;

    IF rental_status = 'cancelled' THEN
        RAISE EXCEPTION 'Неможливо зареєструвати оплату для скасованої оренди';
    END IF;

    IF NEW.amount > rental_balance THEN
        RAISE EXCEPTION 'Сума оплати перевищує залишок до сплати: % грн', rental_balance;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payments_check_trg
BEFORE INSERT ON payments
FOR EACH ROW EXECUTE FUNCTION check_payment();