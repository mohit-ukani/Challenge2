/**
 * Election data constants.
 * Non-partisan educational content about the Indian election process.
 */

export const MILESTONES = [
  {
    id: 'registration',
    title: 'Voter Registration',
    icon: '📋',
    colorVar: '--milestone-registration',
    shortDesc: 'Enroll in the Electoral Roll',
    description: 'Voter registration is the essential first step in the Indian democratic process. The Election Commission of India (ECI) maintains the electoral rolls. You can register to vote via the NVSP portal, Voter Helpline App, or offline.',
    actionUrl: 'https://voters.eci.gov.in/',
    actionLabel: 'Register Online (NVSP)',
    sections: [
      {
        title: '📝 Steps Required',
        items: [
          'Verify your name on the Electoral Roll at voters.eci.gov.in',
          'Fill out Form 6 for new voter registration',
          'Submit required address and age proof documents',
          'Complete the application online or submit to your Booth Level Officer (BLO)',
          'Track your application status and receive your EPIC (Voter ID)',
        ],
      },
      {
        title: '📌 Key Requirements',
        items: [
          'Must be an Indian citizen',
          'Must be 18 years old on the qualifying date (Jan 1, Apr 1, Jul 1, or Oct 1)',
          'Must be ordinarily resident of the polling area',
          'Not disqualified to be enrolled as an elector',
        ],
      },
      {
        title: '💡 Tips',
        items: [
          'Register via the official Voter Helpline App for convenience',
          'Use Form 8 for shifting residence or correcting details',
          'Link your Aadhaar to your Voter ID for easier verification',
          'Attend Special Summary Revision camps held periodically',
        ],
      },
    ],
    keyDates: [
      { label: 'Qualifying Dates', date: '2024-01-01', description: 'Jan 1, Apr 1, Jul 1, and Oct 1 are the qualifying dates for 18-year-olds' },
      { label: 'Special Summary Revision', date: '2024-11-01', description: 'Annual drive by ECI to update the electoral roll' },
    ],
  },
  {
    id: 'primaries',
    title: 'Notification & Nominations',
    icon: '📢',
    colorVar: '--milestone-primaries',
    shortDesc: 'Election dates announced and candidates file',
    description: 'The Election Commission of India formally announces the election schedule via a press conference. Following the notification, candidates file their nomination papers to contest from specific constituencies.',
    actionUrl: 'https://eci.gov.in/candidate-political-party/',
    actionLabel: 'View Candidate Guidelines',
    sections: [
      {
        title: '📝 How It Works',
        items: [
          'ECI announces the multi-phase election schedule',
          'Model Code of Conduct (MCC) comes into effect immediately',
          'Candidates file nomination papers and affidavits to the Returning Officer',
          'Scrutiny of nominations is conducted',
          'Candidates are given a deadline to withdraw nominations',
        ],
      },
      {
        title: '📌 Campaigning Guidelines',
        items: [
          'Candidates campaign under strict ECI expenditure limits',
          'Rallies, public meetings, and door-to-door campaigning occur',
          'Political parties release their election manifestos',
          'Campaigning must stop 48 hours before the end of polling (Silence Period)',
        ],
      },
      {
        title: '💡 Tips',
        items: [
          'Review the affidavits of candidates via the KYC (Know Your Candidate) app',
          'Understand the manifestos of different political parties',
          'Report Model Code of Conduct violations via the cVIGIL app',
        ],
      },
    ],
    keyDates: [
      { label: 'Election Announcement', date: '2024-03-16', description: 'ECI typically announces general elections weeks in advance' },
      { label: 'Last Date of Nomination', date: '2024-03-27', description: 'Varies based on the polling phase' },
      { label: 'Scrutiny of Nominations', date: '2024-03-28', description: 'Verification of candidate documents' },
    ],
  },
  {
    id: 'general',
    title: 'General Election (Polling)',
    icon: '🗳️',
    colorVar: '--milestone-general',
    shortDesc: 'Voting via EVMs and VVPATs',
    description: 'Polling is held in multiple phases across India due to the country\'s vast geography and the need to deploy security forces. Voters cast their ballots using Electronic Voting Machines (EVMs) equipped with VVPATs.',
    actionUrl: 'https://voters.eci.gov.in/',
    actionLabel: 'Search My Polling Station',
    sections: [
      {
        title: '📝 What\'s on the Ballot',
        items: [
          'Members of Parliament (Lok Sabha) during General Elections',
          'Members of Legislative Assembly (Vidhan Sabha) for state elections',
          'Local body representatives (Panchayats and Municipalities)',
          'NOTA (None of the Above) option is available',
        ],
      },
      {
        title: '📌 How Voting Works',
        items: [
          'Find your polling booth details via voter slip or ECI portal',
          'Present your EPIC (Voter ID) or an approved alternative ID',
          'Indelible ink is applied to your left index finger',
          'Press the blue button on the EVM next to your chosen candidate',
          'Verify your vote on the VVPAT slip for 7 seconds',
        ],
      },
      {
        title: '💡 Tips',
        items: [
          'Polling booths are typically open from 7:00 AM to 6:00 PM',
          'Senior citizens (85+) and PwD electors may opt for home voting',
          'Mobile phones are strictly prohibited inside the polling booth',
          'Avoid the rush by voting early in the morning',
        ],
      },
    ],
    keyDates: [
      { label: 'Phase 1 Polling', date: '2024-04-19', description: 'The first day of polling for the general elections' },
      { label: 'Final Phase Polling', date: '2024-06-01', description: 'The last day of the multi-phase election' },
    ],
  },
  {
    id: 'balloting',
    title: 'Counting & Results',
    icon: '✅',
    colorVar: '--milestone-balloting',
    shortDesc: 'EVM vote counting and declaration',
    description: 'After all phases of polling are complete, counting takes place simultaneously across the country. The results determine which party or coalition has the majority to form the government.',
    actionUrl: 'https://results.eci.gov.in/',
    actionLabel: 'View Real-time Results',
    sections: [
      {
        title: '📝 The Counting Process',
        items: [
          'EVMs are kept in strong rooms under heavy security',
          'Postal ballots are counted first on counting day',
          'EVM control units are unsealed in the presence of candidate agents',
          'Votes are tallied round by round',
          'VVPAT slips from randomly selected polling stations are verified',
        ],
      },
      {
        title: '📌 Formation of Government',
        items: [
          'Returning Officers declare the winning candidates',
          'A party or coalition needs 272+ seats for a Lok Sabha majority',
          'The President invites the leader of the majority to form the government',
          'The new Prime Minister and Council of Ministers take their oath',
        ],
      },
      {
        title: '💡 Tips',
        items: [
          'Track real-time trends on the ECI Results portal or app',
          'Results are finalized quickly thanks to Electronic Voting Machines',
          'Official certificates of election are handed to the winning candidates',
        ],
      },
    ],
    keyDates: [
      { label: 'Counting Day', date: '2024-06-04', description: 'Simultaneous counting of votes nationwide' },
      { label: 'Government Formation', date: '2024-06-09', description: 'Swearing-in ceremony of the new Prime Minister' },
    ],
  },
];

