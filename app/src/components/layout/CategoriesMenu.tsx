"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { getCategoryIcon } from "@/lib/category-icons";
import styles from "./CategoriesMenu.module.css";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CategoriesMenuProps = {
  categories: Category[];
};

export function CategoriesMenu({ categories }: CategoriesMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Menu size={16} strokeWidth={2.25} aria-hidden />
        Categorias
      </button>

      {open ? (
        <div className={styles.panel} role="menu">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            return (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className={styles.item}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <Icon size={18} strokeWidth={1.75} aria-hidden />
                {category.name}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
