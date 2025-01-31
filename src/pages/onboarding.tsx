import { FC, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '@/lib/supabaseClient'
import { containsProfanity, sanitizeUsername } from '@/utils/profanityFilter'
import toast from 'react-hot-toast'
import { OnboardingModel, OnboardingData, onboardingEvents } from '@/models/OnboardingModel'
import { debounce } from 'lodash'
import { useUser } from '@/contexts/UserContext'

interface FormData {
  firstName: string
  lastName: string
  username: string
  dateOfBirth: string
  phoneNumber: string
  source: string
  sourceDetail?: string
  interests: string[]
  youtubeChannel?: string
  socialProfiles?: string
  researchGoals?: string
  oneThingToFind?: string
  notificationPreference: string
  language: string
  country: string
  featureSuggestions: string
  challenges: string
  countryCode: string
  researchInterests: string[]
  preferredTools: string[]
  goals: string
  postalCode: string
}

const countries = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AX', name: 'Åland Islands' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AI', name: 'Anguilla' },
  { code: 'AQ', name: 'Antarctica' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BV', name: 'Bouvet Island' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IO', name: 'British Indian Ocean Territory' },
  { code: 'BN', name: 'Brunei Darussalam' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'KY', name: 'Cayman Islands' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CX', name: 'Christmas Island' },
  { code: 'CC', name: 'Cocos (Keeling) Islands' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo, Democratic Republic of the' },
  { code: 'CK', name: 'Cook Islands' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FK', name: 'Falkland Islands' },
  { code: 'FO', name: 'Faroe Islands' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GF', name: 'French Guiana' },
  { code: 'PF', name: 'French Polynesia' },
  { code: 'TF', name: 'French Southern Territories' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GR', name: 'Greece' },
  { code: 'GL', name: 'Greenland' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GP', name: 'Guadeloupe' },
  { code: 'GU', name: 'Guam' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GG', name: 'Guernsey' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HM', name: 'Heard Island and McDonald Islands' },
  { code: 'VA', name: 'Holy See (Vatican City State)' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IM', name: 'Isle of Man' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JE', name: 'Jersey' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KP', name: "Korea, Democratic People's Republic of" },
  { code: 'KR', name: 'Korea, Republic of' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Lao People\'s Democratic Republic' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MO', name: 'Macao' },
  { code: 'MK', name: 'Macedonia' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MQ', name: 'Martinique' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'YT', name: 'Mayotte' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MS', name: 'Montserrat' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NC', name: 'New Caledonia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NU', name: 'Niue' },
  { code: 'NF', name: 'Norfolk Island' },
  { code: 'MP', name: 'Northern Mariana Islands' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PS', name: 'Palestine' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PN', name: 'Pitcairn' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RE', name: 'Réunion' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russian Federation' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'BL', name: 'Saint Barthélemy' },
  { code: 'SH', name: 'Saint Helena' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'MF', name: 'Saint Martin (French part)' },
  { code: 'PM', name: 'Saint Pierre and Miquelon' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SX', name: 'Sint Maarten (Dutch part)' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SJ', name: 'Svalbard and Jan Mayen' },
  { code: 'SZ', name: 'Swaziland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syrian Arab Republic' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TK', name: 'Tokelau' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TC', name: 'Turks and Caicos Islands' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UM', name: 'United States Minor Outlying Islands' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Viet Nam' },
  { code: 'VG', name: 'Virgin Islands, British' },
  { code: 'VI', name: 'Virgin Islands, U.S.' },
  { code: 'WF', name: 'Wallis and Futuna' },
  { code: 'EH', name: 'Western Sahara' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
];

// Add this interface for category state management
interface CategoryState {
  [key: string]: {
    isOpen: boolean;
    searchTerm: string;
  };
}

const topicCategories = {
  'AI & Data': {
    icon: '🤖',
    topics: [
      'Artificial Intelligence',
      'Machine Learning',
      'Neural Networks',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'Data Science',
      'Big Data Analytics',
      'Data Visualization'
    ]
  },
  'Web3 & Blockchain': {
    icon: '🔗',
    topics: [
      'Blockchain',
      'Cryptocurrency',
      'Smart Contracts',
      'DeFi',
      'NFTs',
      'Web3',
      'Metaverse'
    ]
  },
  'Software & Development': {
    icon: '💻',
    topics: [
      'Software Development',
      'Cloud Computing',
      'DevOps',
      'Mobile Development',
      'Web Development',
      'API Development',
      'System Architecture'
    ]
  },
  'Security & Infrastructure': {
    icon: '🔒',
    topics: [
      'Cybersecurity',
      'Network Security',
      'Cloud Security',
      'Ethical Hacking',
      'Security Architecture',
      'Infrastructure'
    ]
  },
  'Research & Academia': {
    icon: '📚',
    topics: [
      'Historical Research',
      'Archaeological Studies',
      'Anthropology',
      'Sociology',
      'Psychology Research',
      'Philosophy',
      'Literature Studies',
      'Cultural Studies',
      'Religious Studies'
    ]
  },
  'Science & Technology': {
    icon: '🔬',
    topics: [
      'Physics Research',
      'Chemistry Studies',
      'Biology Research',
      'Environmental Science',
      'Space Exploration',
      'Quantum Physics',
      'Biotechnology',
      'Nanotechnology',
      'Materials Science'
    ]
  },
  'Medicine & Healthcare': {
    icon: '🏥',
    topics: [
      'Medical Research',
      'Public Health',
      'Epidemiology',
      'Neuroscience',
      'Genetics',
      'Pharmacology',
      'Clinical Trials',
      'Healthcare Innovation',
      'Biomedical Engineering'
    ]
  },
  'Business & Economics': {
    icon: '📊',
    topics: [
      'Economic Research',
      'Market Analysis',
      'Financial Studies',
      'Business Strategy',
      'Innovation Management',
      'Entrepreneurship',
      'Organizational Behavior',
      'International Trade',
      'Sustainable Economics'
    ]
  },
  'Arts & Humanities': {
    icon: '🎨',
    topics: [
      'Art History',
      'Music Research',
      'Film Studies',
      'Digital Humanities',
      'Creative Writing',
      'Media Studies',
      'Performance Arts',
      'Visual Arts',
      'Design Research'
    ]
  }
}

// Add country codes data
const countryCodes = [
  { code: '+1', country: 'US/CA' },
  { code: '+1242', country: 'BS' },
  { code: '+1246', country: 'BB' },
  { code: '+1264', country: 'AI' },
  { code: '+1268', country: 'AG' },
  { code: '+1284', country: 'VG' },
  { code: '+1340', country: 'VI' },
  { code: '+1345', country: 'KY' },
  { code: '+1441', country: 'BM' },
  { code: '+1473', country: 'GD' },
  { code: '+1649', country: 'TC' },
  { code: '+1664', country: 'MS' },
  { code: '+1670', country: 'MP' },
  { code: '+1671', country: 'GU' },
  { code: '+1684', country: 'AS' },
  { code: '+1758', country: 'LC' },
  { code: '+1767', country: 'DM' },
  { code: '+1784', country: 'VC' },
  { code: '+1809', country: 'DO' },
  { code: '+1868', country: 'TT' },
  { code: '+1869', country: 'KN' },
  { code: '+1876', country: 'JM' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'IN' },
  { code: '+61', country: 'AU' },
  { code: '+86', country: 'CN' },
  { code: '+81', country: 'JP' },
  { code: '+49', country: 'DE' },
  { code: '+33', country: 'FR' },
  { code: '+7', country: 'RU/KZ' },
  { code: '+20', country: 'EG' },
  { code: '+27', country: 'ZA' },
  { code: '+30', country: 'GR' },
  { code: '+31', country: 'NL' },
  { code: '+32', country: 'BE' },
  { code: '+34', country: 'ES' },
  { code: '+36', country: 'HU' },
  { code: '+39', country: 'IT' },
  { code: '+40', country: 'RO' },
  { code: '+41', country: 'CH' },
  { code: '+43', country: 'AT' },
  { code: '+45', country: 'DK' },
  { code: '+46', country: 'SE' },
  { code: '+47', country: 'NO' },
  { code: '+48', country: 'PL' },
  { code: '+51', country: 'PE' },
  { code: '+52', country: 'MX' },
  { code: '+54', country: 'AR' },
  { code: '+55', country: 'BR' },
  { code: '+56', country: 'CL' },
  { code: '+57', country: 'CO' },
  { code: '+58', country: 'VE' },
  { code: '+60', country: 'MY' },
  { code: '+62', country: 'ID' },
  { code: '+63', country: 'PH' },
  { code: '+64', country: 'NZ' },
  { code: '+65', country: 'SG' },
  { code: '+66', country: 'TH' },
  { code: '+82', country: 'KR' },
  { code: '+84', country: 'VN' },
  { code: '+90', country: 'TR' },
  { code: '+92', country: 'PK' },
  { code: '+93', country: 'AF' },
  { code: '+94', country: 'LK' },
  { code: '+95', country: 'MM' },
  { code: '+98', country: 'IR' },
  { code: '+212', country: 'MA' },
  { code: '+213', country: 'DZ' },
  { code: '+216', country: 'TN' },
  { code: '+218', country: 'LY' },
  { code: '+220', country: 'GM' },
  { code: '+221', country: 'SN' },
  { code: '+222', country: 'MR' },
  { code: '+223', country: 'ML' },
  { code: '+224', country: 'GN' },
  { code: '+225', country: 'CI' },
  { code: '+226', country: 'BF' },
  { code: '+227', country: 'NE' },
  { code: '+228', country: 'TG' },
  { code: '+229', country: 'BJ' },
  { code: '+230', country: 'MU' },
  { code: '+231', country: 'LR' },
  { code: '+232', country: 'SL' },
  { code: '+233', country: 'GH' },
  { code: '+234', country: 'NG' },
  { code: '+235', country: 'TD' },
  { code: '+236', country: 'CF' },
  { code: '+237', country: 'CM' },
  { code: '+238', country: 'CV' },
  { code: '+239', country: 'ST' },
  { code: '+240', country: 'GQ' },
  { code: '+241', country: 'GA' },
  { code: '+242', country: 'CG' },
  { code: '+243', country: 'CD' },
  { code: '+244', country: 'AO' },
  { code: '+245', country: 'GW' },
  { code: '+246', country: 'IO' },
  { code: '+247', country: 'AC' },
  { code: '+248', country: 'SC' },
  { code: '+249', country: 'SD' },
  { code: '+250', country: 'RW' },
  { code: '+251', country: 'ET' },
  { code: '+252', country: 'SO' },
  { code: '+253', country: 'DJ' },
  { code: '+254', country: 'KE' },
  { code: '+255', country: 'TZ' },
  { code: '+256', country: 'UG' },
  { code: '+257', country: 'BI' },
  { code: '+258', country: 'MZ' },
  { code: '+260', country: 'ZM' },
  { code: '+261', country: 'MG' },
  { code: '+262', country: 'RE' },
  { code: '+263', country: 'ZW' },
  { code: '+264', country: 'NA' },
  { code: '+265', country: 'MW' },
  { code: '+266', country: 'LS' },
  { code: '+267', country: 'BW' },
  { code: '+268', country: 'SZ' },
  { code: '+269', country: 'KM' },
  { code: '+290', country: 'SH' },
  { code: '+291', country: 'ER' },
  { code: '+297', country: 'AW' },
  { code: '+298', country: 'FO' },
  { code: '+299', country: 'GL' },
  // Add more country codes as needed
]

const OnboardingPage: FC = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    dateOfBirth: '',
    phoneNumber: '',
    source: '',
    sourceDetail: '',
    interests: [],
    youtubeChannel: '',
    socialProfiles: '',
    researchGoals: '',
    oneThingToFind: '',
    notificationPreference: '',
    language: '',
    country: '',
    featureSuggestions: '',
    challenges: '',
    countryCode: '',
    researchInterests: [],
    preferredTools: [],
    goals: '',
    postalCode: ''
  })
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [usernameError, setUsernameError] = useState<string>('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  // Add this interface for category state management
  const [categoryStates, setCategoryStates] = useState<CategoryState>(
    Object.fromEntries(
      Object.keys(topicCategories).map(category => [
        category,
        { isOpen: false, searchTerm: '' }
      ])
    )
  )

  const [searchTerm, setSearchTerm] = useState('')

  const { refreshProfile } = useUser()

  // Add these helper functions
  const toggleCategory = (category: string) => {
    setCategoryStates(prev => ({
      ...prev,
      [category]: { 
        ...prev[category] || { searchTerm: '' }, 
        isOpen: !prev[category]?.isOpen 
      }
    }))
  }

  const updateCategorySearch = (category: string, term: string) => {
    setCategoryStates(prev => ({
      ...prev,
      [category]: { ...prev[category], searchTerm: term }
    }))
  }

  const getTotalSelectedCount = () => formData.researchInterests.length

  const getFilteredTopics = (topics: string[], searchTerm: string) => {
    return topics.filter(topic => 
      topic.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        console.log('Checking onboarding status...');
        const user = await OnboardingModel.getCurrentUser();
        
        if (!user) {
          console.log('No user found, redirecting to login');
          toast.error('Please sign in to continue');
          router.push('/');
          return;
        }

        console.log('User found:', user.id);

        // Get current onboarding status
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Store debug info
        setDebugInfo({
          userId: user.id,
          profile,
          error,
          timestamp: new Date().toISOString()
        });

        console.log('Profile data:', profile);
        console.log('Error if any:', error);

        if (error) {
          if (error.code === 'PGRST116') {
            console.log('Creating new profile for user');
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                onboarding_step: 1,
                onboarding_completed: false,
                onboarding_status: 'in_progress',
                created_at: new Date().toISOString()
              });

            if (createError) {
              console.error('Error creating profile:', createError);
              throw createError;
            }
            setCurrentStep(1);
          } else {
            throw error;
          }
        } else {
          if (profile?.onboarding_completed) {
            console.log('Onboarding already completed, redirecting to dashboard');
            toast.success('Setup already completed');
            router.push('/dashboard');
            return;
          }

          console.log('Resuming from step:', profile?.onboarding_step);
          setCurrentStep(profile?.onboarding_step || 1);
          setFormData(profile?.onboarding_data || {});
        }

      } catch (error) {
        console.error('Error in checkOnboardingStatus:', error);
        toast.error('Failed to load onboarding status');
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  const handleStepComplete = async (stepData: any) => {
    try {
      setIsLoading(true);
      const user = await OnboardingModel.getCurrentUser();
      if (!user) throw new Error('No user found');

      const newData = { ...formData, ...stepData };
      setFormData(newData);

      // Update step in database
      const { error } = await OnboardingModel.updateStatus(
        user.id,
        'in_progress',
        currentStep + 1,
        newData
      );

      if (error) throw error;

      if (currentStep === 5) {
        // Final step - complete onboarding
        const success = await OnboardingModel.completeOnboarding(user.id, newData);
        if (!success) throw new Error('Failed to complete onboarding');

        toast.success('Onboarding completed!');
        router.push('/dashboard');
      } else {
        setCurrentStep(prev => prev + 1);
      }

    } catch (error) {
      console.error('Error completing step:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (formData: FormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to complete onboarding');
        return;
      }

      // Update profile with onboarding data
      const success = await OnboardingModel.completeOnboarding(user.id, formData);
      if (!success) {
        toast.error('Failed to complete setup');
        return;
      }

      // Show success message
      toast.success('Setup completed successfully!');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing setup:', error);
      toast.error('Failed to complete setup');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Basic Information
              </span>
            </h2>

            <div className="form-group">
              <label>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-medium">
                  First Name <span className="required">*</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
                className="w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                         hover:border-purple-500/40 focus:border-purple-500 
                         transition-all duration-300 ease-in-out
                         text-white placeholder-gray-500
                         focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                placeholder="Enter your first name"
              />
            </div>

            <div className="form-group">
              <label>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-medium">
                  Last Name <span className="required">*</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
                className="w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                         hover:border-purple-500/40 focus:border-purple-500 
                         transition-all duration-300 ease-in-out
                         text-white placeholder-gray-500
                         focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                placeholder="Enter your last name"
              />
            </div>

            <div className="form-group">
              <label>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-medium">
                  Username <span className="required">*</span>
                </span>
                <span className="text-sm text-purple-400 ml-2">
                  (Letters, numbers, - and _ only)
                </span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                required
                className={`w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                         hover:border-purple-500/40 focus:border-purple-500 
                         transition-all duration-300 ease-in-out
                         text-white placeholder-gray-500
                         focus:ring-2 focus:ring-purple-500/20 focus:outline-none
                         ${usernameError ? 'border-red-500' : ''}`}
                placeholder="Choose a unique username"
              />
              {isCheckingUsername && (
                <small className="text-purple-400">Checking username availability...</small>
              )}
              {usernameError && (
                <small className="text-red-400">{usernameError}</small>
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => handleStepComplete(formData)}
                disabled={!formData.firstName || !formData.lastName || !formData.username || Boolean(usernameError)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                         rounded-lg font-medium text-white hover:opacity-90 
                         transition-opacity disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Contact Information
              </span>
            </h2>

            <div className="form-group">
              <label>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-medium">
                  Country <span className="required">*</span>
                </span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                required
                className="w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                         hover:border-purple-500/40 focus:border-purple-500 
                         transition-all duration-300 ease-in-out
                         text-white
                         focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              >
                <option value="" disabled>Select your country...</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-medium">
                  Phone Number <span className="required">*</span>
                </span>
              </label>
              <div className="flex gap-3">
                <select
                  value={formData.countryCode}
                  onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                  className="w-28 bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-2 py-3
                           hover:border-purple-500/40 focus:border-purple-500 
                           transition-all duration-300 ease-in-out text-white
                           focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                >
                  {countryCodes.map(({ code, country }) => (
                    <option key={code} value={code}>
                      {code} {country}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    // Only allow numbers and basic formatting characters
                    const value = e.target.value.replace(/[^\d\s()-]/g, '')
                    setFormData({...formData, phoneNumber: value})
                  }}
                  required
                  className="flex-1 bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                           hover:border-purple-500/40 focus:border-purple-500 
                           transition-all duration-300 ease-in-out
                           text-white placeholder-gray-500
                           focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-medium">
                  Postal/ZIP Code <span className="required">*</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => {
                  // Allow letters and numbers for international postal codes
                  const value = e.target.value.replace(/[^a-zA-Z0-9\s-]/g, '')
                  setFormData({...formData, postalCode: value.toUpperCase()})
                }}
                required
                className="w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                         hover:border-purple-500/40 focus:border-purple-500 
                         transition-all duration-300 ease-in-out
                         text-white placeholder-gray-500
                         focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                placeholder="Enter your postal/ZIP code"
                maxLength={10}
              />
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-gray-700 rounded-lg font-medium 
                         text-gray-300 hover:border-purple-500 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => handleStepComplete(formData)}
                disabled={!formData.country || !formData.phoneNumber || !formData.postalCode}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                         rounded-lg font-medium text-white hover:opacity-90 
                         transition-opacity disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Research Interests
              </span>
            </h2>

            <div className="form-group">
              <label>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-medium">
                  Topics of Interest <span className="required">*</span>
                </span>
                <span className="text-sm text-purple-400 ml-2">
                  ({formData.researchInterests?.length || 0}/10 selected)
                </span>
              </label>

              {/* Search Bar */}
              <div className="search-bar mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search topics..."
                  className="w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-2
                           hover:border-purple-500/40 focus:border-purple-500 
                           transition-all duration-300 ease-in-out text-white"
                />
              </div>

              {/* Accordion Categories */}
              <div className="topics-accordion space-y-3">
                {Object.entries(topicCategories).map(([category, { icon, topics }]) => {
                  const filteredTopics = searchTerm
                    ? topics.filter(topic => 
                        topic.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                    : topics;
                  
                  if (searchTerm && filteredTopics.length === 0) return null;

                  const selectedCount = topics.filter(t => 
                    formData.researchInterests?.includes(t)
                  ).length;
                  
                  return (
                    <div key={category} className="category-section">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className="w-full flex items-center justify-between p-3 
                                  bg-[#1C1C1E] border border-purple-500/20 rounded-lg
                                  hover:border-purple-500/40 transition-all duration-300"
                      >
                        <div className="flex items-center gap-2">
                          <span>{icon}</span>
                          <span className="font-medium">{category}</span>
                          <span className="text-sm text-purple-400">
                            ({selectedCount})
                          </span>
                        </div>
                        <i className={`fas fa-chevron-${categoryStates[category]?.isOpen ? 'up' : 'down'}`}></i>
                      </button>
                      
                      {categoryStates[category]?.isOpen && (
                        <div className="mt-2 grid grid-cols-2 gap-2 p-2">
                          {filteredTopics.map((topic) => {
                            const isSelected = formData.researchInterests?.includes(topic);
                            const isDisabled = !isSelected && 
                              (formData.researchInterests?.length || 0) >= 10;

                            return (
                              <button
                                key={topic}
                                type="button"
                                onClick={() => {
                                  const currentInterests = formData.researchInterests || [];
                                  const newInterests = isSelected
                                    ? currentInterests.filter(t => t !== topic)
                                    : currentInterests.length < 10 
                                      ? [...currentInterests, topic]
                                      : currentInterests;
                                
                                  setFormData(prev => ({
                                    ...prev,
                                    researchInterests: newInterests
                                  }));
                                }}
                                className={`p-2 text-sm rounded-lg border transition-all duration-300
                                          ${isSelected 
                                            ? 'border-purple-500 bg-purple-500/20 text-white' 
                                            : 'border-gray-700 text-gray-400 hover:border-purple-500/40'}
                                          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                disabled={isDisabled}
                              >
                                {topic}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-gray-700 rounded-lg font-medium 
                         text-gray-300 hover:border-purple-500 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => handleStepComplete(formData)}
                disabled={!formData.researchInterests || formData.researchInterests.length < 3}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                         rounded-lg font-medium text-white hover:opacity-90 
                         transition-opacity disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Research Preferences
              </span>
            </h2>

            <div className="form-group">
              <label>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-medium">
                  Research Goals <span className="required">*</span>
                </span>
              </label>
              <textarea
                value={formData.researchGoals}
                onChange={(e) => setFormData({...formData, researchGoals: e.target.value})}
                required
                className="w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                         hover:border-purple-500/40 focus:border-purple-500 
                         transition-all duration-300 ease-in-out
                         text-white placeholder-gray-500
                         focus:ring-2 focus:ring-purple-500/20 focus:outline-none
                         resize-none h-32"
                placeholder="What are your main research objectives?"
              />
            </div>

            <div className="form-group">
              <label>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-medium">
                  One Thing to Find <span className="required">*</span>
                </span>
              </label>
              <textarea
                value={formData.oneThingToFind}
                onChange={(e) => setFormData({...formData, oneThingToFind: e.target.value})}
                required
                className="w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                         hover:border-purple-500/40 focus:border-purple-500 
                         transition-all duration-300 ease-in-out
                         text-white placeholder-gray-500
                         focus:ring-2 focus:ring-purple-500/20 focus:outline-none
                         resize-none h-24"
                placeholder="What's one specific thing you want to discover using URA?"
              />
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-gray-700 rounded-lg font-medium 
                         text-gray-300 hover:border-purple-500 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => handleStepComplete(formData)}
                disabled={!formData.researchGoals || !formData.oneThingToFind}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                         rounded-lg font-medium text-white hover:opacity-90 
                         transition-opacity disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 5:
        // Find country name from code
        const selectedCountry = countries.find(c => c.code === formData.country)?.name || formData.country;
        
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Review Your Information
              </span>
            </h2>

            <div className="space-y-6 bg-[#1C1C1E] border border-purple-500/20 rounded-lg p-6">
              <div>
                <h3 className="text-lg font-medium mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Personal Information
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p><span className="text-gray-400">Name:</span> {formData.firstName} {formData.lastName}</p>
                  <p><span className="text-gray-400">Username:</span> {formData.username}</p>
                  <p><span className="text-gray-400">Country:</span> {selectedCountry}</p>
                  <p><span className="text-gray-400">Phone:</span> {formData.countryCode} {formData.phoneNumber}</p>
                  <p><span className="text-gray-400">Postal Code:</span> {formData.postalCode}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Research Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.researchInterests?.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 
                               rounded-full text-sm text-purple-300"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Research Goals
                </h3>
                <p className="text-gray-300">{formData.researchGoals}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  One Thing to Find
                </h3>
                <p className="text-gray-300">{formData.oneThingToFind}</p>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-gray-700 rounded-lg font-medium 
                         text-gray-300 hover:border-purple-500 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => handleComplete(formData)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                         rounded-lg font-medium text-white hover:opacity-90 
                         transition-opacity"
              >
                Complete Setup
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const checkUsername = debounce(async (username: string) => {
    if (!username.trim()) return
  
    // Check for profanity
    if (containsProfanity(username)) {
      setUsernameError('Username contains inappropriate content')
      return
    }
  
    // Sanitize username
    const sanitized = sanitizeUsername(username)
    if (sanitized !== username) {
      setUsernameError('Username can only contain letters, numbers, hyphens and underscores')
      return
    }

    // Reset error if we've made it past the initial checks
    setUsernameError('')

    setIsCheckingUsername(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking username:', error)
        return
      }
      
      if (data) {
        setUsernameError('This username is already taken')
      }
    } catch (error) {
      console.error('Error checking username:', error)
    } finally {
      setIsCheckingUsername(false)
    }
  }, 500)

  const handleUsernameChange = (value: string) => {
    // Only update if the value is valid
    if (/^[a-zA-Z0-9-_]*$/.test(value)) {
      setFormData({...formData, username: value})
      // Reset error when input changes
      setUsernameError('')
      checkUsername(value)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Setup Your Account | URA</title>
      </Head>

      <div className="min-h-screen bg-black text-white">
        {/* Progress bar */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        <div className="max-w-2xl mx-auto px-4 py-12">
          {renderStep()}
        </div>

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 p-4 bg-gray-900 rounded-lg text-xs max-w-xs overflow-auto">
            <pre>{JSON.stringify({ currentStep, formData }, null, 2)}</pre>
          </div>
        )}
      </div>
    </>
  );
};

export default OnboardingPage 