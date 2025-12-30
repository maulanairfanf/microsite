import { LinktreeComponent } from "@/types/components";

export function Linktree({ data }: { data: LinktreeComponent }) {
  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {data.title}
        </h2>
        <div className="flex flex-col gap-4">
          {data.items.map((item) => (
            <a
              key={item.url}
              href={item.url}
              className="flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all"
            >
              <span className="text-lg font-medium text-gray-900">
                {item.text}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
