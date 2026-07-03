import { CppLogoScene } from "./CppLogoScene";
import { DjangoLogoScene } from "./DjangoLogoScene";
import { NextjsLogoScene } from "./NextjsLogoScene";
import { OpencvLogoScene } from "./OpencvLogoScene";

export function TechStackScene() {
  return (
    <div className="grid w-full max-w-xs grid-cols-2 gap-6">
      <div className="flex items-center justify-center p-2">
        <NextjsLogoScene />
      </div>
      <div className="flex items-center justify-center p-2">
        <DjangoLogoScene />
      </div>
      <div className="flex items-center justify-center p-2">
        <CppLogoScene />
      </div>
      <div className="flex items-center justify-center p-2">
        <OpencvLogoScene />
      </div>
    </div>
  );
}