export function Thumbnail({ imageUrl }: { imageUrl: string | null }) {
  return (
    <div className="inline-block">
      {/* eslint-disable @next/next/no-img-element */}
      <img
        src={imageUrl ?? "/not-found-ogp.png"}
        alt=""
        width={280}
        height={160}
        className="rounded-lg h-[135px] w-[300px] border border-gray-100 shadow-md"
      />
    </div>
  );
}
