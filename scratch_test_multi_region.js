const REGIONS = {
  bihar_patna: {
    name: 'पटना मानक (Patna Standard - 5.5 हाथ)',
    districts: 'पटना, नालंदा, वैशाली, बक्सर, भोजपुर, जहानाबाद',
    hath: 5.5,
    sqftPerDhur: (5.5 * 1.5) ** 2, // 68.0625
    sqftPerKatha: ((5.5 * 1.5) ** 2) * 20, // 1361.25
    sqftPerBigha: ((5.5 * 1.5) ** 2) * 400, // 27225
    unitType: 'bihar'
  },
  bihar_patna_575: {
    name: 'पटना, भोजपुर, बक्सर ग्रामीण (5.75 हाथ)',
    districts: 'भोजपुर, बक्सर, रोहतास ग्रामीण',
    hath: 5.75,
    sqftPerDhur: (5.75 * 1.5) ** 2, // 74.414
    sqftPerKatha: ((5.75 * 1.5) ** 2) * 20, // 1488.28
    sqftPerBigha: ((5.75 * 1.5) ** 2) * 400, // 29765.6
    unitType: 'bihar'
  },
  bihar_gaya: {
    name: 'गया, नवादा, जहानाबाद, अरवल (5.5 हाथ)',
    districts: 'गया, नवादा, जहानाबाद, अरवल',
    hath: 5.5,
    sqftPerDhur: (5.5 * 1.5) ** 2,
    sqftPerKatha: ((5.5 * 1.5) ** 2) * 20,
    sqftPerBigha: ((5.5 * 1.5) ** 2) * 400,
    unitType: 'bihar'
  },
  bihar_muzaffarpur: {
    name: 'मुजफ्फरपुर, वैशाली, सीतामढ़ी (5.5 हाथ)',
    districts: 'मुजफ्फरपुर, वैशाली, सीतामढ़ी',
    hath: 5.5,
    sqftPerDhur: (5.5 * 1.5) ** 2,
    sqftPerKatha: ((5.5 * 1.5) ** 2) * 20,
    sqftPerBigha: ((5.5 * 1.5) ** 2) * 400,
    unitType: 'bihar'
  },
  bihar_mithila: {
    name: 'दरभंगा, मधुबनी, समस्तीपुर (6.0 हाथ)',
    districts: 'दरभंगा, मधुबनी, समस्तीपुर, बेगूसराय',
    hath: 6.0,
    sqftPerDhur: (6.0 * 1.5) ** 2, // 81
    sqftPerKatha: 81 * 20, // 1620
    sqftPerBigha: 81 * 400, // 32400
    unitType: 'bihar'
  },
  bihar_bhagalpur: {
    name: 'भागलपुर, बांका, मुंगेर (6.5 हाथ)',
    districts: 'भागलपुर, बांका, मुंगेर, खगड़िया, जमुई',
    hath: 6.5,
    sqftPerDhur: (6.5 * 1.5) ** 2, // 95.0625
    sqftPerKatha: 95.0625 * 20, // 1901.25
    sqftPerBigha: 95.0625 * 400, // 38025
    unitType: 'bihar'
  },
  bihar_champaran: {
    name: 'पूर्वी व पश्चिमी चंपारण (7.0 हाथ)',
    districts: 'पूर्वी चंपारण, पश्चिमी चंपारण, गोपालगंज, सीवान',
    hath: 7.0,
    sqftPerDhur: (7.0 * 1.5) ** 2, // 110.25
    sqftPerKatha: 110.25 * 20, // 2205
    sqftPerBigha: 110.25 * 400, // 44100
    unitType: 'bihar'
  },
  bihar_kosi: {
    name: 'पूर्णिया, कटिहार, सहरसा (6.0 हाथ)',
    districts: 'पूर्णिया, कटिहार, सहरसा, मधेपुरा, सुपौल, अररिया, किशनगंज',
    hath: 6.0,
    sqftPerDhur: (6.0 * 1.5) ** 2,
    sqftPerKatha: 1620,
    sqftPerBigha: 32400,
    unitType: 'bihar'
  },
  bihar_rohtas: {
    name: 'रोहतास, कैमूर, औरंगाबाद (5.0 हाथ)',
    districts: 'रोहतास, कैमूर, औरंगाबाद',
    hath: 5.0,
    sqftPerDhur: (5.0 * 1.5) ** 2, // 56.25
    sqftPerKatha: 56.25 * 20, // 1125
    sqftPerBigha: 56.25 * 400, // 22500
    unitType: 'bihar'
  },
  delhi_ncr: {
    name: 'दिल्ली / Delhi NCR',
    districts: 'Delhi, North Delhi, South Delhi, Dwarka',
    sqftPerBiswa: 453.75,
    sqftPerBigha: 9075,
    sqftPerKatha: 453.75,
    sqftPerDhur: 22.6875,
    unitType: 'delhi'
  },
  haryana_gurgaon: {
    name: 'गुड़गांव / हरियाणा (Killa-Kanal-Marla)',
    districts: 'Gurugram, Faridabad, Sonipat, Panipat, Karnal',
    sqftPerMarla: 272.25,
    sqftPerKanal: 5445,
    sqftPerKilla: 43560,
    sqftPerKatha: 1361.25,
    sqftPerDhur: 68.0625,
    unitType: 'haryana'
  },
  up_noida: {
    name: 'नोएडा, गाजियाबाद, लखनऊ (UP पक्का बीघा)',
    districts: 'Noida, Greater Noida, Ghaziabad, Lucknow, Meerut',
    sqftPerBiswa: 1361.25,
    sqftPerBigha: 27225,
    sqftPerKatha: 1361.25,
    sqftPerDhur: 68.0625,
    unitType: 'up_pucca'
  },
  up_kachha: {
    name: 'पश्चिमी उत्तर प्रदेश (UP कच्चा बीघा)',
    districts: 'Aligarh, Mathura, Agra, Bulandshahr',
    sqftPerBiswa: 453.75,
    sqftPerBigha: 9075,
    sqftPerKatha: 453.75,
    sqftPerDhur: 22.6875,
    unitType: 'up_kachha'
  },
  up_varanasi: {
    name: 'वाराणसी, गोरखपुर, प्रयागराज (पूर्वी UP पक्का बीघा)',
    districts: 'Varanasi, Gorakhpur, Prayagraj, Mirzapur',
    sqftPerBiswa: 1350,
    sqftPerBigha: 27000,
    sqftPerKatha: 1350,
    sqftPerDhur: 67.5,
    unitType: 'up_pucca'
  },
  jharkhand_ranchi: {
    name: 'रांची, जमशेदपुर, धनबाद (झारखंड)',
    districts: 'Ranchi, Jamshedpur, Dhanbad, Bokaro',
    sqftPerKatha: 1361.25,
    sqftPerDhur: 68.0625,
    sqftPerBigha: 27225,
    unitType: 'bihar'
  }
};

console.log('Total Regions Configured:', Object.keys(REGIONS).length);
Object.entries(REGIONS).forEach(([k, v]) => {
  console.log(`• ${v.name} -> 1 Katha/Biswa/Kanal: ${v.sqftPerKatha || v.sqftPerBiswa || v.sqftPerKanal} Sq.Ft | 1 Bigha/Killa: ${v.sqftPerBigha || v.sqftPerKilla} Sq.Ft`);
});
