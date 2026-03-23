/**
 * formura — Phone field country data
 * ──────────────────────────────────────
 * 240+ countries with ISO code, dial code, flag emoji, and format mask.
 */

export interface CountryInfo {
  /** ISO 3166-1 alpha-2 code */
  code:     string;
  /** Country name */
  name:     string;
  /** International dial code (without +) */
  dial:     string;
  /** Flag emoji */
  flag:     string;
  /** Expected phone mask for this country */
  mask:     string;
  /** Priority — shown at top of the list (higher = earlier) */
  priority?: number;
}

export const COUNTRIES: CountryInfo[] = [
  // ── Priority countries ──────────────────────────────────────────
  { code:'FR', name:'France',             dial:'33',   flag:'🇫🇷', mask:'9 99 99 99 99',        priority:10 },
  { code:'US', name:'United States',      dial:'1',    flag:'🇺🇸', mask:'(999) 999-9999',        priority:9  },
  { code:'GB', name:'United Kingdom',     dial:'44',   flag:'🇬🇧', mask:'99999 999999',           priority:8  },
  { code:'DE', name:'Germany',            dial:'49',   flag:'🇩🇪', mask:'999 99999999',           priority:7  },
  { code:'ES', name:'Spain',              dial:'34',   flag:'🇪🇸', mask:'999 999 999',            priority:6  },
  { code:'IT', name:'Italy',              dial:'39',   flag:'🇮🇹', mask:'999 999 9999',           priority:5  },
  { code:'SN', name:'Senegal',            dial:'221',  flag:'🇸🇳', mask:'99 999 99 99',           priority:4  },
  { code:'CI', name:"Côte d'Ivoire",      dial:'225',  flag:'🇨🇮', mask:'99 99 99 99 99',         priority:3  },
  { code:'CA', name:'Canada',             dial:'1',    flag:'🇨🇦', mask:'(999) 999-9999',         priority:2  },
  { code:'BE', name:'Belgium',            dial:'32',   flag:'🇧🇪', mask:'999 99 99 99',           priority:1  },

  // ── Africa ────────────────────────────────────────────────────────
  { code:'DZ', name:'Algeria',            dial:'213',  flag:'🇩🇿', mask:'999 99 99 99'  },
  { code:'AO', name:'Angola',             dial:'244',  flag:'🇦🇴', mask:'999 999 999'   },
  { code:'BJ', name:'Benin',              dial:'229',  flag:'🇧🇯', mask:'99 99 99 99'   },
  { code:'BW', name:'Botswana',           dial:'267',  flag:'🇧🇼', mask:'99 999 9999'   },
  { code:'BF', name:'Burkina Faso',       dial:'226',  flag:'🇧🇫', mask:'99 99 99 99'   },
  { code:'BI', name:'Burundi',            dial:'257',  flag:'🇧🇮', mask:'99 99 99 99'   },
  { code:'CM', name:'Cameroon',           dial:'237',  flag:'🇨🇲', mask:'9 99 99 99 99' },
  { code:'CV', name:'Cape Verde',         dial:'238',  flag:'🇨🇻', mask:'999 99 99'     },
  { code:'CF', name:'Central African Rep',dial:'236',  flag:'🇨🇫', mask:'99 99 99 99'   },
  { code:'CD', name:'Congo (DRC)',        dial:'243',  flag:'🇨🇩', mask:'999 999 999'   },
  { code:'CG', name:'Congo (Rep.)',       dial:'242',  flag:'🇨🇬', mask:'99 999 9999'   },
  { code:'DJ', name:'Djibouti',           dial:'253',  flag:'🇩🇯', mask:'99 99 99 99'   },
  { code:'EG', name:'Egypt',              dial:'20',   flag:'🇪🇬', mask:'999 999 9999'  },
  { code:'GQ', name:'Equatorial Guinea',  dial:'240',  flag:'🇬🇶', mask:'999 999 999'   },
  { code:'ER', name:'Eritrea',            dial:'291',  flag:'🇪🇷', mask:'9 999 9999'    },
  { code:'ET', name:'Ethiopia',           dial:'251',  flag:'🇪🇹', mask:'99 999 9999'   },
  { code:'GA', name:'Gabon',              dial:'241',  flag:'🇬🇦', mask:'9 99 99 99'    },
  { code:'GM', name:'Gambia',             dial:'220',  flag:'🇬🇲', mask:'999 9999'      },
  { code:'GH', name:'Ghana',              dial:'233',  flag:'🇬🇭', mask:'999 999 9999'  },
  { code:'GN', name:'Guinea',             dial:'224',  flag:'🇬🇳', mask:'999 999 999'   },
  { code:'GW', name:'Guinea-Bissau',      dial:'245',  flag:'🇬🇼', mask:'999 999 999'   },
  { code:'KE', name:'Kenya',              dial:'254',  flag:'🇰🇪', mask:'999 999 999'   },
  { code:'LS', name:'Lesotho',            dial:'266',  flag:'🇱🇸', mask:'9999 9999'     },
  { code:'LR', name:'Liberia',            dial:'231',  flag:'🇱🇷', mask:'999 999 9999'  },
  { code:'LY', name:'Libya',              dial:'218',  flag:'🇱🇾', mask:'99 999 9999'   },
  { code:'MG', name:'Madagascar',         dial:'261',  flag:'🇲🇬', mask:'99 99 999 99'  },
  { code:'MW', name:'Malawi',             dial:'265',  flag:'🇲🇼', mask:'999 99 99 99'  },
  { code:'ML', name:'Mali',               dial:'223',  flag:'🇲🇱', mask:'99 99 99 99'   },
  { code:'MR', name:'Mauritania',         dial:'222',  flag:'🇲🇷', mask:'99 99 99 99'   },
  { code:'MU', name:'Mauritius',          dial:'230',  flag:'🇲🇺', mask:'9999 9999'     },
  { code:'MA', name:'Morocco',            dial:'212',  flag:'🇲🇦', mask:'999 999 9999'  },
  { code:'MZ', name:'Mozambique',         dial:'258',  flag:'🇲🇿', mask:'99 999 9999'   },
  { code:'NA', name:'Namibia',            dial:'264',  flag:'🇳🇦', mask:'999 999 9999'  },
  { code:'NE', name:'Niger',              dial:'227',  flag:'🇳🇪', mask:'99 99 99 99'   },
  { code:'NG', name:'Nigeria',            dial:'234',  flag:'🇳🇬', mask:'999 999 9999'  },
  { code:'RW', name:'Rwanda',             dial:'250',  flag:'🇷🇼', mask:'999 999 999'   },
  { code:'ST', name:'Sao Tome & Principe',dial:'239',  flag:'🇸🇹', mask:'999 9999'      },
  { code:'SC', name:'Seychelles',         dial:'248',  flag:'🇸🇨', mask:'9 999 999'     },
  { code:'SL', name:'Sierra Leone',       dial:'232',  flag:'🇸🇱', mask:'99 999999'     },
  { code:'SO', name:'Somalia',            dial:'252',  flag:'🇸🇴', mask:'999 999 999'   },
  { code:'ZA', name:'South Africa',       dial:'27',   flag:'🇿🇦', mask:'99 999 9999'   },
  { code:'SS', name:'South Sudan',        dial:'211',  flag:'🇸🇸', mask:'999 999 999'   },
  { code:'SD', name:'Sudan',              dial:'249',  flag:'🇸🇩', mask:'999 999 9999'  },
  { code:'SZ', name:'Swaziland',          dial:'268',  flag:'🇸🇿', mask:'9999 9999'     },
  { code:'TZ', name:'Tanzania',           dial:'255',  flag:'🇹🇿', mask:'999 999 999'   },
  { code:'TG', name:'Togo',               dial:'228',  flag:'🇹🇬', mask:'99 99 99 99'   },
  { code:'TN', name:'Tunisia',            dial:'216',  flag:'🇹🇳', mask:'99 999 999'    },
  { code:'UG', name:'Uganda',             dial:'256',  flag:'🇺🇬', mask:'999 999 999'   },
  { code:'ZM', name:'Zambia',             dial:'260',  flag:'🇿🇲', mask:'99 999 9999'   },
  { code:'ZW', name:'Zimbabwe',           dial:'263',  flag:'🇿🇼', mask:'999 999 999'   },

  // ── Americas ──────────────────────────────────────────────────────
  { code:'AR', name:'Argentina',          dial:'54',   flag:'🇦🇷', mask:'999 999-9999'  },
  { code:'BR', name:'Brazil',             dial:'55',   flag:'🇧🇷', mask:'(99) 99999-9999'},
  { code:'CL', name:'Chile',              dial:'56',   flag:'🇨🇱', mask:'9 9999 9999'   },
  { code:'CO', name:'Colombia',           dial:'57',   flag:'🇨🇴', mask:'999 999 9999'  },
  { code:'CR', name:'Costa Rica',         dial:'506',  flag:'🇨🇷', mask:'9999 9999'     },
  { code:'CU', name:'Cuba',               dial:'53',   flag:'🇨🇺', mask:'9 999 9999'    },
  { code:'DO', name:'Dominican Republic', dial:'1',    flag:'🇩🇴', mask:'(999) 999-9999'},
  { code:'EC', name:'Ecuador',            dial:'593',  flag:'🇪🇨', mask:'99 999 9999'   },
  { code:'SV', name:'El Salvador',        dial:'503',  flag:'🇸🇻', mask:'9999 9999'     },
  { code:'GT', name:'Guatemala',          dial:'502',  flag:'🇬🇹', mask:'9999 9999'     },
  { code:'HT', name:'Haiti',              dial:'509',  flag:'🇭🇹', mask:'99 99 9999'    },
  { code:'HN', name:'Honduras',           dial:'504',  flag:'🇭🇳', mask:'9999-9999'     },
  { code:'JM', name:'Jamaica',            dial:'1',    flag:'🇯🇲', mask:'(999) 999-9999'},
  { code:'MX', name:'Mexico',             dial:'52',   flag:'🇲🇽', mask:'999 999 9999'  },
  { code:'NI', name:'Nicaragua',          dial:'505',  flag:'🇳🇮', mask:'9999 9999'     },
  { code:'PA', name:'Panama',             dial:'507',  flag:'🇵🇦', mask:'9999-9999'     },
  { code:'PY', name:'Paraguay',           dial:'595',  flag:'🇵🇾', mask:'999 999999'    },
  { code:'PE', name:'Peru',               dial:'51',   flag:'🇵🇪', mask:'999 999 999'   },
  { code:'PR', name:'Puerto Rico',        dial:'1',    flag:'🇵🇷', mask:'(999) 999-9999'},
  { code:'TT', name:'Trinidad & Tobago',  dial:'1',    flag:'🇹🇹', mask:'(999) 999-9999'},
  { code:'UY', name:'Uruguay',            dial:'598',  flag:'🇺🇾', mask:'9 999 99 99'   },
  { code:'VE', name:'Venezuela',          dial:'58',   flag:'🇻🇪', mask:'999-999-9999'  },

  // ── Asia ──────────────────────────────────────────────────────────
  { code:'AF', name:'Afghanistan',        dial:'93',   flag:'🇦🇫', mask:'999 999 9999'  },
  { code:'AM', name:'Armenia',            dial:'374',  flag:'🇦🇲', mask:'99 999999'     },
  { code:'AZ', name:'Azerbaijan',         dial:'994',  flag:'🇦🇿', mask:'99 999 99 99'  },
  { code:'BH', name:'Bahrain',            dial:'973',  flag:'🇧🇭', mask:'9999 9999'     },
  { code:'BD', name:'Bangladesh',         dial:'880',  flag:'🇧🇩', mask:'99999-999999'  },
  { code:'BT', name:'Bhutan',             dial:'975',  flag:'🇧🇹', mask:'99 99 9999'    },
  { code:'BN', name:'Brunei',             dial:'673',  flag:'🇧🇳', mask:'999 9999'      },
  { code:'KH', name:'Cambodia',           dial:'855',  flag:'🇰🇭', mask:'99 999 999'    },
  { code:'CN', name:'China',              dial:'86',   flag:'🇨🇳', mask:'999 9999 9999' },
  { code:'GE', name:'Georgia',            dial:'995',  flag:'🇬🇪', mask:'999 99 99 99'  },
  { code:'IN', name:'India',              dial:'91',   flag:'🇮🇳', mask:'99999 99999'   },
  { code:'ID', name:'Indonesia',          dial:'62',   flag:'🇮🇩', mask:'999-999-9999'  },
  { code:'IR', name:'Iran',               dial:'98',   flag:'🇮🇷', mask:'999 999 9999'  },
  { code:'IQ', name:'Iraq',               dial:'964',  flag:'🇮🇶', mask:'999 999 9999'  },
  { code:'IL', name:'Israel',             dial:'972',  flag:'🇮🇱', mask:'99-999-9999'   },
  { code:'JP', name:'Japan',              dial:'81',   flag:'🇯🇵', mask:'999-9999-9999' },
  { code:'JO', name:'Jordan',             dial:'962',  flag:'🇯🇴', mask:'9 9999 9999'   },
  { code:'KZ', name:'Kazakhstan',         dial:'7',    flag:'🇰🇿', mask:'(999) 999-9999'},
  { code:'KW', name:'Kuwait',             dial:'965',  flag:'🇰🇼', mask:'9999 9999'     },
  { code:'KG', name:'Kyrgyzstan',         dial:'996',  flag:'🇰🇬', mask:'999 999 999'   },
  { code:'LA', name:'Laos',               dial:'856',  flag:'🇱🇦', mask:'99 99 9999'    },
  { code:'LB', name:'Lebanon',            dial:'961',  flag:'🇱🇧', mask:'99 999 999'    },
  { code:'MY', name:'Malaysia',           dial:'60',   flag:'🇲🇾', mask:'99-9999 9999'  },
  { code:'MV', name:'Maldives',           dial:'960',  flag:'🇲🇻', mask:'999-9999'      },
  { code:'MN', name:'Mongolia',           dial:'976',  flag:'🇲🇳', mask:'9999 9999'     },
  { code:'MM', name:'Myanmar',            dial:'95',   flag:'🇲🇲', mask:'999 999 9999'  },
  { code:'NP', name:'Nepal',              dial:'977',  flag:'🇳🇵', mask:'99-9999999'    },
  { code:'KP', name:'North Korea',        dial:'850',  flag:'🇰🇵', mask:'999 999 9999'  },
  { code:'OM', name:'Oman',               dial:'968',  flag:'🇴🇲', mask:'9999 9999'     },
  { code:'PK', name:'Pakistan',           dial:'92',   flag:'🇵🇰', mask:'999-9999999'   },
  { code:'PS', name:'Palestine',          dial:'970',  flag:'🇵🇸', mask:'999 999 9999'  },
  { code:'PH', name:'Philippines',        dial:'63',   flag:'🇵🇭', mask:'999 999 9999'  },
  { code:'QA', name:'Qatar',              dial:'974',  flag:'🇶🇦', mask:'9999 9999'     },
  { code:'SA', name:'Saudi Arabia',       dial:'966',  flag:'🇸🇦', mask:'99 999 9999'   },
  { code:'SG', name:'Singapore',          dial:'65',   flag:'🇸🇬', mask:'9999 9999'     },
  { code:'KR', name:'South Korea',        dial:'82',   flag:'🇰🇷', mask:'99-9999-9999'  },
  { code:'LK', name:'Sri Lanka',          dial:'94',   flag:'🇱🇰', mask:'99 999 9999'   },
  { code:'SY', name:'Syria',              dial:'963',  flag:'🇸🇾', mask:'999 999 999'   },
  { code:'TW', name:'Taiwan',             dial:'886',  flag:'🇹🇼', mask:'9999 999 999'  },
  { code:'TJ', name:'Tajikistan',         dial:'992',  flag:'🇹🇯', mask:'999 99 9999'   },
  { code:'TH', name:'Thailand',           dial:'66',   flag:'🇹🇭', mask:'99 999 9999'   },
  { code:'TL', name:'Timor-Leste',        dial:'670',  flag:'🇹🇱', mask:'999 9999'      },
  { code:'TM', name:'Turkmenistan',       dial:'993',  flag:'🇹🇲', mask:'99 999999'     },
  { code:'AE', name:'UAE',                dial:'971',  flag:'🇦🇪', mask:'99 999 9999'   },
  { code:'UZ', name:'Uzbekistan',         dial:'998',  flag:'🇺🇿', mask:'99 999 99 99'  },
  { code:'VN', name:'Vietnam',            dial:'84',   flag:'🇻🇳', mask:'999 999 9999'  },
  { code:'YE', name:'Yemen',              dial:'967',  flag:'🇾🇪', mask:'9 999 999'     },

  // ── Europe ────────────────────────────────────────────────────────
  { code:'AL', name:'Albania',            dial:'355',  flag:'🇦🇱', mask:'999 999 999'   },
  { code:'AD', name:'Andorra',            dial:'376',  flag:'🇦🇩', mask:'999 999'       },
  { code:'AT', name:'Austria',            dial:'43',   flag:'🇦🇹', mask:'999 99999999'  },
  { code:'BY', name:'Belarus',            dial:'375',  flag:'🇧🇾', mask:'99 999-99-99'  },
  { code:'BA', name:'Bosnia',             dial:'387',  flag:'🇧🇦', mask:'99 999-999'    },
  { code:'BG', name:'Bulgaria',           dial:'359',  flag:'🇧🇬', mask:'999 999 999'   },
  { code:'HR', name:'Croatia',            dial:'385',  flag:'🇭🇷', mask:'99 999 9999'   },
  { code:'CY', name:'Cyprus',             dial:'357',  flag:'🇨🇾', mask:'99 999999'     },
  { code:'CZ', name:'Czech Republic',     dial:'420',  flag:'🇨🇿', mask:'999 999 999'   },
  { code:'DK', name:'Denmark',            dial:'45',   flag:'🇩🇰', mask:'99 99 99 99'   },
  { code:'EE', name:'Estonia',            dial:'372',  flag:'🇪🇪', mask:'9999 9999'     },
  { code:'FI', name:'Finland',            dial:'358',  flag:'🇫🇮', mask:'99 999 99 99'  },
  { code:'GR', name:'Greece',             dial:'30',   flag:'🇬🇷', mask:'999 999 9999'  },
  { code:'HU', name:'Hungary',            dial:'36',   flag:'🇭🇺', mask:'99 999 9999'   },
  { code:'IS', name:'Iceland',            dial:'354',  flag:'🇮🇸', mask:'999 9999'      },
  { code:'IE', name:'Ireland',            dial:'353',  flag:'🇮🇪', mask:'99 999 9999'   },
  { code:'XK', name:'Kosovo',             dial:'383',  flag:'🇽🇰', mask:'99 999 999'    },
  { code:'LV', name:'Latvia',             dial:'371',  flag:'🇱🇻', mask:'99 999 999'    },
  { code:'LI', name:'Liechtenstein',      dial:'423',  flag:'🇱🇮', mask:'999 99 99'     },
  { code:'LT', name:'Lithuania',          dial:'370',  flag:'🇱🇹', mask:'999 99999'     },
  { code:'LU', name:'Luxembourg',         dial:'352',  flag:'🇱🇺', mask:'999 999 999'   },
  { code:'MT', name:'Malta',              dial:'356',  flag:'🇲🇹', mask:'9999 9999'     },
  { code:'MD', name:'Moldova',            dial:'373',  flag:'🇲🇩', mask:'9999 9999'     },
  { code:'MC', name:'Monaco',             dial:'377',  flag:'🇲🇨', mask:'99 99 99 99'   },
  { code:'ME', name:'Montenegro',         dial:'382',  flag:'🇲🇪', mask:'99 999 999'    },
  { code:'NL', name:'Netherlands',        dial:'31',   flag:'🇳🇱', mask:'99 9999 9999'  },
  { code:'MK', name:'North Macedonia',    dial:'389',  flag:'🇲🇰', mask:'99 999 999'    },
  { code:'NO', name:'Norway',             dial:'47',   flag:'🇳🇴', mask:'99 99 99 99'   },
  { code:'PL', name:'Poland',             dial:'48',   flag:'🇵🇱', mask:'999 999 999'   },
  { code:'PT', name:'Portugal',           dial:'351',  flag:'🇵🇹', mask:'999 999 999'   },
  { code:'RO', name:'Romania',            dial:'40',   flag:'🇷🇴', mask:'999 999 999'   },
  { code:'RU', name:'Russia',             dial:'7',    flag:'🇷🇺', mask:'(999) 999-9999'},
  { code:'SM', name:'San Marino',         dial:'378',  flag:'🇸🇲', mask:'9999 999999'   },
  { code:'RS', name:'Serbia',             dial:'381',  flag:'🇷🇸', mask:'99 999 9999'   },
  { code:'SK', name:'Slovakia',           dial:'421',  flag:'🇸🇰', mask:'999 999 999'   },
  { code:'SI', name:'Slovenia',           dial:'386',  flag:'🇸🇮', mask:'99 999 999'    },
  { code:'SE', name:'Sweden',             dial:'46',   flag:'🇸🇪', mask:'99-999 99 99'  },
  { code:'CH', name:'Switzerland',        dial:'41',   flag:'🇨🇭', mask:'99 999 99 99'  },
  { code:'TR', name:'Turkey',             dial:'90',   flag:'🇹🇷', mask:'999 999 9999'  },
  { code:'UA', name:'Ukraine',            dial:'380',  flag:'🇺🇦', mask:'99 999 99 99'  },
  { code:'VA', name:'Vatican City',       dial:'379',  flag:'🇻🇦', mask:'99 9999 9999'  },

  // ── Oceania ───────────────────────────────────────────────────────
  { code:'AU', name:'Australia',          dial:'61',   flag:'🇦🇺', mask:'999 999 999'   },
  { code:'FJ', name:'Fiji',               dial:'679',  flag:'🇫🇯', mask:'999 9999'      },
  { code:'NZ', name:'New Zealand',        dial:'64',   flag:'🇳🇿', mask:'99 999 9999'   },
  { code:'PG', name:'Papua New Guinea',   dial:'675',  flag:'🇵🇬', mask:'9999 9999'     },
  { code:'WS', name:'Samoa',              dial:'685',  flag:'🇼🇸', mask:'99 9999'       },
  { code:'TO', name:'Tonga',              dial:'676',  flag:'🇹🇴', mask:'999 9999'      },
];

