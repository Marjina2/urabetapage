import { FC, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '@/lib/supabaseClient'
import { containsProfanity, sanitizeUsername } from '@/utils/profanityFilter'
import toast from 'react-hot-toast'
import { OnboardingModel, OnboardingData, onboardingEvents } from '@/models/OnboardingModel'
import { debounce } from 'lodash'
import { useUser } from '@/contexts/UserContext'
import Navigation from '@/components/Navigation'

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

const Onboarding: FC = () => {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
      return
    }
  
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', session.user.id)
        .single()
      
      if (profile?.onboarding_completed) {
        router.push('/dashboard')
      }
    }

    checkAuth()
  }, [router])

  return (
    <>
      <Head>
        <title>Onboarding | URA</title>
        <meta name="description" content="Complete your URA account setup" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <div className="relative z-50">
          <Navigation />
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-32">
          <div className="bg-[#13131A] rounded-3xl p-10">
            <h1 className="text-4xl font-bold mb-12 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Welcome to URA
            </h1>

            <div className="space-y-8">
              <p className="text-gray-400">
                Complete your profile setup to get started.
              </p>
              
              {/* Add your onboarding form/steps here */}
          </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Onboarding 