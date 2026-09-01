import Image from "next/image";

// The official logo (public/images/Logo_mission_Les_Conquerants.jpg) is a
// circular mark on a square white-cornered frame. Cropping it into a circle
// via overflow-hidden drops those corners so it reads cleanly on the navy
// header/footer chrome, without touching the source artwork itself.
export function SiteLogo({ className = "size-9" }: { className?: string }) {
  return (
    <span className={`relative shrink-0 overflow-hidden rounded-full ring-1 ring-white/25 ${className}`}>
      <Image
        src="/images/Logo_mission_Les_Conquerants.jpg"
        alt=""
        fill
        sizes="40px"
        className="scale-[1.12] object-cover"
      />
    </span>
  );
}
