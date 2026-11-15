export const CONSTRAINT_MESSAGES: Record<string, string> = {
  customers_phone_key: "Клієнт з таким номером телефону вже існує",
  customers_email_key: "Клієнт з таким email вже існує",
  customers_driver_license_key: "Клієнт з таким посвідченням водія вже існує",
  customers_phone_chk: "Некоректний формат номера телефону",
  customers_email_chk: "Некоректний формат email",
  rentals_customer_id_fkey: "Неможливо видалити клієнта: у нього є оренди",
  car_categories_name_key: "Категорія з такою назвою вже існує",
  car_categories_daily_rate_check: "Тариф має бути більшим за 0",
  cars_category_id_fkey: "Неможливо видалити категорію: до неї належать автомобілі",
  additional_services_name_key: "Послуга з такою назвою вже існує",
  additional_services_daily_price_check: "Ціна має бути більшою за 0",
  rental_services_service_id_fkey: "Неможливо видалити послугу: її використано в орендах",
  employees_phone_key: "Працівник з таким номером телефону вже існує",
  employees_phone_chk: "Некоректний формат номера телефону",
  rentals_employee_id_fkey: "Неможливо видалити працівника: він оформлював оренди",
  employees_position_chk: "Оберіть посаду зі списку",
  cars_plate_number_key: "Автомобіль з таким номерним знаком вже існує",
  cars_plate_chk: "Некоректний формат номерного знака",
  cars_year_check: "Некоректний рік випуску",
  rentals_car_id_fkey: "Неможливо видалити автомобіль: за ним є оренди",
  maintenance_car_id_fkey: "Неможливо видалити автомобіль: за ним є записи про обслуговування",
  maintenance_no_overlap: "Для цього автомобіля вже є обслуговування, що перетинається за датами",
  maintenance_dates_chk: "Дата завершення не може бути раніше дати початку",
  maintenance_description_chk: "Вкажіть опис обслуговування",
  rentals_no_overlap: "Автомобіль уже зайнятий у цей період",
  rentals_dates_chk: "Дата завершення не може бути раніше дати початку",
  rentals_one_active_per_car: "Автомобіль ще не повернуто за попередньою орендою",
  payments_amount_check: "Сума оплати має бути більшою за 0",
  payments_method_check: "Оберіть спосіб оплати"
};

export const PG_ERROR_MESSAGES: Record<string, string> = {
  "23505": "Запис з такими даними вже існує",
  "23503": "Операція неможлива: є пов'язані записи",
  "23514": "Дані порушують обмеження бази даних",
  "23P01": "Період перетинається з існуючим записом"
};
