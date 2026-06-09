import React, { useEffect, useRef, useState, memo } from "react";
import styles from "./scrollpsy.module.css";

function Scrollspy({ topicos = [], informacoes = {}, links = [] }) {
  const [active, setActive] = useState(topicos[0]?.id);
  const refs = useRef({});

  useEffect(() => {
    const elements = Object.values(refs.current);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);

        if (!visibleSection) return;

        const newId = visibleSection.target.id;

        setActive((prev) => (prev !== newId ? newId : prev));
      },
      {
        threshold: 0.5,
      },
    );

    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        if (el) observer.unobserve(el);
      });

      observer.disconnect();
    };
  }, []);

  const handleClick = (id, e) => {
    e.preventDefault();

    window.history.replaceState(null, "", `#${id}`);

    refs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className={styles.scrollspy_container}>
      <aside className={styles.scrollspy_sidebar}>
        <h2 className={styles.sidebar_title}>Tópicos</h2>

        <ul className={styles.sidebar_list}>
          {topicos.map((item) => (
            <li key={item.id} className={styles.sidebar_item}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(item.id, e)}
                className={`${styles.sidebar_button} ${
                  active === item.id ? styles.sidebar_button_active : ""
                }`}
              >
                <svg
                  className="bullet"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="8" r="4" fill="currentColor" />
                  <circle
                    cx="8"
                    cy="8"
                    r="6.2"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.12"
                    strokeWidth="1.6"
                  />
                </svg>

                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <div className={styles.scrollspy_content}>
        {links.length > 0 && (
          <section id="links" className={styles.section_links}>
            <div className={styles.wrapper_titulo_links}>
              <span className={styles.title_links}>Links Úteis</span>
            </div>

            <ul>
              {links.map((link) => (
                <li key={link}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.section_link}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {topicos.map((item) => {
          const info = informacoes[item.id];
          const fotos = info?.fotos ?? [];

          return (
            <section
              key={item.id}
              id={item.id}
              ref={(el) => {
                refs.current[item.id] = el;
              }}
              className={styles.content_section}
            >
              <h2 className={styles.section_title}>{item.label}</h2>

              <p className={styles.section_text}>
                {info?.descricao ?? "Nenhuma descrição disponível"}
              </p>

              {fotos.length > 0 && (
                <div className={styles.section_gallery}>
                  {fotos.map((img, index) => (
                    <img
                      key={img || index}
                      src={img}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={styles.gallery_image}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default memo(Scrollspy);
