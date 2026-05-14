export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  price: string;
  verified: boolean;
  responseTime: string;
  completedJobs: number;
}

export const specialties = [
  { name: "Santexnik", icon: "🔧", color: "from-blue-500 to-cyan-500" },
  { name: "Elektrik", icon: "⚡", color: "from-yellow-500 to-orange-500" },
  { name: "Tozalovchi", icon: "🧹", color: "from-green-500 to-teal-500" },
  { name: "IT xizmati", icon: "💻", color: "from-purple-500 to-pink-500" },
  { name: "Tamirchi", icon: "🛠️", color: "from-red-500 to-orange-500" },
  { name: "O'qituvchi", icon: "📚", color: "from-indigo-500 to-blue-500" },
  { name: "Elektr ustasi", icon: "🔩", color: "from-cyan-500 to-blue-500" },
  { name: "Gaz mutaxassisi", icon: "🔥", color: "from-orange-500 to-red-500" },
];

const baseSpecialists: Record<string, Specialist[]> = {
  Santexnik: [
    {
      id: "santexnik-abdulloh",
      name: "Abdulloh Toshmatov",
      specialty: "Santexnik",
      rating: 5,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=240&q=85&fit=crop&crop=faces",
      price: "80 000 so'mdan",
      verified: true,
      responseTime: "15 daqiqa",
      completedJobs: 1240,
    },
    {
      id: "santexnik-rustam",
      name: "Rustam Karimov",
      specialty: "Quvur va kran ustasi",
      rating: 4.9,
      reviews: 184,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&q=85&fit=crop&crop=faces",
      price: "70 000 so'mdan",
      verified: true,
      responseTime: "20 daqiqa",
      completedJobs: 780,
    },
  ],
  Elektrik: [
    {
      id: "elektrik-sherzod",
      name: "Sherzod Mirzayev",
      specialty: "Elektrik usta",
      rating: 4.9,
      reviews: 241,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&q=85&fit=crop&crop=faces",
      price: "70 000 so'mdan",
      verified: true,
      responseTime: "20 daqiqa",
      completedJobs: 890,
    },
  ],
  Tozalovchi: [
    {
      id: "tozalovchi-nilufar",
      name: "Nilufar Xolmatova",
      specialty: "Tozalash ustasi",
      rating: 5,
      reviews: 487,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&q=85&fit=crop&crop=faces",
      price: "80 000 so'mdan",
      verified: true,
      responseTime: "25 daqiqa",
      completedJobs: 2100,
    },
  ],
  "IT xizmati": [
    {
      id: "it-jasurbek",
      name: "Jasurbek Rahimov",
      specialty: "IT mutaxassis",
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&q=85&fit=crop&crop=faces",
      price: "120 000 so'mdan",
      verified: true,
      responseTime: "30 daqiqa",
      completedJobs: 430,
    },
  ],
  Tamirchi: [
    {
      id: "tamirchi-murod",
      name: "Murod Hamidov",
      specialty: "Ta'mir ustasi",
      rating: 4.8,
      reviews: 398,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&q=85&fit=crop&crop=faces",
      price: "100 000 so'mdan",
      verified: true,
      responseTime: "1 soat",
      completedJobs: 760,
    },
  ],
  "O'qituvchi": [
    {
      id: "oqituvchi-zulfiya",
      name: "Zulfiya Nazarova",
      specialty: "Matematika va ingliz tili",
      rating: 5,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&q=85&fit=crop&crop=faces",
      price: "60 000 so'mdan",
      verified: true,
      responseTime: "1 soat",
      completedJobs: 580,
    },
  ],
  "Elektr ustasi": [
    {
      id: "elektr-usta-anvar",
      name: "Anvar Sobirov",
      specialty: "Elektr montaj ustasi",
      rating: 4.8,
      reviews: 132,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&q=85&fit=crop&crop=faces",
      price: "90 000 so'mdan",
      verified: true,
      responseTime: "30 daqiqa",
      completedJobs: 510,
    },
  ],
  "Gaz mutaxassisi": [
    {
      id: "gaz-olim",
      name: "Olim Jo'rayev",
      specialty: "Gaz uskunalari mutaxassisi",
      rating: 4.9,
      reviews: 97,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&q=85&fit=crop&crop=faces",
      price: "100 000 so'mdan",
      verified: true,
      responseTime: "40 daqiqa",
      completedJobs: 320,
    },
  ],
  Avtomaster: [
    {
      id: "avto-bobur",
      name: "Bobur Xasanov",
      specialty: "Avtomaster",
      rating: 4.7,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&q=85&fit=crop&crop=faces",
      price: "90 000 so'mdan",
      verified: true,
      responseTime: "45 daqiqa",
      completedJobs: 560,
    },
  ],
  Fotograf: [
    {
      id: "foto-zafar",
      name: "Zafar Karimov",
      specialty: "Fotograf va videograf",
      rating: 4.9,
      reviews: 118,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&q=85&fit=crop&crop=faces",
      price: "150 000 so'mdan",
      verified: true,
      responseTime: "1 soat",
      completedJobs: 290,
    },
  ],
};

const aliases: Record<string, string> = {
  "Ta'mirchi": "Tamirchi",
  "IT xizmatlar": "IT xizmati",
  "IT xizmat": "IT xizmati",
  Konditsioner: "Elektr ustasi",
};

export const specialistsData: Record<string, Specialist[]> = baseSpecialists;

export const getSpecialistsByCategory = (category: string): Specialist[] => {
  const key = aliases[category] || category;
  return specialistsData[key] || specialistsData.Santexnik;
};
