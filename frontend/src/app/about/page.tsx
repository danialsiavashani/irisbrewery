import { AuthLayout } from "@/components/auth/AuthLayout";
import { PhotoToSketchScene } from "@/components/about/PhotoToSketchScene";

export default function AboutPage() {
  return (
    <AuthLayout
      visual={<PhotoToSketchScene />}
      tagline="Reliable, no guesswork."
      reverse
    >
      <h1 className="mb-4 text-2xl font-semibold">About Iris Brewery</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        Iris Brewery turns your photos into hand-sketched art — no waiting,
        no surprises, no "try again and hope." Every result is built the
        same reliable way, every time, so what you see is exactly what
        you get.
      </p>
      <p className="text-lg text-muted-foreground">
        We're starting with pencil sketch. Watercolor, oil painting, and
        cartoon styles are coming next — and eventually, you'll be able
        to combine them, layering effects together to create something
        entirely your own.
      </p>
    </AuthLayout>
  );
}