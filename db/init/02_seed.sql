INSERT INTO car_categories (name, daily_rate) VALUES
    ('Economy', 800),
    ('Comfort', 1200),
    ('SUV',     1800),
    ('Premium', 3000);

INSERT INTO customers (first_name, last_name, phone, email, driver_license) VALUES
    ('Іван',    'Петренко',   '+380501112233', 'ivan.petrenko@example.com', 'AB123456'),
    ('Олена',   'Шевченко',   '+380671234567', 'olena.shevchenko@example.com', 'BC234567'),
    ('Андрій',  'Коваленко',  '+380931112244', NULL,                         'CD345678'),
    ('Марія',   'Бондаренко', '+380631234500', 'maria.bondarenko@example.com', 'DE456789'),
    ('Дмитро',  'Мельник',    '+380509998877', 'dmytro.melnyk@example.com',  'EF567890'),
    ('Софія',   'Ткаченко',   '+380677778899', NULL,                         'FG678901'),
    ('Максим',  'Кравчук',    '+380931234321', 'maksym.kravchuk@example.com', 'GH789012'),
    ('Юлія',    'Олійник',    '+380661234098', 'yulia.oliynyk@example.com',  'HI890123');

INSERT INTO employees (first_name, last_name, position, phone) VALUES
    ('Олена',   'Коваль',   'Менеджер',  '+380671112233'),
    ('Сергій',  'Мороз',    'Менеджер',  '+380501230001'),
    ('Тетяна',  'Лисенко',  'Адміністратор', '+380931230002');

INSERT INTO cars (category_id, brand, model, plate_number, year, status) VALUES
    (1, 'Toyota',      'Corolla',   'AA1234BB', 2021, 'available'),
    (1, 'Skoda',       'Fabia',     'AA2345BC', 2020, 'available'),
    (1, 'Renault',     'Logan',     'AA3456BE', 2019, 'available'),
    (2, 'Volkswagen',  'Passat',    'AA4567BH', 2022, 'available'),
    (2, 'Skoda',       'Octavia',   'AA5678BK', 2021, 'available'),
    (2, 'Hyundai',     'Elantra',   'AA6789BM', 2022, 'available'),
    (3, 'Toyota',      'RAV4',      'AA7890BO', 2023, 'available'),
    (3, 'Kia',         'Sportage',  'AA8901BP', 2022, 'available'),
    (3, 'Nissan',      'Qashqai',   'AA9012BT', 2021, 'available'),
    (4, 'BMW',         '5 Series',  'AA0123BX', 2023, 'available'),
    (4, 'Mercedes',    'E-Class',   'AA1357CA', 2023, 'available'),
    (1, 'Ford',        'Focus',     'AA2468CE', 2015, 'retired');

INSERT INTO additional_services (name, daily_price) VALUES
    ('GPS-навігатор',   150),
    ('Дитяче крісло',   100),
    ('Другий водій',    200);

INSERT INTO rentals (customer_id, car_id, employee_id, start_date, end_date, daily_rate, status) VALUES
    (1,  1, 1, '2026-10-01', '2026-10-05', 800,  'completed'),  
    (2,  4, 2, '2026-10-10', '2026-10-14', 1200, 'completed'),  
    (3,  7, 1, '2026-10-15', '2026-10-22', 1800, 'completed'),  
    (4, 10, 3, '2026-10-20', '2026-10-25', 3000, 'completed'),  
    (1,  2, 2, '2026-11-05', '2026-11-10', 800,  'active'),     
    (5,  5, 1, '2026-11-10', '2026-11-15', 1200, 'active'),     
    (6,  8, 3, '2026-11-11', '2026-11-14', 1800, 'active'),     
    (7,  1, 2, '2026-11-20', '2026-11-25', 800,  'booked'),     
    (8, 11, 1, '2026-12-01', '2026-12-05', 3000, 'booked'),     
    (2,  1, 1, '2026-11-22', '2026-11-24', 800,  'cancelled'),  
    (3,  6, 2, '2026-11-02', '2026-11-06', 1200, 'completed'),  
    (5,  9, 3, '2026-11-08', '2026-11-09', 1800, 'completed');  

INSERT INTO rental_services (rental_id, service_id, price) VALUES
    (1, 1, 150),
    (3, 1, 150),
    (3, 3, 200),
    (6, 2, 100),
    (7, 1, 150),
    (9, 3, 200);

INSERT INTO payments (rental_id, amount, method, paid_at) VALUES
    (1,  4750,  'card', '2026-10-01 10:15'),
    (2,  6000,  'cash', '2026-10-10 12:40'),
    (3,  17200, 'card', '2026-10-15 09:30'),
    (4,  18000, 'card', '2026-10-20 14:05'),
    (5,  2000,  'cash', '2026-11-05 11:20'),
    (6,  3000,  'card', '2026-11-10 16:00'),
    (7,  7200,  'card', '2026-11-11 10:10'),
    (8,  800,   'card', '2026-11-12 09:00'),
    (11, 6000,  'card', '2026-11-02 13:45'),
    (12, 3600,  'cash', '2026-11-08 17:30');

INSERT INTO maintenance (car_id, start_date, end_date, description, cost) VALUES
    (9,  '2026-09-15', '2026-09-17', 'Планове ТО', 3200),
    (12, '2026-10-01', '2026-10-03', 'Ремонт підвіски', 8000),
    (3,  '2026-11-08', NULL,         'Заміна ременя ГРМ', 6500);