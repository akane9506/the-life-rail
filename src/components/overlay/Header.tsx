import ChapterNavigation from "@/components/overlay/ChapterNavigation";

export default function Header() {
  return (
    <div className="w-full flex justify-center items-center h-15 py-2 mt-1 pointer-events-auto">
      <ChapterNavigation />
    </div>
  );
}
