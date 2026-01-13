type FeatureItem = {
  title: string;
  href: string;
};

export type FeatureCategory = {
  id: number;
  category: string;
  color: string;
  detail: FeatureItem;
};
