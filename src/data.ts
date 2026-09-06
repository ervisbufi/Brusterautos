import { Product } from './types';

export const CATEGORIES = ['All', 'Audi', 'Mercedes-Benz', 'VOLKSWAGEN', 'UNIVERSAL'];

export const PRODUCTS: Product[] = [
  {
    id: 'u1',
    name: 'All-Weather Premium Waterproof Car Cover',
    description: 'Heavy-duty all-season car cover engineered from breathable waterproof fabric. Shields against harsh UV sunlight, torrential rain, frost, snow, tree sap, and dust. Comes complete with anti-theft cable lock and windproof strap buckles.',
    price: 3500,
    category: 'UNIVERSAL',
    image: '/images/carcover.jpg',
    rating: 4.9,
    reviews: 142
  },
  {
    id: 'u2',
    name: 'Reflective Accordion Windshield Sunshade',
    description: 'High-density reflective double-layer aluminum foil sunshade. Blocks 99% of damaging UV rays and significantly lowers vehicle interior temperatures. Compact accordion fold with secure suction cups and elastic storage strap.',
    price: 1200,
    category: 'UNIVERSAL',
    image: '/images/carsunshade.jpg',
    rating: 4.8,
    reviews: 218
  },
  {
    id: 'u3',
    name: 'RGB Wireless Bluetooth FM Transmitter & Fast Charger',
    description: 'Sleek multi-color RGB ambient lighting Bluetooth 5.0 FM car audio adapter. Features dual USB fast-charging ports, lossless audio decoding (MP3/WAV/FLAC), one-touch hands-free calling, and intuitive central rotary dial.',
    price: 1800,
    category: 'UNIVERSAL',
    image: '/images/MP3colorkatror.JPEG',
    rating: 4.9,
    reviews: 310
  },
  {
    id: 'u4',
    name: '360° HD Convex Blind Spot Mirrors (Pair)',
    description: 'Pair of frameless high-definition convex wide-angle blind spot mirrors. 360-degree rotation and angle adjustability to eliminate driving blind spots, facilitate effortless parallel parking, and improve road safety.',
    price: 700,
    category: 'UNIVERSAL',
    image: '/images/smallmirrors.jpg',
    rating: 4.7,
    reviews: 185
  },
  {
    id: 'k1',
    name: 'Audi A6 Black & Silver Premium Case',
    description: 'Protect your Audi A6 key with this premium black case featuring an elegant silver trim. Engineered for perfect button alignment.',
    price: 600,
    category: 'Audi',
    image: '/images/AUDI%20A6BS.jpeg',
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'k2',
    name: 'Audi A6 White & Silver Case',
    description: 'Clean and modern white TPU case accented with silver trim for your Audi A6. Anti-yellowing material ensures it stays pristine.',
    price: 600,
    category: 'Audi',
    image: '/images/AUDI%20A6WS.jpeg',
    rating: 4.7,
    reviews: 89
  },
  {
    id: 'k5',
    name: 'Audi Mesh Texture Key Case',
    description: 'Get the look of classic leather mesh with the durability of TPU. Features a textured grip surface and premium silver accents.',
    price: 600,
    category: 'Audi',
    image: '/images/AUDI%20BS.jpeg',
    rating: 4.6,
    reviews: 178
  },
  {
    id: 'k8',
    name: 'Audi White & Gold Case',
    description: 'Luxury white case with beautiful gold accents. Transforms your standard key into a fashion statement.',
    price: 600,
    category: 'Audi',
    image: '/images/AUDI%20WG.jpeg',
    rating: 4.8,
    reviews: 210
  },
  {
    id: 'k9',
    name: 'Benz Sport Blue Leather Case',
    description: 'Stand out with this vibrant sport blue case featuring a scratch-resistant leather pattern and contrasting buttons for Mercedes-Benz.',
    price: 600,
    category: 'Mercedes-Benz',
    image: '/images/BENZ%20BBLUE.jpeg',
    rating: 4.6,
    reviews: 334
  },
  {
    id: 'k10',
    name: 'Benz Black & Gold Crystal Case',
    description: 'The ultimate luxury statement. High-gloss black case framed in rose gold, paired with a stunning crystal-encrusted keychain ring.',
    price: 600,
    category: 'Mercedes-Benz',
    image: '/images/BENZ%20BG.jpeg',
    rating: 4.9,
    reviews: 450
  },
  {
    id: 'k11',
    name: 'Benz Scratch-Resistant Red Leather Case',
    description: 'Bold red leather-textured finish designed to be highly durable and scratch-resistant. Upgraded electroplating ensures colors will not fade.',
    price: 600,
    category: 'Mercedes-Benz',
    image: '/images/BENZ%20BRED.jpeg',
    rating: 4.7,
    reviews: 0
  },
  {
    id: 'k12',
    name: 'Benz Mesh Texture Silver Case',
    description: 'Sophisticated mesh texture combined with high-polish silver trim. Tailored perfectly for Mercedes-Benz smart keys.',
    price: 600,
    category: 'Mercedes-Benz',
    image: '/images/BENZ%20BS%20MESH.jpeg',
    rating: 4.5,
    reviews: 190
  },
  {
    id: 'k13',
    name: 'Benz Glossy Black Silver Case',
    description: 'A timeless glossy black finish with silver edges. Provides robust protection against drops and daily wear.',
    price: 600,
    category: 'Mercedes-Benz',
    image: '/images/BENZ%20BS.jpeg',
    rating: 4.8,
    reviews: 315
  },
  {
    id: 'k14',
    name: 'Benz White & Gold Braided Strap Case',
    description: 'Elegant white and gold aesthetic, accompanied by a premium braided leather strap. Perfect for luxury car owners.',
    price: 600,
    category: 'Mercedes-Benz',
    image: '/images/BENZ%20WG.jpeg',
    rating: 4.9,
    reviews: 520
  },
  {
    id: 'k15',
    name: 'Benz White & Silver Crystal Case',
    description: 'A stunning white and silver finish accented with sparkling crystals. Elevate your Mercedes-Benz key to a piece of jewelry.',
    price: 600,
    category: 'Mercedes-Benz',
    image: '/images/BENZ%20WS.jpeg',
    rating: 4.9,
    reviews: 215
  },
  {
    id: 'k16',
    name: 'Volkswagen Golf G4 Sport Blue Key Case',
    description: 'Vibrant sport blue protective key cover engineered specifically for Volkswagen Golf G4 and VW smart keys. Shock-absorbing TPU with precision button cutouts and scratch protection.',
    price: 600,
    category: 'VOLKSWAGEN',
    image: '/images/G4%20BBLUE.jpeg',
    rating: 4.6,
    reviews: 120
  },
  {
    id: 'k17',
    name: 'Volkswagen Golf G4 Mesh Texture Silver Case',
    description: 'Sophisticated mesh leather-grain texture with high-polish silver trim, tailored for Volkswagen Golf MK4 and classic VW keys. Resistant to scratches, oil, and daily wear.',
    price: 600,
    category: 'VOLKSWAGEN',
    image: '/images/G4%20BS%20MESH.jpeg',
    rating: 4.5,
    reviews: 85
  },
  {
    id: 'k18',
    name: 'Volkswagen Golf G4 Glossy Black Silver Case',
    description: 'High-gloss piano black finish accented by electroplated chrome silver edges. Precision-molded for Volkswagen Golf G4 smart keys with 360-degree impact resistance.',
    price: 600,
    category: 'VOLKSWAGEN',
    image: '/images/G4%20BS.jpeg',
    rating: 4.8,
    reviews: 210
  },
  {
    id: 'k19',
    name: 'Volkswagen Golf G4 Matte Grey & Black Case',
    description: 'Modern matte gunmetal grey and deep black protective shell for Volkswagen Golf G4 keys. Features an anti-slip textured grip and dust-sealed button alignment.',
    price: 600,
    category: 'VOLKSWAGEN',
    image: '/images/G4%20GREYB.jpeg',
    rating: 4.7,
    reviews: 150
  },
  {
    id: 'k20',
    name: 'Audi Classic Black & Silver Key Case',
    description: 'Premium protective TPU case engineered for classic Audi key fobs. Features a high-gloss black finish with sleek silver electroplated trim, providing complete 360-degree drop and scratch protection.',
    price: 600,
    category: 'Audi',
    image: '/images/AUDI%20BS2005.jpeg',
    rating: 4.8,
    reviews: 95
  }
];

