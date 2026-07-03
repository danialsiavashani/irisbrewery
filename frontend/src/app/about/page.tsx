import { AuthLayout } from "@/components/auth/AuthLayout";
import { TechStackScene } from "@/components/about/TechStackScene";

export default function AboutPage() {
  return (
    <AuthLayout
      visual={<TechStackScene />}
      tagline="Next.js, Django, C++ and OpenCV."
      reverse
    >
      <h1 className="mb-4 text-2xl font-semibold">About Sketchify</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        Sketchify turns any photo into a pencil-sketch-style image using
        classical computer vision — no AI models, no guesswork. Same
        photo, same settings, same result, every time.
      </p>
      <p className="text-lg text-muted-foreground">
        Built as a multi-service app — a stateless C++ image processing
        service, a Django REST API, and a Next.js frontend — each
        independently deployable.
      </p>
    </AuthLayout>
  );
}