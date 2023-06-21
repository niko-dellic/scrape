// extract only words from the blurb and remove duplicates"
// const words = blurb.split(/[\s,]+/).filter((word) => word.length > 1);
// const uniqueWords = [...new Set(words)];
// console.dir(uniqueWords, { maxArrayLength: null });

// prettier-ignore
const uniqueWords = [
    'redevelopment',  'climate',         'resilience',      'integrated',
    'infrastructure', 'rezoning',        'urban',           'park',
    'nature',         'community',       'government',      'funding',
    'planning',       'health',          'cities',          'population',
    'distribution',   'environment',     'policy',          'science',
    'statistics',     'transportation',  'autonomous',      'vehicles',
    'zones',          'mobility',        'industry',        'economy',
    'suburban',       'material',        'consumption',     'waste',
    'environmental',  'damage',          'extraction',      'manufacturing',
    'shipping',       'sustainability',  'development',     'investments',
    'social',         'justice',         'capital',         'accumulation',
    'capabilities',   'city',            'versus',          'suburbs',
    'informal',       'settlements',     'self-produced',   'housing',
    'architecture',   'investing',       'impact',          'assessment',
    'job',            'creation',        'affordable',      'small',
    'business',       'revitalization',  'economic',        'sustainable',
    'data',           'design',          'tools',           'mapping',
    'life',           'quantitative',    'qualitative',     'lighting',
    'patterns',       'attractors',      'street',          'lights',
    'digital',        'technologies',    'global',          'collection',
    'self',           'learning',        'systems',         'usage',
    'behavior',       'modeling',        'machine',         'algorithm',
    'ai',             'user-generated',  'cdr',             'pattern',
    'stay',           'region',          'energy',          'efficiency',
    'smart',          'sensors',         'outlier',         'detection',
    'big',            'effiency',        'guidelines',      'stormwater',
    'wetlands',       'water',           'management',      'green',
    'carbon',         'emissions',       'arid',            'rural',
    'china',          'urbanization',    'models',          'coastal',
    'technological',  'ecology',         'resiliency',      'real-state',
    'reclaimed',      'land',            'ecological',      'paradigms',
    'law',            'process-driven',  'suburbanization', 'change',
    'technology',     'affordability',   'peripheries',     'metabolic',
    'wastebelts',     'suburbia',        'recycling',       'resource',
    'utilization',    'infrastructural', 'monument',        'large-scale',
    'functional',     'aesthetics',      'landmark',        'cultural',
    'significance',   'public',          'works',           'dynamic',
    'simulation',     'neighborhoods',   'density',         'optimization', 
    'artificial intelligence'  
]

const urbanWords = [
  "Cities",
  "Urban",
  "Suburban",
  "Metropolitan",
  "Rural",
  "Urbanization",
  "Urbanism",
  "Architecture",
  "Urban Planning",
  "Urban Design",
  "Design",
  "Geography",
  "infrastructure",
];

const climateQueries = [
  "sustainability",
  "energy",
  "carbon",
  "climate change",
  "ecology",
  "environment",
  "green",
  "migration",
];

const techQueries = [
  "technology",
  "artificial intelligence",
  "machine learning",
  "data",
  "big data",
  "digital",
  "smart",
  "sensors",
  "internet of things",
  "autonomous",
  "ai",
  "simulation",
];

const apiKey = "AWF1gyFILLsnI1joPOQ9KNZxCve1GafR";

// create a function to export the search results to a json
function exportToJsonFile(dir, name, jsonData) {
  const fs = require("fs");
  let dataStr = JSON.stringify(jsonData);
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  // write the json to a file
  fs.writeFile(`${dir}/${name}.json`, dataStr, (err) => {
    if (err) {
      console.log(err);
    } else {
      //   console.log("file written successfully");
    }
  });
}

// // perform an an article search using the New York Times API and return the results
function searchArticles(
  key,
  searchTerm,
  numRecords,
  startYear,
  yearInterval = 3
) {
  // fetch the articles from the NYT API using the search term and the optional start and end years
  //   add search queries related to the LCAU etc
  let searchQueries = techQueries.join('","');

  searchQueries = String('"') + searchQueries + String('"');
  let termPopularityTrend = [];

  //   create a range of years from the start date to the current year
  let years = [];
  let currentYear = new Date().getFullYear();

  for (let i = startYear; i <= currentYear; i++) {
    if (i % yearInterval == 0) {
      years.push(String(i));
    }
  }

  const searchResults = {
    headlineWords: searchQueries,
  };

  //   iteracte through the years
  years.forEach((year, index) => {
    setTimeout(() => {
      const response = fetch(
        `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchTerm}&begin_date=${year}0101&end_date=${year}1231&api-key=${key}&fq=headline:(
                  ${searchQueries})&sort=oldest`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          // extract the articles from the response
          const resultCount = data.response.meta.hits
            ? data.response.meta.hits
            : "null";

          termPopularityTrend.push({
            year: year,
            resultCount: resultCount,
          });

          let articles = data.response.docs.filter((article) => {
            return article.document_type === "article";
          });

          const articlesRequested = articles.slice(
            0,
            numRecords ? numRecords : 10
          );

          // extract the article titles and urls
          const articleTitlesAndUrls = articlesRequested.map((article) => {
            return {
              title: article.headline.main,
              author: article.byline.original,
              person: article.byline.person,
              url: article.web_url,
              abstract: article.abstract,
              pub_date: article.pub_date,
              keywords: article.keywords
                .map((keyword) => [
                  "rank:",
                  keyword.rank,
                  keyword.name,
                  keyword.value,
                ])
                .flat(),
              document_type: article.document_type,
              news_desk: article.news_desk,
              section_name: article.section_name,
            };
          });

          // return the article titles and urls
          //   console.log(articleTitlesAndUrls);

          searchResults[year] = {
            count: resultCount,
            items: articleTitlesAndUrls,
          };

          console.log(searchTerm, resultCount);

          //   if the last loop, console log the term popularity trend
          if (index === years.length - 1) {
            console.log(termPopularityTrend);
            console.log(searchResults);
            exportToJsonFile(
              "./technology",
              `${years[0]}-${years[years.length - 1]}-${searchTerm}-nyt`,
              searchResults
            );
            return searchResults;
          }
        })
        .catch((error) => {
          console.log("error");
          console.log(error);
        });
    }, index * 35000);
  });
}

// searchArticles(
//   apiKey,
//   "sustainability",
//   (numRecords = 10),
//   (startYear = "2013")
// );

// uniqueWords.forEach((searchTerm, index) => {
//   // wait 12 seconds between each search to avoid hitting the API rate limit
//   setTimeout(() => {
//     searchArticles(apiKey, searchTerm, (numRecords = 5), (startYear = "2013"));
//   }, index * 4 * 12000);
// });

climateQueries.forEach((searchTerm, index) => {
  // wait 12 seconds between each search to avoid hitting the API rate limit
  setTimeout(() => {
    searchArticles(
      apiKey,
      searchTerm,
      (numRecords = 10),
      (startYear = "2013"),
      (yearInterval = 1)
    );
  }, index * 4 * 35000);
});
