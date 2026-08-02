export const EASE = [0.22, 1, 0.36, 1];

export const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const pageTransition = { duration: 0.2, ease: EASE };

export const listContainer = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const listItem = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

// Scroll reveal for anything below the fold. Pair with viewport={{ once: true }}.
export const revealUp = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

// Shared hover/press feel for cards that navigate somewhere.
export const liftOnHover = {
  whileHover: { y: -5 },
  whileTap: { scale: 0.985 },
  transition: { type: "spring", stiffness: 380, damping: 28 },
};

// Success moments: a small pop that settles rather than a bounce.
export const popIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};