import { SectionCards } from "@/app/components/SectionCard/SectionCard"


export default function Page() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 px-4 lg:px-6">
        <SectionCards />
      </div>
    </div>
  )
}