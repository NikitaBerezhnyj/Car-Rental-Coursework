import styles from "./NewRental.module.css";
import Link from "next/link";

const additionalServices = [
  {
    id: "child-seat",
    name: "Дитяче крісло",
    price: 100
  },
  {
    id: "gps",
    name: "GPS-навігатор",
    price: 50
  }
];

export function NewRental() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Створення оренди</h1>
          <p className={styles.subtitle}>
            Заповніть інформацію для оформлення нової оренди автомобіля.
          </p>
        </div>
      </header>

      <form className={styles.form}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Клієнт</h2>

          <div className={styles.field}>
            <label htmlFor="customer" className={styles.label}>
              Клієнт
            </label>

            <select id="customer" name="customer" className={styles.input} defaultValue="">
              <option value="" disabled>
                Оберіть клієнта
              </option>
              <option value="1">Іваненко Іван</option>
              <option value="2">Петренко Олена</option>
            </select>
          </div>

          <Link href="/customers" className={styles.textLink}>
            + Додати нового клієнта
          </Link>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Період оренди</h2>

          <div className={styles.fieldsGrid}>
            <div className={styles.field}>
              <label htmlFor="startDate" className={styles.label}>
                Дата початку
              </label>

              <input
                id="startDate"
                name="startDate"
                type="date"
                className={styles.input}
                defaultValue="2026-11-12"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="endDate" className={styles.label}>
                Дата завершення
              </label>

              <input
                id="endDate"
                name="endDate"
                type="date"
                className={styles.input}
                defaultValue="2026-11-15"
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Автомобіль</h2>

          <div className={styles.field}>
            <label htmlFor="car" className={styles.label}>
              Автомобіль
            </label>

            <select id="car" name="car" className={styles.input} defaultValue="">
              <option value="" disabled>
                Оберіть автомобіль
              </option>
              <option value="1">Toyota Corolla — AA 1234 BB</option>
              <option value="2">Volkswagen Passat — KA 5678 CC</option>
            </select>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Додаткові послуги</h2>

          <div className={styles.services}>
            {additionalServices.map(service => (
              <label key={service.id} className={styles.service}>
                <span className={styles.serviceInfo}>
                  <input
                    type="checkbox"
                    name="services"
                    value={service.id}
                    defaultChecked
                    className={styles.checkbox}
                  />
                  <span className={styles.serviceName}>{service.name}</span>
                </span>

                <span className={styles.servicePrice}>{service.price} грн/доба</span>
              </label>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Працівник</h2>

          <div className={styles.field}>
            <label htmlFor="employee" className={styles.label}>
              Відповідальний працівник
            </label>

            <select id="employee" name="employee" className={styles.input} defaultValue="">
              <option value="" disabled>
                Оберіть працівника
              </option>
              <option value="1">Петренко Олена</option>
              <option value="2">Шевченко Андрій</option>
            </select>
          </div>
        </section>

        <section className={styles.summary}>
          <h2 className={styles.sectionTitle}>Розрахунок</h2>

          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Оренда автомобіля</span>
              <span>3 000 грн</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Додаткові послуги</span>
              <span>450 грн</span>
            </div>
          </div>

          <div className={styles.total}>
            <span>Загальна вартість</span>
            <span>3 450 грн</span>
          </div>
        </section>

        <div className={styles.actions}>
          <Link href="/rentals" className={styles.cancelButton}>
            Скасувати
          </Link>

          <button type="button" className={styles.submitButton}>
            Створити оренду
          </button>
        </div>
      </form>
    </main>
  );
}
