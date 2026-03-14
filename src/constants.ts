export interface ClothingItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'tops' | 'bottoms' | 'dresses';
}

export const CLOTHING_ITEMS: ClothingItem[] = [
  {
    id: '1',
    name: 'Classic White Linen Shirt',
    description: 'A crisp, breathable white linen shirt with a relaxed fit.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
    category: 'tops'
  },
  {
    id: '2',
    name: 'Midnight Blue Silk Blouse',
    description: 'Elegant silk blouse in deep midnight blue with subtle sheen.',
    image: 'https://images.unsplash.com/photo-1564252234532-6852770b58b3?auto=format&fit=crop&w=400&q=80',
    category: 'tops'
  },
  {
    id: '3',
    name: 'Emerald Green Summer Dress',
    description: 'Flowy emerald green dress perfect for summer evenings.',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80',
    category: 'dresses'
  },
  {
    id: '4',
    name: 'Charcoal Oversized Blazer',
    description: 'Modern charcoal blazer with an oversized silhouette.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80',
    category: 'tops'
  },
  {
    id: '5',
    name: 'Terracotta Knit Sweater',
    description: 'Warm terracotta knit sweater with a chunky texture.',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80',
    category: 'tops'
  }
];
