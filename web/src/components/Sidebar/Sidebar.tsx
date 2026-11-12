"use client";

import styles from "./Sidebar.module.css";
import {
  CalendarDays,
  CarFront,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  Sparkles,
  Tags,
  UserCog,
  Users,
  Wrench} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  {
    title: null,
    items: [{ label: "Головна", href: "/", icon: LayoutDashboard }]
  },
  {
    title: "Робота",
    items: [
      { label: "Оренди", href: "/rentals", icon: CalendarDays },
      { label: "Автомобілі", href: "/cars", icon: CarFront },
      { label: "Клієнти", href: "/customers", icon: Users }
    ]
  },
  {
    title: "Фінанси",
    items: [{ label: "Оплати", href: "/payments", icon: CreditCard }]
  },
  {
    title: "Обслуговування",
    items: [
      { label: "Техобслуговування", href: "/maintenance", icon: Wrench },
      { label: "Додаткові послуги", href: "/extras", icon: Sparkles }
    ]
  },
  {
    title: "Налаштування",
    items: [
      { label: "Категорії", href: "/settings/categories", icon: Tags },
      { label: "Працівники", href: "/settings/employees", icon: UserCog }
    ]
  }
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.header}>
        {!collapsed && <span className={styles.logo}>RENTAL SYSTEM</span>}

        <button
          className={styles.toggle}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Розгорнути меню" : "Згорнути меню"}
          title={collapsed ? "Розгорнути меню" : "Згорнути меню"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className={styles.navigation}>
        {navigation.map((section, index) => (
          <div className={styles.section} key={index}>
            {section.title && !collapsed && (
              <div className={styles.sectionTitle}>{section.title}</div>
            )}

            {section.items.map(item => {
              const Icon = item.icon;

              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${active ? styles.active : ""}`}
                  title={collapsed ? item.label : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={19} strokeWidth={1.8} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
