interface VideoPlayerProps {
  streamUrl: string;
}
export default function VideoPlayer({ streamUrl }: VideoPlayerProps) {
  return (
    <video
      controls
      src={streamUrl}
      style={{ width: "100%", aspectRatio: "16/9", maxWidth: 1000, background: "#000", borderRadius: 12, overflow: "hidden" }}
    />
  );
}
