"use client";

export default function GlobalError({ error, reset }: { error: Error, reset: () => void }) {
  return (
    <div>
      <h1>Something went wrong!</h1>
      <pre>{error.message}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
