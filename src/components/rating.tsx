export function Rating({ voteAverage }: { voteAverage?: number }) {
  if (!voteAverage && voteAverage !== 0) return null;
  const five = Math.round((voteAverage / 10) * 5);
  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <div aria-label={`Rating ${voteAverage}/10`} className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            width="16"
            height="16"
            className={i < five ? "fill-yellow-400" : "fill-gray-300"}
            aria-hidden
          >
            <path d="M10 15l-5.878 3.09 1.122-6.545L.489 6.91l6.561-.953L10 0l2.95 5.957 6.561.953-4.755 4.635 1.122 6.545z" />
          </svg>
        ))}
      </div>
      <span className="text-gray-700">{voteAverage.toFixed(1)}/10</span>
    </div>
  );
}
