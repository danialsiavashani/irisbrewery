"use client";

import { GiraffeCartoon } from "./giraffe/GiraffeCartoon";
import { GiraffeSketch } from "./giraffe/GiraffeSketch";

export function HeroAnimation() {
  return (
    <div className="flex flex-row items-center justify-center gap-6">
      <GiraffeSketch />
      <GiraffeCartoon />
    </div>
  );
}