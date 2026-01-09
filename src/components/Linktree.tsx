import { LinktreeComponent } from "@/types/components";
import { IoLogoWhatsapp, IoLogoInstagram, IoRestaurantOutline } from "react-icons/io5";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  whatsapp: IoLogoWhatsapp,
  instagram: IoLogoInstagram,
  menu: IoRestaurantOutline,
};

export function Linktree({ data }: { data: LinktreeComponent }) {
  return (
    <section className="w-full py-4 px-6">
      <h2 className="text-xl font-semibold text-center mb-6" style={{ color: "var(--headerTextColor)", fontFamily: "var(--headerFontFamily)" }}>
        {data.title}
      </h2>
      <div className="flex flex-col gap-3">
        {data.items.map((item) => {
          const Icon = item.icon ? iconMap[item.icon] : null;
          return (
            <a
              key={item.url}
              href={item.url}
              style={{
                border: "var(--cardBorder)",
                boxShadow: "var(--cardShadow)",
                borderRadius: "var(--cardRadius)"
              }}
              className="flex items-center gap-4 p-2 rounded-lg transition-all card-bg card-hover-bg"
            >
              {Icon && (
                <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0">
                  <Icon className="w-6 h-6" style={{ color: "var(--cardText)" }} />
                </div>
              )}
              <span className="text-sm font-medium flex-1" style={{ color: "var(--cardText)" }}>
                {item.text}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
