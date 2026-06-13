"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-reveal], [data-word-reveal], [data-spread]"
      )
    );

    if (!items.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              entry.target.hasAttribute("data-spread") ? "is-spread" : "is-visible"
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return null;
}
