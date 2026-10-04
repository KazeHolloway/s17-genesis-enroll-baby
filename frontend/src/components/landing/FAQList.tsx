import { Plus } from "lucide-react";

import { faqs } from "@/lib/landingContent";

type FAQListProps = {
  compact?: boolean;
};

export function FAQList({ compact = false }: FAQListProps) {
  const visibleFaqs = compact ? faqs.filter((_, i) => [0, 2, 3, 4].includes(i)) : faqs;

  return (
    <div className="faq-list">
      {visibleFaqs.map(([question, answer]) => (
        <details key={question}>
          <summary>
            {question}
            <Plus size={15} />
          </summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}