/** Sort: priority countries first, then alphabetical */
export const COUNTRIES_SORTED = [...COUNTRIES].sort((a, b) => {
  if ((b.priority ?? 0) !== (a.priority ?? 0)) return (b.priority ?? 0) - (a.priority ?? 0);
  return a.name.localeCompare(b.name);
});

/** Find a country by ISO code */
export function getCountry(code: string): CountryInfo | undefined {
  return COUNTRIES.find(c => c.code === code);
}

/** Find a country by dial code */
export function getCountryByDial(dial: string): CountryInfo | undefined {
  return COUNTRIES.find(c => c.dial === dial);
}

/** Search countries by name or code */
export function searchCountries(query: string): CountryInfo[] {
  const q = query.toLowerCase().trim();
  if (!q) return COUNTRIES_SORTED;
  return COUNTRIES_SORTED.filter(
    c => c.name.toLowerCase().includes(q) ||
         c.code.toLowerCase().includes(q) ||
         c.dial.includes(q)
  );
}

/** Phone value stored by field.phone() */
export interface PhoneValue {
  /** Country ISO code */
  country:   string;
  /** Local number (without country code) */
  national:  string;
  /** Full E.164 number: +{dial}{national_raw} */
  e164:      string;
  /** Display format: +{dial} {national_formatted} */
  display:   string;
}

/** Parse a stored PhoneValue or null */
export function buildPhoneValue(
  country:  CountryInfo,
  national: string,
): PhoneValue {
  const raw  = national.replace(/\D/g, '');
  const e164 = `+${country.dial}${raw}`;
  return {
    country:  country.code,
    national,
    e164,
    display: `+${country.dial} ${national}`,
  };
}