export const CHECKLIST_ITEMS = [
  {
    id: 'check-registration',
    step: 1,
    title: 'Check Your Name on Electoral Roll',
    subtitle: 'Verify your enrollment status',
    description: 'Visit the official ECI portal to verify that your name is present on the electoral roll. If not registered, you can apply online immediately.',
    actionUrl: 'https://voters.eci.gov.in/',
    actionLabel: 'Check Status / Register',
    icon: '🔍',
  },
  {
    id: 'request-ballot',
    step: 2,
    title: 'Check Home Voting Eligibility (Optional)',
    subtitle: 'For Senior Citizens & PwD',
    description: 'If you are 85 years or older, or a Person with Disability (PwD), you can apply for home voting facility using Form 12D.',
    actionUrl: 'https://voters.eci.gov.in/registration/form12d',
    actionLabel: 'Download Form 12D',
    icon: '🏠',
  },
  {
    id: 'know-candidates',
    step: 3,
    title: 'Know Your Candidates',
    subtitle: 'Research using the KYC App',
    description: 'Download the Election Commission\'s KYC (Know Your Candidate) app to review affidavits and criminal antecedents of the candidates.',
    actionUrl: 'https://play.google.com/store/apps/details?id=com.eci.kyc',
    actionLabel: 'Download KYC App',
    icon: '👥',
  },
  {
    id: 'find-polling',
    step: 4,
    title: 'Find Your Polling Booth',
    subtitle: 'Locate where to vote on Polling Day',
    description: 'Search for your polling booth details using your EPIC number online to identify your Part Number and Serial Number.',
    actionUrl: 'https://voters.eci.gov.in/',
    actionLabel: 'Locate Booth',
    icon: '📍',
  },
  {
    id: 'vote',
    step: 5,
    title: 'Cast Your Vote!',
    subtitle: 'Press the button on the EVM',
    description: 'Visit your polling booth with your EPIC (Voter ID) or an approved alternate ID. Cast your vote securely using the EVM.',
    actionUrl: 'https://eci.gov.in/voter/voter-guide/',
    actionLabel: 'View Voter Guide',
    icon: '🗳️',
  },
];

export const SAMPLE_POLLING_PLACES = [
  { id: 'pp1', name: 'Government Boys Senior Secondary School', address: 'Block C, Janakpuri, New Delhi, Delhi 110058', lat: 28.6219, lng: 77.0878, type: 'polling', hours: '7:00 AM - 6:00 PM' },
  { id: 'pp2', name: 'MCD Primary School', address: 'Sector 3, Dwarka, New Delhi, Delhi 110075', lat: 28.5921, lng: 77.0342, type: 'polling', hours: '7:00 AM - 6:00 PM' },
  { id: 'pp3', name: 'Community Centre', address: 'Vasant Vihar, New Delhi, Delhi 110057', lat: 28.5562, lng: 77.1601, type: 'polling', hours: '7:00 AM - 6:00 PM' },
  { id: 'pp4', name: 'Kendriya Vidyalaya', address: 'JNU Campus, New Delhi, Delhi 110067', lat: 28.5412, lng: 77.1652, type: 'polling', hours: '7:00 AM - 6:00 PM' },
  { id: 'pp5', name: 'Sarvodaya Kanya Vidyalaya', address: 'Lajpat Nagar, New Delhi, Delhi 110024', lat: 28.5677, lng: 77.2433, type: 'polling', hours: '7:00 AM - 6:00 PM' },
  { id: 'pp6', name: 'St. Mary\'s School', address: 'Safdarjung Enclave, New Delhi, Delhi 110029', lat: 28.5561, lng: 77.1952, type: 'polling', hours: '7:00 AM - 6:00 PM' },
];
