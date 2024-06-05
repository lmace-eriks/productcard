import React, { ReactChildren, useRef, useState, useEffect } from "react";
import { Link } from "vtex.render-runtime";

// Styles
import styles from "./styles.css";

interface ProductCardProps {
  productTitle: string
  children: ReactChildren | any
  image: ImageObject
  link: LinkObject
  fadeIn: boolean
}

interface ImageObject {
  src: string
  width: number
  height: number
  alt: string
}

interface LinkObject {
  href: string
  text: string
}

const ProductCard: StorefrontFunctionComponent<ProductCardProps> = ({ productTitle, children, image, link, fadeIn }) => {
  const observer = useRef<IntersectionObserver>();
  const cardRef: any = useRef();
  const [cardOpacity, setCardOpacity] = useState(fadeIn === false ? 1 : 0.01);
  const [cardScale, setCardScale] = useState(fadeIn === false ? 1 : 0.90);

  // Create / Destroy Intersection Observer
  useEffect(() => {
    if (!window) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reducedMotion.matches) {
      setCardOpacity(1);
      setCardScale(1);
      return;
    }

    if (fadeIn === false) return;

    observer.current = new IntersectionObserver(entries => {
      const entry: IntersectionObserverEntry = entries[0];
      if (entry.isIntersecting) animateIn();
    }, { threshold: 0.1, rootMargin: `0px` });

    observer.current.observe(cardRef.current);

    return () => {
      if (observer.current) observer.current.unobserve(cardRef.current);
    }
  });

  const animateIn = () => {
    setCardOpacity(1);
    setCardScale(1);
    if (observer.current) observer.current.unobserve(cardRef.current);
  }

  // @ts-expect-error - string.replaceAll() does not exist in VTEX's typescript library - LM
  const kebob = (title: string) => title.replaceAll(" ", "-").toLocaleLowerCase();

  return (
    <section ref={cardRef} id={`${kebob(productTitle)}-card`} style={{ opacity: cardOpacity, transform: `scale(${cardScale})` }} className={styles.productCard} aria-labelledby={`${kebob(productTitle)}-title`}>
      <img src={image.src} width={image.width || 450} height={image.height || 338} className={styles.cardImage} loading={fadeIn === false ? "eager" : "lazy"} />
      <div className={styles.textContainer}>
        <h2 id={`${kebob(productTitle)}-title`} className={styles.productTitle}>{productTitle}</h2>
        {children}
        {link.href && <Link to={link.href} className={styles.cardButton} >{link.text || `Shop The ${productTitle}`}</Link>}
      </div>
    </section>
  );
}

ProductCard.schema = {
  title: "ProductCard",
  description: "",
  type: "object",
  properties: {

  }
}

export default ProductCard;
