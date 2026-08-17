type BlogCategoryIconProps = {
  category: string;
};

function AlgorithmIcon() {
  return <><path d="M5 6h5M5 12h9M5 18h13" /><circle cx="16" cy="6" r="2" /><circle cx="18" cy="12" r="2" /><circle cx="20" cy="18" r="2" /></>;
}

function BlockchainIcon() {
  return <><rect x="4" y="10" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /><path d="m10 12 4-4M10 14l4 4" /></>;
}

function FrontendIcon() {
  return <><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><path d="M3.5 9h17M7 7h.01M10 7h.01M13 7h.01M9.5 13 7.5 15l2 2M14.5 13l2 2-2 2" /></>;
}

function ProductivityIcon() {
  return <><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><path d="m7 10 3 3-3 3M12.5 16h4.5" /><path d="M6.5 7.5h.01" /></>;
}

function StatisticsIcon() {
  return <><path d="M5 19V5M5 19h15" /><path d="m8 15 3-3 3 2 5-6" /><circle cx="8" cy="15" r="1" /><circle cx="11" cy="12" r="1" /><circle cx="14" cy="14" r="1" /><circle cx="19" cy="8" r="1" /></>;
}

function FallbackIcon() {
  return <><circle cx="12" cy="12" r="8" /><path d="M8.5 12h7M12 8.5v7" /></>;
}

export default function BlogCategoryIcon({ category }: BlogCategoryIconProps) {
  const icons: Record<string, React.ReactNode> = {
    algorithms: <AlgorithmIcon />,
    blockchain: <BlockchainIcon />,
    frontend: <FrontendIcon />,
    productivity: <ProductivityIcon />,
    statistics: <StatisticsIcon />,
  };

  return (
    <span className="journal-category-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {icons[category] ?? <FallbackIcon />}
      </svg>
    </span>
  );
}
