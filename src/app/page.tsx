import { ComponentsData } from "@/types/components";
import { ComponentRenderer } from "@/components/ComponentRenderer";
import componentsData from "@/data/components.json";

export default function Home() {
  const data: ComponentsData = componentsData as ComponentsData;

  return (
    <main className="w-full">
      {data.components.map((component) => (
        <ComponentRenderer key={component.id} component={component} />
      ))}
    </main>
  );
}
