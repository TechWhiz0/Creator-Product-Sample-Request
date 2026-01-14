// Polyfill localStorage for SSR to prevent errors from external scripts
if (typeof window === "undefined") {
  // Create a mock localStorage for server-side rendering
  const localStorageMock = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    get length() {
      return 0;
    },
    key: () => null,
  };

  // Make it available globally during SSR
  (global as any).localStorage = localStorageMock;
}

