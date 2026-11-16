/**
 * Speaker data exactly as supplied. Photos were not supplied:
 * `photoAvailable` stays false so no image request is made. Set it to true
 * once the file exists in assets/images/ — a failed load falls back to initials.
 */
export const panelists = [
  {
    id: 'spk-1',
    name: 'Elena Rostova',
    title: 'Master Lash Educator & Founder',
    category: 'artistry',
    categoryLabel: 'Artistry',
    bio: 'Pioneer in mega-volume techniques, lash mapping, and retention optimization.',
    image: 'assets/images/speaker-elena.jpg',
    photoAvailable: false,
  },
  {
    id: 'spk-2',
    name: 'Dr. Aris Thorne, OD',
    title: 'Ophthalmologist & Eye Health Specialist',
    category: 'health',
    categoryLabel: 'Ocular Health',
    bio: 'Specializes in corneal safety, blepharitis prevention, and allergy mitigation.',
    image: 'assets/images/speaker-aris.jpg',
    photoAvailable: false,
  },
  {
    id: 'spk-3',
    name: 'Dr. Sarah Lin, PhD',
    title: 'Cosmetic Chemist',
    category: 'chemistry',
    categoryLabel: 'Chemistry',
    bio: 'Formulator focused on cyanoacrylate polymer chemistry and serum active ingredients.',
    image: 'assets/images/speaker-sarah.jpg',
    photoAvailable: false,
  },
  {
    id: 'spk-4',
    name: 'Marcus Vance',
    title: 'Beauty Brand Strategist',
    category: 'business',
    categoryLabel: 'Business',
    bio: 'Scales boutique lash studios into multi-location franchises and product lines.',
    image: 'assets/images/speaker-marcus.jpg',
    photoAvailable: false,
  },
];

export const speakers = panelists;
