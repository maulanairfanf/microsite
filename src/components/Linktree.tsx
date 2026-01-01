import { LinktreeComponent } from "@/types/components";
import { IoLogoWhatsapp, IoLogoInstagram, IoRestaurantOutline } from "react-icons/io5";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  whatsapp: IoLogoWhatsapp,
  instagram: IoLogoInstagram,
  menu: IoRestaurantOutline,
};

export function Linktree({ data }: { data: LinktreeComponent }) {
  return (
    <section className="w-full py-4 px-6">
      <h2 className="text-xl font-semibold text-center mb-6 text-gray-900">
        {data.title}
      </h2>
      <div className="flex flex-col gap-3">
        {data.items.map((item) => {
          const Icon = item.icon ? iconMap[item.icon] : null;
          return (
            <a
              key={item.url}
              href={item.url}
              className="flex items-center gap-4 p-2 bg-white rounded-lg shadow-sm hover:bg-gray-200 transition-all"
            >
              {Icon && (
                <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0">
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-900 flex-1">
                {item.text}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
