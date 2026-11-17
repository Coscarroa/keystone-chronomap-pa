import {
  CountyRecord,
  HistoricalEra,
  PA_REGIONS,
  RegionId,
} from '../data/paCountiesData';
import { HistoricalEventItem } from '../data/historicalEventsData';
import { PhmcCategory } from '../data/phmcMarkersData';

export type EraId = HistoricalEra['id'];
export type AppLanguage = 'en' | 'es';

export interface BilingualField<T = string> {
  en: T;
  es: T;
}

/**
 * Core UI Dictionary for EN (en-US default) and ES (es-US alternative)
 */
export const UI_TRANSLATIONS = {
  en: {
    header: {
      commonwealthSubtitle: 'COMMONWEALTH OF PENNSYLVANIA',
      atlasSubtitle: 'Historical Cartographic Atlas of Pennsylvania',
      countiesInEra: (count: number) => `${count} of 67 counties`,
      inEraConnector: 'in era',
      compareBtn: '⏳ Compare: Before vs. Today',
      regionLabel: 'Region:',
      allRegionsBtn: 'All (67)',
      searchPlaceholder: 'Search county, seat, or historical site...',
      searchAriaLabel: 'Search Pennsylvania county, seat, or historical site',
      clearSearchAria: 'Clear search',
      noCountiesFound: (q: string) => `No results found for "${q}"`,
      seatLabel: 'Seat:',
      countiesGroupHeader: 'Pennsylvania Counties (67)',
      sitesGroupHeader: 'Historical Sites & PHMC Plaques',
      archiveBtn: '67-County Archive Index',
      archiveBtnTitle: 'View complete catalog of all 67 counties',
      resetViewTitle: 'Reset Pennsylvania map view',
      exploreLayersBtn: 'Explore Layers',
      archiveToolsBtn: 'Archive & Tools',
      layersMenuHeader: 'INTERACTIVE MAP LAYERS',
      toolsMenuHeader: 'ARCHIVE & CURATORIAL TOOLS',
      regionsLegendToggle: 'Historical Regions Legend',
      milestonesToggle: '⚔️ Milestones & Battles',
      milestonesToggleTitle:
        'Show or hide historical milestones and battlefields on the map',
      goToMilestone: '📜 Jump to a Milestone...',
      milestonesMenuHeader: (count: number) =>
        `Historical Milestones & Battles (${count})`,
      selectToFrame: 'Select to frame camera',
      routesBtn: '🧭 Historical Routes',
      routesMenuHeader: 'Animated Historical Routes',
      deactivateRoute: 'Clear active route',
      phmcToggle: '🪧 PHMC Blue Plaques',
      phmcToggleTitle:
        'Show or hide the 25 official Blue-and-Gold PHMC Historical Markers',
      allCategoriesLabel: (count: number) => `All Categories (${count})`,
      phmcFilterHeader: 'Filter Official PHMC Plaques by Category',
      phmcCountLabel: (shown: number, total: number) =>
        `${shown} of ${total} plaques`,
      vintageMapsBtn: '🗺️ Vintage Maps (Overlays)',
      overlayActiveBadge: 'Overlay Active',
      leadersBtn: '🏛️ Leaders & Governors',
      atlasGuideBtn: '🧭 Atlas Guide',
      atlasGuideTitle: 'Open Interactive 5-Step Welcome Guide',
      atlasIndexBtn: '📑 Atlas Index & Sources',
      atlasIndexTitle:
        'Interactive Site Map, Direct Module Shortcuts & Verified Archival Sources',
      aboutOutreachBtn: '🏛️ About & PA Community',
      aboutOutreachTitle:
        'Institutional Presentation & Pennsylvania Community Outreach',
      comicEncyclopediaBtn: '🦸‍♂️ Comic Encyclopedia',
      comicEncyclopediaTitle:
        'Open Illustrated Cartoon Encyclopedia of Pennsylvania History (1681–Present)',
      teacherModeBtn: '🎓 Teacher Mode',
      teacherModeTitle:
        'Toggle Classroom Mode, Smartboard Whiteboard, Primary Sources, PDE Worksheets & Trivia',
      languageSwitcherLabel: 'Switch application language (EN / ES)',
      supportCompactBtn: '♥ Support',
      contactCreatorBtn: '👤 Creator & Contact (Cesil Roa)',
      contactCreatorTitle:
        'About Creator Cesil Roa — LinkedIn Profile & Direct Contact',
    },
    timeline: {
      eraPrefix: 'Era',
      territorialEvolution: 'Territorial Evolution',
      countiesEstablished: (count: number) =>
        `${count} of 67 counties established`,
      chronoFilterActive: 'Chronological filter active',
      showingAllCounties: 'Showing all 67 counties',
      keyCountiesLabel: 'Key counties:',
      chronologyHeader: 'Chronology',
      chronologyRange: '1681 – Present',
      hideChronicle: 'Hide era chronicle',
      showChronicle: 'Show era chronicle',
      catPolitical: '🏛️ Political',
      catGeographic: '🗺️ Geographic',
      catStatistical: '📈 Statistical',
      subAll: 'All Milestones',
      locateOnMapBtn: '📍 Locate on Map',
      inspectCountyBtn: (cName: string) => `Inspect ${cName} County`,
      historicalImpactLabel: 'Historical & Institutional Significance:',
      timeSeriesHeader: 'Historical Statistical Evolution',
      eraFilterPrefix: 'Map Era:',
      closeDrawerAria: 'Close chronological milestone dossier',
      scrollLeftAria: 'Scroll milestones left',
      scrollRightAria: 'Scroll milestones right',
      collapseTimelineAria: 'Collapse chronology milestones row',
      expandTimelineAria: 'Expand chronology milestones row',
      eraShortLabels: {
        '1681': "William Penn's Charter",
        '1776': 'American Revolution',
        '1861': 'Civil War · Gettysburg',
        '1870': 'Steel, Coal & Oil Boom',
        '1950': 'Modern Transformation',
        present: '67 Modern Counties',
      } as Record<EraId, string>,
    },
    map: {
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      centerPA: 'Center on Pennsylvania (40.9699°N, 77.7278°W)',
      turfUnionTitle: 'Territorial Union (Turf.union)',
      turfNone: '67 Modern Counties (Current Borders)',
      turf1682: 'Scenario A (1682): 3 Original Counties + Native Lands',
      turf1787: 'Scenario B (1787): U.S. Constitution (18 Counties)',
      pill67Counties: '67 Modern Counties',
      pill1682Penn: "1682: Penn's 3 Counties",
      pill1787Constitution: '1787: Constitution (18)',
      regionsLegendCardTitle: 'Regions Legend',
      regionsLegendTitle: 'Historical Regions of PA',
      mergedLegendTitle: (yr: string) => `Merged Territories (${yr})`,
      collapseLegend: 'Collapse legend',
      expandLegend: 'Expand legend',
      notEstablishedIn: (yr: string) => `Not yet established in ${yr}`,
      centerOrSeat: 'Center/Seat:',
      turfMergedSubtitle: (count: number) =>
        `Turf.js union of ${count} modern counties`,
      loadingTitle: 'Loading Historical Cartography of Pennsylvania...',
      loadingSubtitle: 'Tracing boundaries of all 67 counties (STATEFP 42)',
    },
    infoPanel: {
      countyTitle: (name: string) => `${name} County`,
      incorporatedInEra: (yr: string) => `Incorporated by era ${yr}`,
      foundedLater: (yr: number) => `Founded later (${yr})`,
      closePanelAria: 'Close county dossier panel',
      foundedYearLabel: 'Year Founded',
      countySeatLabel: 'County Seat',
      audioGuideLabel: 'Audio Guide',
      tabNarrative: '📜 Historical Dossier',
      tabCensus: '👥 Demographics',
      tabLive: '📡 Live Overview',
      compareWithPeer: (reg: string) => `Compare with another county in ${reg}`,
      foundedAbbr: 'Est.',
      sec01Etymology: '01. Origin of Name (Etymology)',
      sec02Historical: '02. Historical & Territorial Significance',
      sec03Economic: '03. Economic & Industrial Profile',
      viewChartLink: 'View 1790–Present chart →',
      milestonesInCounty: (name: string) =>
        `Milestones & Battles in ${name} County`,
      phmcInCounty: (count: number) => `🪧 Official PHMC Plaques (${count})`,
      blueAndGoldLabel: 'Blue & Gold',
      eventYearLabel: 'Event',
      dedicatedYearLabel: 'Dedicated',
      inFieldTripBadge: '✓ In Field Trip',
      addToFieldTripShort: '➕ Field Trip',
      addCountyToTrip: '➕ Add County Seat to My Field Trip',
      countyInTrip: '✓ County Seat in Field Trip',
      leadersLinkedTo: (name: string) =>
        `Historical Figures Linked to ${name}`,
      leadersOfEra: (yr: string) => `Key Figures of the Era (${yr})`,
      viewBioAndBalance: 'View biography & historical balance →',
      primarySourceCapsule: (yr: number) => `Primary Source Capsule (${yr})`,
      socraticQuestionLabel: 'Socratic Question:',
      archivePrefix: 'Archive:',
      indigenousRootsLabel: 'Pre-Colonial Indigenous Roots',
      keyLandmarkLabel: 'Featured Heritage Landmark',
      otherCountiesIn: (reg: string) => `Other counties in ${reg}`,
      filterRegionBtn: 'Filter region',
      open3dStageBtn: (cName: string) => `🏛️ Explore ${cName} in 3D Historical Stage`,
      open3dStageSub: 'Interactive 360° WebGL Sculptures & Studio Lighting',
    },
    liveCounty: {
      liveDataBadge: '● LIVE DATA',
      sectionTitle: '📡 Live County Snapshot',
      kpiWeather: 'Current Weather',
      kpiElevation: 'Elevation (ASL)',
      kpiCoordinates: 'Coordinates',
      kpiAreaRegion: 'Area & Region',
      windLabel: 'Wind:',
      humidityLabel: 'Humidity:',
      quickFactsTitle: 'Wikipedia Live Encyclopedic Summary',
      readOnWikiBtn: 'Read Full Article on Wikipedia ↗',
      updatedAtPrefix: 'Updated:',
      sourceLabel: 'Sources: Wikipedia REST API & Open-Meteo',
    },
    audioNarrator: {
      regionAria: 'Bilingual Historical Audio-Guide Player',
      activeNarrationAria: 'Active narration',
      pausedBadge: '[Paused]',
      narrateEsTitle: 'Narrate in Spanish (es-US)',
      narrateEnTitle: 'Narrate in US English (en-US)',
      speedTitle: 'Toggle playback speed (1x / 1.2x)',
      pauseBtn: 'Pause',
      resumeBtn: 'Resume',
      listenBtn: 'Listen',
      stopTitle: 'Stop narration',
    },
    census: {
      tooltipCensus: 'Census',
      tooltipPopSuffix: 'pop.',
      badgeHeader: 'Historical Economic Engine & Milestone Badge',
      dominantSector: 'Dominant Sector:',
      demographicsTitle: 'Decennial Census Population (1790–Present)',
      currentPopLabel: 'Current population:',
      peakInLabel: (yr: number | string) => `Peak in ${yr}:`,
      compositionTitle: 'Historical-Modern Economic Composition',
      agriLabel: 'Agri/Forestry',
      indLabel: 'Ind./Mining',
      servLabel: 'Serv./Tech.',
    },
    demographics: {
      subTabStatic: '1. Structure (Static)',
      subTabDynamic: '2. Dynamics (Evolution)',
      totalPopLabel: 'Total Population',
      densityLabel: 'Pop. Density',
      densityUnit: 'pop./mi²',
      urbanLabel: 'Urban',
      ruralLabel: 'Rural',
      pyramidTitle: 'Age & Sex Demographic Pyramid',
      pyramidSubtitle: 'Cohort % of total population (Men vs. Women)',
      menLabel: 'Men',
      womenLabel: 'Women',
      maritalStatusTitle: 'Marital Status (15+ yrs)',
      singleLabel: 'Never Married',
      marriedLabel: 'Married',
      divorcedLabel: 'Divorced',
      widowedLabel: 'Widowed',
      ethnicOriginTitle: 'Ethnic & Racial Composition',
      whiteLabel: 'White',
      blackLabel: 'Black / African American',
      hispanicLabel: 'Hispanic / Latino',
      asianLabel: 'Asian',
      multiracialLabel: 'Two or More Races',
      languagesTitle: 'Linguistic Distribution (At Home)',
      englishOnlyLabel: 'English Only',
      spanishLangLabel: 'Spanish',
      otherLangLabel: 'Other Languages',
      eduLaborTitle: 'Educational Attainment & Labor Profile',
      bachelorPlusLabel: "Bachelor's Degree or Higher",
      highSchoolPlusLabel: 'High School Graduate+',
      employedRateLabel: 'Employed Rate',
      unemploymentRateLabel: 'Unemployment',
      medianIncomeLabel: 'Median Household Income',
      vitalBalanceTitle: 'Vital Balance (Natality vs. Mortality)',
      birthRateLabel: 'Birth Rate',
      deathRateLabel: 'Mortality Rate',
      perThousandUnit: '‰ (per 1,000)',
      naturalGrowthLabel: 'Natural / Vegetative Growth',
      positiveGrowthBadge: 'Natural Increase (+)',
      negativeGrowthBadge: 'Natural Contraction (−)',
      healthFertilityTitle: 'Fertility & Public Health Indicators',
      fertilityRateLabel: 'Total Fertility Rate',
      fertilityUnit: 'children / woman',
      lifeExpectancyLabel: 'Life Expectancy',
      lifeExpectancyUnit: 'years at birth',
      infantMortalityLabel: 'Infant Mortality',
      infantMortalityUnit: '‰ live births',
      migrationTitle: 'Migration Flows (Domestic & International)',
      netMigrationLabel: 'Net Annual Migration Rate',
      domesticMigrationLabel: 'Internal / Domestic U.S. Migration',
      internationalMigrationLabel: 'International Immigration',
      historicalTrendToggle: 'Show Decennial Historical Census (1790–Present)',
    },
    fieldTrip: {
      badgeBtn: (count: number, max: number) =>
        `🚌 My Field Trip (${count}/${max})`,
      drawerAria: 'Pennsylvania Historical Field Trip Planner',
      headerKicker: 'ROUTE PLANNER · HAVERSINE 1.25x',
      headerTitle: (count: number, max: number) =>
        `🚌 My Field Trip (${count}/${max} stops)`,
      clearBtn: 'Clear',
      clearTitle: 'Remove all stops',
      minimizeAria: 'Minimize field trip planner',
      estRoadDist: 'Est. Road Distance',
      milesUnit: 'miles',
      drivingTimeLabel: 'Driving Time (~50 mph)',
      quickAddPlaceholder: '+ Add stop from the 25 Official PHMC Plaques...',
      emptyTitle: 'Your field trip itinerary is empty',
      emptyDesc:
        'Click any Official PHMC Plaque (🪧), Historical Milestone (⚔️), or County on the map and press "➕ Add to My Field Trip" (up to 5 stops).',
      legEstimate: (mi: number, dur: string) =>
        `↓ Est. road leg: ~${mi} mi (${dur})`,
      moveUpTitle: 'Move stop earlier in itinerary',
      moveDownTitle: 'Move stop later in itinerary',
      removeStopTitle: 'Remove stop from itinerary',
      openGoogleMapsBtn: '🗺️ Open Route in Google Maps',
      copyItineraryBtn: '📋 Copy Itinerary for WhatsApp / Email',
      copiedSuccessMsg: 'Itinerary copied to clipboard!',
      exportHeader:
        '🏛️ HISTORICAL FIELD TRIP ITINERARY — KEYSTONE CHRONOMAP (PENNSYLVANIA)',
      exportStopsCount: (count: number, max: number) =>
        `📍 Scheduled Stops: ${count} of ${max}`,
      exportDistanceLine: (mi: number, dur: string) =>
        `🛣️ Estimated Road Distance: ${mi} miles (${dur} driving at ~50 mph)`,
      exportLegPrefix: (mi: number) =>
        `   ↳ Leg from previous stop: ~${mi} mi`,
      exportCoordsPrefix: '   Coordinates:',
      exportSummaryPrefix: '   Historical Note:',
      exportMapsLinkHeader: '🗺️ GPS Navigation Link in Google Maps:',
    },
    phmcModal: {
      commissionHeader: 'PENNSYLVANIA HISTORICAL AND MUSEUM COMMISSION',
      dedicatedIn: 'Dedicated in',
      eventYear: 'Event Year:',
      inscribeEsTab: 'Spanish Translation',
      inscribeEnTab: 'Original English Plaque',
      historicalContextLabel: 'Archival Context & Significance:',
      addToTripBtn: '➕ Add to My Field Trip',
      alreadyInTripBtn: '✓ Added to My Field Trip (Stop',
      tripFullBtn: 'Itinerary Full (5/5 stops)',
      inspectCountyBtn: (cName: string) => `Explore ${cName} County →`,
    },
    welcomeGuide: {
      kicker: (stepNum: string) =>
        `INTERACTIVE ATLAS GUIDE · STEP ${stepNum} OF 05`,
      title: 'Interactive Welcome Guide — Keystone ChronoMap',
      stepLabel: (num: string) => `STEP ${num}`,
      highlightsHeader: 'Key Features & Interactions:',
      skipBtn: 'Skip guide and go to map',
      prevBtn: 'Previous',
      nextBtn: 'Next',
      startBtn: 'Start Exploring!',
    },
    teacherToolbar: {
      kicker: 'PDE CLASSROOM MODE',
      title: '🎓 Teacher Mode Active',
      exitTitle: 'Exit Teacher Mode',
      smartboardBtn: 'Smartboard Projection',
      whiteboardHeader: 'Touch Whiteboard Over Map',
      strokesCount: (n: number) => `${n} stroke${n === 1 ? '' : 's'}`,
      toolNavigate: 'Navigate Map',
      toolPen: 'Freehand Pen',
      toolArrow: 'Tactical Arrow',
      toolCircle: 'Circle',
      undoTitle: 'Undo last stroke',
      clearTitle: 'Clear entire whiteboard',
      primarySourcesBtn: 'Primary Source Capsules',
      worksheetBtn: 'Generate Printable Guide (PDF)',
      triviaBtn: 'Quick Challenge / Classroom Trivia',
      triviaCountBadge: '20 Qs',
      sourcesModalKicker:
        'FOUNDATIONAL DOCUMENTS · PDE ACADEMIC STANDARDS (8.2 PENNSYLVANIA HISTORY)',
      sourcesModalTitle: 'Primary Source Capsules & Socratic Seminar',
      authorOriginLabel: 'Authorship / Origin:',
      verbatimEnHeader: 'Verbatim Archival Excerpt (Original English):',
      translatedEsHeader: 'Spanish Translation for Dual-Language Classrooms:',
      historicalContextHeader:
        'Historical & Territorial Context in Pennsylvania',
      socraticHeader: 'Socratic Seminar Questions for the Classroom',
      officialReposHeader: 'Verified Official Repositories',
      linkedCountiesHeader: 'Linked Jurisdictions in the Atlas:',
      generateWorksheetCta:
        'Generate Printable PDE Worksheet with this Primary Source',
    },
    worksheet: {
      modalKicker:
        'CLASSROOM WORKSHEET GENERATOR (45 MIN) · PDE ACADEMIC STANDARDS 8.2',
      modalTitle:
        'Cartographic & Historical Worksheet (Ink-Saving B&W Format)',
      printBtn: '🖨️ Print / Save as PDF',
      schoolLabel: '1. School / Institution',
      countyLabel: '2. Study County (67)',
      sourceLabel: '3. Official Primary Source',
      standardLabel: '4. PDE Academic Standard',
      sheetHeaderKicker:
        'KEYSTONE CHRONOMAP · HISTORICAL ATLAS OF PENNSYLVANIA · CLASSROOM GUIDE (45 MIN)',
      referenceEra: 'Reference Era:',
      officialStandardBox: 'OFFICIAL PDE STANDARD',
      studentName: 'Student Name:',
      courseGroup: 'Course / Section:',
      dateLabel: 'Date:',
      curriculumAlignment:
        'Curriculum Alignment (Pennsylvania Department of Education — 8.2 Pennsylvania History):',
      part1Title: (cName: string, founded: number) =>
        `Part I. Cartographic Investigation: ${cName} County (${founded})`,
      duration15: '15 Minutes',
      colCountyFips: 'County / FIPS',
      colFounded: 'Year Founded',
      colSeat: 'County Seat',
      colRegionArea: 'Region / Area',
      etymologyAndHistory: 'Etymology & History:',
      economyAndIndigenous: 'Economic Profile & Indigenous Roots:',
      precolonialTerritory: 'Pre-colonial territory:',
      activity1Title:
        '1. Cartographic Atlas Activity ("Before vs. Today" Mode & Timeline):',
      activity1Prompt: (eraLabel: string, cName: string, seat: string) =>
        `Using Keystone ChronoMap in era ${eraLabel}, explain how physical geography (rivers, valleys, or the Allegheny Mountains) and natural resources influenced the founding of ${cName} County and the selection of ${seat} as its county seat:`,
      part2Title: (srcTitle: string) =>
        `Part II. Primary Source Analysis: ${srcTitle}`,
      duration20: '20 Minutes',
      sourceHeader: 'SOURCE:',
      officialArchiveHeader: 'OFFICIAL ARCHIVE:',
      socraticQuestionA: 'Socratic Development Prompt A:',
      socraticQuestionB: 'Socratic Development Prompt B:',
      part3Title: (code: string) =>
        `Part III. Quick Assessment Rubric (PDE Standard ${code})`,
      scoreLabel: 'Score: ____ / 12 pts',
      rubricLevel3: 'Level 3: Advanced / Mastery (4 pts)',
      rubricLevel2: 'Level 2: Proficient / Developing (3 pts)',
      rubricLevel1: 'Level 1: Emerging / Needs Support (1–2 pts)',
      rubricRow1Col3: (cName: string, seat: string, founded: number) =>
        `Cartographic & Historical Accuracy: Accurately connects the boundaries of ${cName} County, its seat (${seat}), founding year (${founded}), and regional context within Pennsylvania.`,
      rubricRow1Col2: (cName: string) =>
        `Identifies basic facts about ${cName} County and its era, but describes the link between physical geography and economic evolution in general terms.`,
      rubricRow1Col1: (eraLabel: string) =>
        `Mentions isolated county facts without connecting them to the historical era (${eraLabel}) or Pennsylvania's regions.`,
      rubricRow2Col3: (srcTitle: string) =>
        `Primary Source Analysis: Cites direct textual evidence from ${srcTitle} and critically argues both Socratic questions.`,
      rubricRow2Col2:
        'Understands the central idea of the primary source and answers both questions, though with limited textual citations or state context.',
      rubricRow2Col1:
        'Superficially paraphrases the primary document or leaves the requested historical argument incomplete.',
      includeDualLangQuoteLabel:
        'Also include bilingual translation excerpt (EN/ES Dual-Language support)',
      closePreviewBtn: 'Close preview',
      printNowBtn: 'Print Guide Now',
    },
    support: {
      headerBtn: 'Support Project',
      headerBtnTitle: 'Support This Educational Project — Donations & Sponsorship',
      footerLink: 'Support This Educational Project',
      footerCopyright: 'Keystone ChronoMap · Open-Access Historical Atlas of Pennsylvania',
      modalKicker: 'OPEN-ACCESS ARCHIVAL CARTOGRAPHY · PATRONAGE',
      modalTitle: 'Support This Educational Project',
      impactMessage:
        'Keystone ChronoMap is free and open-access for students, teachers, and history enthusiasts. Your contribution helps cover cloud servers, historical data curation, and new educational features.',
      tabZelleCashApp: '💵 Zelle & Cash App',
      tabZelleSubtitle: 'Fast U.S. Payments',
      tabCrypto: '🪙 Criptomonedas / Crypto',
      tabCryptoSubtitle: 'BTC, ETH, ADA, SOL',
      copiedBadge: '✓ Copied! / ¡Copiado!',
      zelleTitle: 'Zelle',
      zelleBadge: 'Instant U.S. Bank Transfer',
      zelleEmailLabel: 'Zelle Email',
      copyEmailBtn: 'Copy Email',
      cashAppTitle: 'Cash App',
      cashAppBadge: 'Instant P2P Transfer',
      cashtagLabel: 'Cashtag',
      openCashAppBtn: 'Open Cash App',
      copyCashtagBtn: 'Copy $Cashtag',
      cryptoAddressLabel: 'Wallet Address',
      copyAddressBtn: 'Copy Address',
      viewQrBtn: 'View QR',
      hideQrBtn: 'Hide QR',
      qrScanHint: 'Scan with your mobile crypto wallet',
      securityNote:
        'Please verify the network and wallet address before sending. Thank you for supporting open education.',
      closeBtn: 'Return to Historical Atlas',
    },
    outreach: {
      footerLink: '🏛️ About & PA Community',
      modalKicker:
        'INSTITUTIONAL OVERVIEW · PENNSYLVANIA CIVIC & EDUCATIONAL OUTREACH',
      modalTitle:
        'Keystone ChronoMap — Built for Pennsylvania Schools, Museums & Communities',
      modalSubtitle:
        'An open-access interactive historical, cartographic, and demographic atlas connecting all 67 Pennsylvania counties from William Penn’s 1681 Charter to the present day.',
      pillarsSectionTitle: 'Value Proposition by Sector across the Commonwealth',
      pillar1Badge: 'PDE ACADEMIC STANDARDS 8.2 & 7.1',
      pillar1Title: '1. K-12 Schools & PDE Educators',
      pillar1Desc:
        '100% free classroom resource aligned with Pennsylvania Department of Education (PDE) History & Geography standards. Features Smartboard projection mode, interactive touch whiteboard, verbatim Primary Source Capsules, classroom trivia, and 45-minute printable PDF worksheets.',
      pillar1Action: 'Activate Teacher Mode',
      pillar2Badge: '67 COUNTIES · 25 PHMC PLAQUES',
      pillar2Title: '2. County Historical Societies & Museums',
      pillar2Desc:
        'An open digital showcase highlighting the local heritage, founding charters, county seats, historical figures, and official Blue-and-Gold PHMC markers across all 67 counties—from Philadelphia and Bucks to Allegheny, Erie, and Lackawanna.',
      pillar2Action: 'Open 67-County Archive',
      pillar3Badge: 'GPS MULTI-STOP FIELD TRIPS',
      pillar3Title: '3. Cultural Tourism & Heritage Areas',
      pillar3Desc:
        'Equipped with an interactive Field Trip Builder that calculates road distances across Pennsylvania and exports multi-stop historical itineraries directly to Google Maps for school buses, families, and heritage travelers.',
      pillar3Action: 'Explore Map & Routes',
      pillar4Badge: 'EN-US & ES-US ACCESSIBILITY',
      pillar4Title: '4. Bilingual & Hispanic Communities (EN / ES)',
      pillar4Desc:
        'Designed for inclusive civic access across Pennsylvania’s growing dual-language and ESL school districts (Allentown, Reading, Lancaster, Philadelphia, York), featuring instant EN/ES translation, bilingual Web Speech audio-guides, and county demographic pyramids.',
      pillar4Action: 'Switch EN / ES Language',
      shareSectionTitle: 'Share with Your School District, Museum or Community',
      shareSectionDesc:
        'Help educators, principals, historical societies, and families across Pennsylvania discover this free civic resource:',
      shareLinkedInBtn: 'Share on LinkedIn',
      shareLinkedInSub: 'For Principals, Teachers & Historians',
      shareFacebookBtn: 'Share on Facebook',
      shareFacebookSub: 'For PA Community & Heritage Groups',
      shareWhatsAppBtn: 'Share via WhatsApp',
      shareWhatsAppSub: 'Direct Message to Colleagues & Families',
      copyOutreachBtn: 'Copy Official Link & Presentation Message',
      copiedOutreachBadge: '✓ Presentation Link & Message Copied!',
      outreachPitchText:
        '🏛️ Explore Keystone ChronoMap — the free interactive Historical, Demographic & Civic Atlas of Pennsylvania’s 67 Counties (1681–Present). Features PDE-aligned classroom tools, official PHMC markers, census pyramids, and bilingual (EN/ES) audio guides:',
      pwaInstallHint:
        '💻 Chromebook & iPad Ready: Teachers and students can install Keystone ChronoMap directly from the browser address bar as a standalone educational web app.',
      closeBtn: 'Return to Interactive Atlas',
    },
    comicEncyclopedia: {
      modalKicker:
        'ILLUSTRATED CARTOON ENCYCLOPEDIA · 6 CHAPTERS · 1681 – PRESENT',
      modalTitle:
        '🦸‍♂️ The Adventures of Keystone ChronoMap: Pennsylvania History in Cartoons',
      modalSubtitle:
        'Explore all 67 counties, founding charters, battles, industrial titans, and census milestones through dynamic HTML5 Canvas comic strips and verified primary archives.',
      chapterPrefix: 'Chapter',
      listenComicLabel: '🔊 Listen to Comic Strip',
      downloadChapterPdfBtn: '📥 Download Chapter (PDF)',
      downloadFullBookPdfBtn: '📚 Download Complete Comic Book (PDF)',
      preparingPdfBadge: '⏳ Rendering High-Res Comic Pages...',
      viewCountiesOnMapBtn: '🗺️ View Chapter Counties on Map',
      expandedFactBadge: 'ENCYCLOPEDIC DEEP-DIVE',
      directSourcesHeader:
        '📚 Verified Direct Archival Sources (Click to Consult Official Repositories)',
      prevChapterBtn: '← Previous Chapter',
      nextChapterBtn: 'Next Chapter →',
      closeBtn: 'Close Encyclopedia',
      printCoverSubtitle:
        'An Illustrated Educational & Archival Comic Book of Pennsylvania’s 67 Counties (1681–Present)',
      printFooterNote:
        'Generated by Keystone ChronoMap — Open-Access Historical, Demographic & Civic Atlas of Pennsylvania',
      mode2dComicsBtn: '🎨 2D Comic Strips (6 Chapters)',
      mode3dStageBtn: '🏛️ 3D Historical Figures Stage (WebGL)',
      stage3dBadge: 'WEBGL 3D MUSEUM DIORAMA · PBR STUDIO LIGHTING',
      stageSelectTownLabel: 'Featured PA Town / Stage:',
      stageSelectCountyAria: 'Select any of the 67 Pennsylvania counties for 3D Stage',
      stageJumpAnyCountyPlaceholder: 'Jump to any of the 67 Counties...',
      reset3dCameraBtn: 'Reset 360° View',
      stage3dInteractHint: 'Drag to rotate 360° · Scroll to zoom · Click any 3D figure',
      capture3dSnapshotBtn: '📸 Capture 3D Stage for PDF',
      stageControlsBtn: 'Studio Controls',
      toggle3dPinsBtn: '3D Callout Pins',
      snapshotCapturedBadge: '✓ 3D Stage Snapshot Added to PDF Book!',
      listen3dBioLabel: '🔊 Listen to Biography',
      sculptedArtifactsHeader: '3D Sculpted Historical Artifacts & Attire:',
      officialCuratorSourceLink: 'Verify in Official Historical Archive',
      print3dSectionTitle: '3D Historical Figures Museum Diorama Snapshot',
    },
    aiAssistant: {
      fabLabel: 'AI Guide',
      fabAria: 'Open Keystone AI Guide with Voice & Text Navigation',
      headerTitle: 'Keystone AI Guide',
      headerSubtitle: (countyName: string) =>
        `Active Context: ${countyName} County · Voice & Text`,
      welcomeMessage: (countyName: string) =>
        `👋 Hello! I am your **Keystone AI Guide**. We are currently exploring **${countyName} County**. Ask me anything by **voice (🎤)** or **text**, or tell me where to go (e.g., *"Fly to Gettysburg"*, *"Show 3D Stage"*, *"Demographics of Scranton"*, or *"Compare 1682 vs. Today"*).`,
      inputPlaceholder: 'Ask about PA history or give a map command...',
      listeningStatus: '🎙️ Listening... Speak now (EN-US)',
      micBtnTitle: 'Speak question or map command (Microphone)',
      sendBtnTitle: 'Send message',
      listenReplyTitle: 'Listen to AI response aloud',
      stopSpeechTitle: 'Stop voice playback',
      clearChatTitle: 'Reset conversation',
      settingsTitle: 'Voice & Assistant Preferences',
      autoVoiceLabel: 'Auto-read voice responses aloud',
      speechSpeedLabel: 'Voice narration speed:',
      micPermissionError:
        'Microphone permission was denied or is unavailable in this browser. You can still type any question or command below!',
      typingIndicator: 'Consulting Pennsylvania Historical Archives...',
    },
    leftRail: {
      railAria: 'Map Controls, AI Guide & Field Trips Rail',
      territoriesTooltip: '🗺️ Territories & Borders',
      territoriesDrawerTitle: 'Territories & Borders',
      territoriesIntro:
        'Switch between modern county jurisdictions and Turf.js historical territory unions:',
      modern67Sub: 'Current 67 county borders (STATEFP 42)',
      penn1682Sub: 'Philadelphia, Bucks, Chester + Native Lands',
      const1787Sub: '18 Revolutionary & Constitutional Counties',
      layersTooltip: '📍 Layers & PHMC Plaques',
      layersDrawerTitle: 'Layers & PHMC Plaques',
      aiGuideTooltip: '✨ AI Guide',
      fieldTripsTooltip: (count: number) =>
        count > 0 ? `🚌 My Field Trips (${count})` : '🚌 My Field Trips',
      teacherModeTooltip: '🎓 Teacher Mode',
      stopAddedToast: (title: string, count: number, max: number) =>
        `🚌 Added "${title}" to My Field Trips (${count}/${max})`,
      openTripsBtn: 'View Itinerary',
    },
    footer: {
      ariaLabel: 'Legal information and footer',
      navAriaLabel: 'Legal links and contact',
      copyrightLine:
        '© 2026 Keystone ChronoMap · Independent Educational & Historical Atlas of Pennsylvania.',
      termsLink: 'Terms of Use',
      privacyLink: 'Privacy Policy',
      contactLink: 'Contact',
    },
    creatorContact: {
      kicker: 'PLATFORM ARCHITECT & CREATOR',
      headline:
        'Senior Business Systems Analyst | Requirements & Process Improvement',
      location: 'Pennsylvania, United States',
      availabilityBadge: 'Open to Remote & Hybrid Opportunities in the US',
      bioHeader: 'Professional Summary & Mission',
      bioSummary:
        "Senior Business Systems Analyst with 10+ years of experience bridging business needs and technology solutions through systems analysis, requirements documentation, process automation, and data reporting. Leveraging his expertise in structuring complex information and translating requirements into practical software, he created Keystone ChronoMap as an open-access educational platform for Pennsylvania's communities.",
      skillsHeader: 'Core Specialties & Technical Stack',
      coreSkills: [
        'Systems Analysis',
        'Requirements Management',
        'Process Improvement',
        'SQL & Power BI',
        'SharePoint / M365',
        'Agile / Azure DevOps',
        'Bilingual (EN/ES)',
      ],
      linkedinBtn: 'Connect on LinkedIn',
      directEmailLabel: 'Direct Email',
      copyEmailBtn: 'Copy Email',
      copiedBadge: '✓ Copied!',
      emailActionBtn: 'Email',
      sendEmailTitle: 'Send direct email to cesil.roa@gmail.com',
      supportLink: 'Support this open educational project',
      closeBtn: 'Close',
      closeAria: 'Close creator contact modal',
    },
  },
  es: {
    header: {
      commonwealthSubtitle: 'COMMONWEALTH OF PENNSYLVANIA',
      atlasSubtitle: 'Atlas Cartográfico Histórico de Pensilvania',
      countiesInEra: (count: number) => `${count} de 67 condados`,
      inEraConnector: 'en época',
      compareBtn: '⏳ Comparar: Antes vs. Hoy',
      regionLabel: 'Región:',
      allRegionsBtn: 'Todas (67)',
      searchPlaceholder: 'Buscar condado, sede o sitio histórico...',
      searchAriaLabel: 'Buscar condado, sede o sitio histórico de Pensilvania',
      clearSearchAria: 'Limpiar búsqueda',
      noCountiesFound: (q: string) =>
        `No se encontraron resultados para "${q}"`,
      seatLabel: 'Sede:',
      countiesGroupHeader: 'Condados de Pensilvania (67)',
      sitesGroupHeader: 'Sitios Históricos y Placas PHMC',
      archiveBtn: 'Índice de Archivo (67 Condados)',
      archiveBtnTitle: 'Ver catálogo completo de los 67 condados',
      resetViewTitle: 'Restablecer encuadre de Pensilvania',
      exploreLayersBtn: 'Explorar Capas',
      archiveToolsBtn: 'Archivo y Herramientas',
      layersMenuHeader: 'CAPAS INTERACTIVAS DEL MAPA',
      toolsMenuHeader: 'ARCHIVO Y HERRAMIENTAS CURATORIALES',
      regionsLegendToggle: 'Leyenda de Regiones Históricas',
      milestonesToggle: '⚔️ Hitos y Batallas',
      milestonesToggleTitle:
        'Mostrar u ocultar marcadores de hitos y batallas históricas en el mapa',
      goToMilestone: '📜 Ir a un Hito...',
      milestonesMenuHeader: (count: number) =>
        `Hitos y Batallas Históricas (${count})`,
      selectToFrame: 'Seleccionar para encuadrar',
      routesBtn: '🧭 Rutas Históricas',
      routesMenuHeader: 'Rutas Históricas Animadas',
      deactivateRoute: 'Limpiar ruta activa',
      phmcToggle: '🪧 Placas Azules PHMC',
      phmcToggleTitle:
        'Mostrar u ocultar las 25 Placas Históricas Oficiales Azul y Oro de la PHMC',
      allCategoriesLabel: (count: number) =>
        `Todas las categorías (${count})`,
      phmcFilterHeader: 'Filtrar Placas Oficiales PHMC por Categoría',
      phmcCountLabel: (shown: number, total: number) =>
        `${shown} de ${total} placas`,
      vintageMapsBtn: '🗺️ Mapas Antiguos (Superposición)',
      overlayActiveBadge: 'Superpuesto',
      leadersBtn: '🏛️ Líderes y Gobernadores',
      atlasGuideBtn: '🧭 Guía del Atlas',
      atlasGuideTitle: 'Abrir Manual Interactivo de Bienvenida (5 pasos)',
      atlasIndexBtn: '📑 Índice del Atlas y Fuentes',
      atlasIndexTitle:
        'Mapa del Sitio Interactivo, Accesos Directos y Directorio de Fuentes Oficiales',
      aboutOutreachBtn: '🏛️ Acerca y Comunidad PA',
      aboutOutreachTitle:
        'Presentación Institucional y Difusión Comunitaria en Pensilvania',
      comicEncyclopediaBtn: '🦸‍♂️ Enciclopedia Caricatura',
      comicEncyclopediaTitle:
        'Abrir Enciclopedia Digital Ilustrada en Estilo Caricatura (1681–Presente)',
      teacherModeBtn: '🎓 Modo Docente',
      teacherModeTitle:
        'Activar o desactivar herramientas de aula, pizarra digital Smartboard, fuentes primarias, hojas de trabajo PDE y trivia',
      languageSwitcherLabel: 'Cambiar idioma de la aplicación (EN / ES)',
      supportCompactBtn: '♥ Apoyar',
      contactCreatorBtn: '👤 Creador y Contacto (Cesil Roa)',
      contactCreatorTitle:
        'Acerca del Creador Cesil Roa — Perfil de LinkedIn y Contacto Directo',
    },
    timeline: {
      eraPrefix: 'Época',
      territorialEvolution: 'Evolución Territorial',
      countiesEstablished: (count: number) =>
        `${count} de 67 condados constituidos`,
      chronoFilterActive: 'Filtro cronológico activo',
      showingAllCounties: 'Mostrando 67 condados',
      keyCountiesLabel: 'Condados clave:',
      chronologyHeader: 'Cronología',
      chronologyRange: '1681 – Presente',
      hideChronicle: 'Ocultar crónica de la época',
      showChronicle: 'Mostrar crónica de la época',
      catPolitical: '🏛️ Político',
      catGeographic: '🗺️ Geográfico',
      catStatistical: '📈 Estadístico',
      subAll: 'Todos los Hitos',
      locateOnMapBtn: '📍 Ubicar en el Mapa',
      inspectCountyBtn: (cName: string) => `Ver Condado de ${cName}`,
      historicalImpactLabel: 'Trascendencia Histórica e Institucional:',
      timeSeriesHeader: 'Evolución Estadística de la Etapa',
      eraFilterPrefix: 'Época del Mapa:',
      closeDrawerAria: 'Cerrar ficha cronológica',
      scrollLeftAria: 'Desplazar hitos a la izquierda',
      scrollRightAria: 'Desplazar hitos a la derecha',
      collapseTimelineAria: 'Minimizar fila de hitos cronológicos',
      expandTimelineAria: 'Expandir fila de hitos cronológicos',
      eraShortLabels: {
        '1681': 'Carta de William Penn',
        '1776': 'Revolución Americana',
        '1861': 'Guerra Civil · Gettysburg',
        '1870': 'Acero, Carbón y Petróleo',
        '1950': 'Transformación Moderna',
        present: '67 Condados Modernos',
      } as Record<EraId, string>,
    },
    map: {
      zoomIn: 'Acercar mapa',
      zoomOut: 'Alejar mapa',
      centerPA: 'Centrar en Pensilvania (40.9699°N, 77.7278°W)',
      turfUnionTitle: 'Fusión Territorial (Turf.union)',
      turfNone: '67 Condados Modernos (Fronteras Actuales)',
      turf1682: 'Escenario A (1682): 3 Condados + Pueblos Originarios',
      turf1787: 'Escenario B (1787): Constitución (18 Condados)',
      pill67Counties: '67 Condados Actuales',
      pill1682Penn: '1682: 3 Condados de Penn',
      pill1787Constitution: '1787: Constitución (18)',
      regionsLegendCardTitle: 'Leyenda Regional',
      regionsLegendTitle: 'Regiones Históricas de PA',
      mergedLegendTitle: (yr: string) => `Territorios Fusionados (${yr})`,
      collapseLegend: 'Contraer leyenda',
      expandLegend: 'Expandir leyenda',
      notEstablishedIn: (yr: string) => `No constituido en ${yr}`,
      centerOrSeat: 'Centro/Sede:',
      turfMergedSubtitle: (count: number) =>
        `Fusión Turf.js de ${count} condados actuales`,
      loadingTitle: 'Cargando Cartografía Histórica de Pensilvania...',
      loadingSubtitle: 'Trazando límites de los 67 condados (STATEFP 42)',
    },
    infoPanel: {
      countyTitle: (name: string) => `Condado de ${name}`,
      incorporatedInEra: (yr: string) => `Incorporado en época ${yr}`,
      foundedLater: (yr: number) => `Fundado posteriormente (${yr})`,
      closePanelAria: 'Cerrar panel de información',
      foundedYearLabel: 'Año de Fundación',
      countySeatLabel: 'Sede (County Seat)',
      audioGuideLabel: 'Audio-Guía',
      tabNarrative: '📜 Relato Histórico',
      tabCensus: '👥 Demografía',
      tabLive: '📡 Datos Actuales',
      compareWithPeer: (reg: string) =>
        `Comparar con otro condado de ${reg}`,
      foundedAbbr: 'Fund.',
      sec01Etymology: '01. Origen del Nombre (Etimología)',
      sec02Historical: '02. Importancia Histórica y Territorial',
      sec03Economic: '03. Vocación Económica e Industrial',
      viewChartLink: 'Ver gráfico 1790–Hoy →',
      milestonesInCounty: (name: string) => `Hitos y Batallas en ${name}`,
      phmcInCounty: (count: number) => `🪧 Placas Oficiales PHMC (${count})`,
      blueAndGoldLabel: 'Azul y Oro',
      eventYearLabel: 'Evento',
      dedicatedYearLabel: 'Dedicada',
      inFieldTripBadge: '✓ En Excursión',
      addToFieldTripShort: '➕ Excursión',
      addCountyToTrip: '➕ Añadir Sede Condal a mi Excursión',
      countyInTrip: '✓ Sede Condal en Excursión',
      leadersLinkedTo: (name: string) =>
        `Figuras Históricas Vinculadas a ${name}`,
      leadersOfEra: (yr: string) => `Figuras Clave de la Época (${yr})`,
      viewBioAndBalance: 'Ver biografía y balance histórico →',
      primarySourceCapsule: (yr: number) =>
        `Cápsula de Fuente Primaria (${yr})`,
      socraticQuestionLabel: 'Pregunta Socrática:',
      archivePrefix: 'Archivo:',
      indigenousRootsLabel: 'Raíces Indígenas Precoloniales',
      keyLandmarkLabel: 'Hito Patrimonial Destacado',
      otherCountiesIn: (reg: string) => `Otros condados en ${reg}`,
      filterRegionBtn: 'Filtrar región',
      open3dStageBtn: (cName: string) => `🏛️ Explorar ${cName} en Escenario 3D`,
      open3dStageSub: 'Esculturas WebGL Interactivas 360° e Iluminación de Estudio',
    },
    liveCounty: {
      liveDataBadge: '● DATOS EN VIVO',
      sectionTitle: '📡 Datos Relevantes Actuales',
      kpiWeather: 'Clima Actual',
      kpiElevation: 'Elevación (SNM)',
      kpiCoordinates: 'Coordenadas',
      kpiAreaRegion: 'Superficie y Región',
      windLabel: 'Viento:',
      humidityLabel: 'Humedad:',
      quickFactsTitle: 'Resumen Enciclopédico Actualizado (Wikipedia)',
      readOnWikiBtn: 'Leer Artículo Completo en Wikipedia ↗',
      updatedAtPrefix: 'Actualizado:',
      sourceLabel: 'Fuentes: Wikipedia REST API y Open-Meteo',
    },
    audioNarrator: {
      regionAria: 'Reproductor de Audio-Guía Histórica Bilingüe',
      activeNarrationAria: 'Narración activa',
      pausedBadge: '[Pausado]',
      narrateEsTitle: 'Narrar en Español (es-US)',
      narrateEnTitle: 'Narrar en Inglés (en-US)',
      speedTitle: 'Cambiar velocidad de lectura (1x / 1.2x)',
      pauseBtn: 'Pausa',
      resumeBtn: 'Seguir',
      listenBtn: 'Escuchar',
      stopTitle: 'Detener narración',
    },
    census: {
      tooltipCensus: 'Censo',
      tooltipPopSuffix: 'hab.',
      badgeHeader: 'Hito e Insignia del Motor Económico Histórico',
      dominantSector: 'Sector Dominante:',
      demographicsTitle: 'Evolución Demográfica Censal (1790–Actualidad)',
      currentPopLabel: 'Población actual:',
      peakInLabel: (yr: number | string) => `Pico en ${yr}:`,
      compositionTitle: 'Composición Económica Histórica-Actual',
      agriLabel: 'Agro/Forestal',
      indLabel: 'Ind./Minería',
      servLabel: 'Serv./Tecnol.',
    },
    demographics: {
      subTabStatic: '1. Estructura (Estática)',
      subTabDynamic: '2. Dinámica (Evolución)',
      totalPopLabel: 'Población Total',
      densityLabel: 'Densidad Poblacional',
      densityUnit: 'hab/mi²',
      urbanLabel: 'Urbana',
      ruralLabel: 'Rural',
      pyramidTitle: 'Pirámide Demográfica (Edad y Sexo)',
      pyramidSubtitle: '% por grupo etario sobre población total (Hombres vs. Mujeres)',
      menLabel: 'Hombres',
      womenLabel: 'Mujeres',
      maritalStatusTitle: 'Estado Civil (Población 15+ años)',
      singleLabel: 'Solteros',
      marriedLabel: 'Casados',
      divorcedLabel: 'Divorciados',
      widowedLabel: 'Viudos',
      ethnicOriginTitle: 'Composición y Origen Étnico',
      whiteLabel: 'Blanca (White)',
      blackLabel: 'Afroamericana (Black)',
      hispanicLabel: 'Hispana / Latina',
      asianLabel: 'Asiática',
      multiracialLabel: 'Dos o más orígenes',
      languagesTitle: 'Distribución Lingüística en el Hogar',
      englishOnlyLabel: 'Solo Inglés',
      spanishLangLabel: 'Español',
      otherLangLabel: 'Otras Lenguas',
      eduLaborTitle: 'Nivel Educativo y Situación Laboral',
      bachelorPlusLabel: 'Título Universitario (Bachelor+)',
      highSchoolPlusLabel: 'Graduado de Secundaria+',
      employedRateLabel: 'Tasa de Empleo',
      unemploymentRateLabel: 'Desempleo',
      medianIncomeLabel: 'Ingreso Medio Familiar',
      vitalBalanceTitle: 'Balance Vital (Natalidad vs. Mortalidad)',
      birthRateLabel: 'Tasa de Natalidad',
      deathRateLabel: 'Tasa de Mortalidad',
      perThousandUnit: '‰ (por 1,000 hab.)',
      naturalGrowthLabel: 'Crecimiento Vegetativo / Natural',
      positiveGrowthBadge: 'Crecimiento Natural (+)',
      negativeGrowthBadge: 'Contracción Natural (−)',
      healthFertilityTitle: 'Indicadores de Salud y Fecundidad',
      fertilityRateLabel: 'Tasa Global de Fecundidad',
      fertilityUnit: 'hijos / mujer',
      lifeExpectancyLabel: 'Esperanza de Vida',
      lifeExpectancyUnit: 'años al nacer',
      infantMortalityLabel: 'Mortalidad Infantil',
      infantMortalityUnit: '‰ nacidos vivos',
      migrationTitle: 'Flujos Migratorios (Interna vs. Internacional)',
      netMigrationLabel: 'Saldo Migratorio Anual Neto',
      domesticMigrationLabel: 'Migración Interna (EE. UU.)',
      internationalMigrationLabel: 'Inmigración Internacional',
      historicalTrendToggle: 'Ver Evolución Censal Decenal (1790–Actualidad)',
    },
    fieldTrip: {
      badgeBtn: (count: number, max: number) =>
        `🚌 Mi Excursión (${count}/${max})`,
      drawerAria: 'Planificador de Excursiones Históricas por Pensilvania',
      headerKicker: 'PLANIFICADOR DE RUTA · HAVERSINE 1.25x',
      headerTitle: (count: number, max: number) =>
        `🚌 Mi Excursión (${count}/${max} paradas)`,
      clearBtn: 'Vaciar',
      clearTitle: 'Vaciar todas las paradas',
      minimizeAria: 'Minimizar planificador de excursión',
      estRoadDist: 'Distancia Vial Est.',
      milesUnit: 'millas',
      drivingTimeLabel: 'Tiempo Conducción (~50 mph)',
      quickAddPlaceholder: '+ Añadir parada desde las 25 Placas PHMC...',
      emptyTitle: 'Tu itinerario de excursión está vacío',
      emptyDesc:
        'Haz clic en cualquier Placa Oficial PHMC (🪧), Hito Histórico (⚔️) o Condado en el mapa y pulsa "➕ Añadir a mi Excursión" (hasta 5 paradas).',
      legEstimate: (mi: number, dur: string) =>
        `↓ Tramo vial estimado: ~${mi} mi (${dur})`,
      moveUpTitle: 'Subir parada en el orden de visita',
      moveDownTitle: 'Bajar parada en el orden de visita',
      removeStopTitle: 'Eliminar parada del itinerario',
      openGoogleMapsBtn: '🗺️ Abrir Ruta en Google Maps',
      copyItineraryBtn: '📋 Copiar Itinerario para WhatsApp / Email',
      copiedSuccessMsg: '¡Itinerario copiado al portapapeles!',
      exportHeader:
        '🏛️ ITINERARIO DE EXCURSIÓN HISTÓRICA — KEYSTONE CHRONOMAP (PENSILVANIA)',
      exportStopsCount: (count: number, max: number) =>
        `📍 Paradas programadas: ${count} de ${max}`,
      exportDistanceLine: (mi: number, dur: string) =>
        `🛣️ Distancia vial estimada: ${mi} millas (${dur} de conducción a ~50 mph)`,
      exportLegPrefix: (mi: number) =>
        `   ↳ Tramo desde parada anterior: ~${mi} mi`,
      exportCoordsPrefix: '   Coordenadas:',
      exportSummaryPrefix: '   Reseña:',
      exportMapsLinkHeader: '🗺️ Enlace de Navegación GPS en Google Maps:',
    },
    phmcModal: {
      commissionHeader: 'PENNSYLVANIA HISTORICAL AND MUSEUM COMMISSION',
      dedicatedIn: 'Dedicada en',
      eventYear: 'Año del Hito:',
      inscribeEsTab: 'Inscripción en Español',
      inscribeEnTab: 'Inscripción Original (EN)',
      historicalContextLabel: 'Trascendencia Histórica:',
      addToTripBtn: '➕ Añadir a mi Excursión',
      alreadyInTripBtn: '✓ Añadida a Mi Excursión (Parada',
      tripFullBtn: 'Itinerario completo (5/5 paradas)',
      inspectCountyBtn: (cName: string) => `Explorar ${cName} County →`,
    },
    welcomeGuide: {
      kicker: (stepNum: string) =>
        `MANUAL INTERACTIVO DEL ATLAS · PASO ${stepNum} DE 05`,
      title: 'Manual Interactivo de Bienvenida — Keystone ChronoMap',
      stepLabel: (num: string) => `PASO ${num}`,
      highlightsHeader: 'Funciones Clave en este Paso:',
      skipBtn: 'Omitir guía e ir al mapa',
      prevBtn: 'Anterior',
      nextBtn: 'Siguiente',
      startBtn: '¡Comenzar Exploración!',
    },
    teacherToolbar: {
      kicker: 'PDE CLASSROOM MODE',
      title: '🎓 Modo Docente Activo',
      exitTitle: 'Salir del Modo Docente',
      smartboardBtn: 'Proyección Smartboard',
      whiteboardHeader: 'Pizarra Táctil sobre Mapa',
      strokesCount: (n: number) => `${n} trazo${n === 1 ? '' : 's'}`,
      toolNavigate: 'Navegar Mapa',
      toolPen: 'Pluma Libre',
      toolArrow: 'Flecha Táctica',
      toolCircle: 'Círculo',
      undoTitle: 'Deshacer último trazo',
      clearTitle: 'Borrar toda la pizarra',
      primarySourcesBtn: 'Cápsulas de Fuentes Primarias',
      worksheetBtn: 'Generar Guía Imprimible (PDF)',
      triviaBtn: 'Desafío Rápido / Trivia de Aula',
      triviaCountBadge: '20 Preg.',
      sourcesModalKicker:
        'DOCUMENTOS FUNDACIONALES · PDE ACADEMIC STANDARDS (8.2 PENNSYLVANIA HISTORY)',
      sourcesModalTitle:
        'Cápsulas de Fuentes Primarias y Seminario Socrático',
      authorOriginLabel: 'Autoría / Origen:',
      verbatimEnHeader: 'Texto Original en Inglés:',
      translatedEsHeader:
        'Cita Textual de Archivo (Traducción al Español):',
      historicalContextHeader:
        'Contexto Histórico y Territorial en Pensilvania',
      socraticHeader: 'Preguntas Socráticas para el Aula',
      officialReposHeader: 'Repositorios Oficiales Verificados',
      linkedCountiesHeader: 'Jurisdicciones Vinculadas en el Atlas:',
      generateWorksheetCta:
        'Generar Guía Imprimible PDE con esta Fuente Primaria',
    },
    worksheet: {
      modalKicker:
        'GENERADOR DE GUÍAS DE CLASE (45 MIN) · PDE ACADEMIC STANDARDS 8.2',
      modalTitle:
        'Hoja de Trabajo Cartográfica e Histórica (Formato Ahorro de Tinta B/N)',
      printBtn: '🖨️ Imprimir / Guardar en PDF',
      schoolLabel: '1. Institución / Escuela',
      countyLabel: '2. Condado de Estudio (67)',
      sourceLabel: '3. Fuente Primaria Oficial',
      standardLabel: '4. Estándar Académico PDE',
      sheetHeaderKicker:
        'KEYSTONE CHRONOMAP · ATLAS HISTÓRICO DE PENSILVANIA · GUÍA DE AULA (45 MIN)',
      referenceEra: 'Época de Referencia:',
      officialStandardBox: 'ESTÁNDAR OFICIAL PDE',
      studentName: 'Nombre del Estudiante:',
      courseGroup: 'Curso / Grupo:',
      dateLabel: 'Fecha:',
      curriculumAlignment:
        'Alineación Curricular (Pennsylvania Department of Education — 8.2 Pennsylvania History):',
      part1Title: (cName: string, founded: number) =>
        `Parte I. Investigación Cartográfica: Condado de ${cName} (${founded})`,
      duration15: '15 Minutos',
      colCountyFips: 'Condado / FIPS',
      colFounded: 'Año de Fundación',
      colSeat: 'Sede Condal (Seat)',
      colRegionArea: 'Región / Superficie',
      etymologyAndHistory: 'Etimología e Historia:',
      economyAndIndigenous: 'Vocación Económica y Raíz Indígena:',
      precolonialTerritory: 'Territorio precolonial:',
      activity1Title:
        '1. Actividad con el Atlas Cartográfico (Modo "Antes vs. Hoy" y Línea de Tiempo):',
      activity1Prompt: (eraLabel: string, cName: string, seat: string) =>
        `Utilizando Keystone ChronoMap en la época ${eraLabel}, explica cómo influyeron la geografía física (ríos, valles o montes Alleghenies) y los recursos económicos en la fundación del Condado de ${cName} y la elección de ${seat} como su sede administrativa:`,
      part2Title: (srcTitle: string) =>
        `Parte II. Análisis de Fuente Primaria: ${srcTitle}`,
      duration20: '20 Minutos',
      sourceHeader: 'FUENTE:',
      officialArchiveHeader: 'ARCHIVO OFICIAL:',
      socraticQuestionA: 'Pregunta de Desarrollo Socrático A:',
      socraticQuestionB: 'Pregunta de Desarrollo Socrático B:',
      part3Title: (code: string) =>
        `Parte III. Rúbrica Rápida de Evaluación (PDE Standard ${code})`,
      scoreLabel: 'Calificación: ____ / 12 pts',
      rubricLevel3: 'Nivel 3: Avanzado / Dominio (4 pts)',
      rubricLevel2: 'Nivel 2: Competente / En Desarrollo (3 pts)',
      rubricLevel1: 'Nivel 1: Inicial / Requiere Apoyo (1–2 pts)',
      rubricRow1Col3: (cName: string, seat: string, founded: number) =>
        `Precisión Cartográfica e Histórica: Relaciona con exactitud las fronteras del condado de ${cName}, su sede (${seat}), año de fundación (${founded}) y su contexto regional dentro de Pensilvania.`,
      rubricRow1Col2: (cName: string) =>
        `Identifica los datos básicos del condado de ${cName} y su época, pero describe de forma general la relación entre la geografía física y su evolución económica.`,
      rubricRow1Col1: (eraLabel: string) =>
        `Menciona datos aislados del condado sin vincularlos con la época histórica (${eraLabel}) ni con las regiones de Pensilvania.`,
      rubricRow2Col3: (srcTitle: string) =>
        `Análisis de Fuente Primaria: Cita evidencia textual directa de ${srcTitle} y argumenta con rigor crítico ambas preguntas socráticas.`,
      rubricRow2Col2:
        'Comprende la idea central de la fuente primaria y responde ambas preguntas, aunque con uso limitado de citas textuales o contexto estatal.',
      rubricRow2Col1:
        'Parafrasea superficialmente el documento primario o deja incompleta la argumentación histórica solicitada.',
      includeDualLangQuoteLabel:
        'Incluir también cita original en inglés (Bilingüe ES/EN)',
      closePreviewBtn: 'Cerrar vista previa',
      printNowBtn: 'Imprimir Guía Ahora',
    },
    support: {
      headerBtn: 'Apoyar Proyecto',
      headerBtnTitle: 'Apoya este Proyecto Educativo — Donaciones y Patrocinio',
      footerLink: 'Apoyar este Proyecto Educativo',
      footerCopyright: 'Keystone ChronoMap · Atlas Histórico de Acceso Abierto de Pensilvania',
      modalKicker: 'CARTOGRAFÍA DE ARCHIVO ABIERTA · MECENAZGO EDUCATIVO',
      modalTitle: 'Apoya este Proyecto Educativo',
      impactMessage:
        'Keystone ChronoMap es gratuito y de acceso abierto para estudiantes, docentes y entusiastas de la historia. Tu contribución ayuda a cubrir servidores en la nube, curaduría de datos históricos y nuevas herramientas educativas.',
      tabZelleCashApp: '💵 Zelle & Cash App',
      tabZelleSubtitle: 'Pagos Rápidos en EE. UU.',
      tabCrypto: '🪙 Criptomonedas / Crypto',
      tabCryptoSubtitle: 'BTC, ETH, ADA, SOL',
      copiedBadge: '✓ Copied! / ¡Copiado!',
      zelleTitle: 'Zelle',
      zelleBadge: 'Transferencia Bancaria EE. UU.',
      zelleEmailLabel: 'Zelle Email',
      copyEmailBtn: 'Copy Email',
      cashAppTitle: 'Cash App',
      cashAppBadge: 'Envío Directo Instantáneo',
      cashtagLabel: 'Cashtag',
      openCashAppBtn: 'Open Cash App',
      copyCashtagBtn: 'Copy $Cashtag',
      cryptoAddressLabel: 'Dirección de Billetera',
      copyAddressBtn: 'Copiar Dirección',
      viewQrBtn: 'Ver QR',
      hideQrBtn: 'Ocultar QR',
      qrScanHint: 'Escanea desde tu billetera móvil',
      securityNote:
        'Por favor verifica la red y la dirección de billetera antes de enviar. Gracias por apoyar la educación abierta.',
      closeBtn: 'Volver al Atlas Histórico',
    },
    outreach: {
      footerLink: '🏛️ Acerca y Comunidad PA',
      modalKicker:
        'PRESENTACIÓN INSTITUCIONAL · DIFUSIÓN EDUCATIVA Y CULTURAL EN PENSILVANIA',
      modalTitle:
        'Keystone ChronoMap — Diseñado para Escuelas, Museos y Comunidades de Pensilvania',
      modalSubtitle:
        'Un atlas histórico, cartográfico y demográfico interactivo de acceso abierto que conecta los 67 condados de Pensilvania desde la Carta Real de 1681 hasta la actualidad.',
      pillarsSectionTitle: 'Propuesta de Valor por Sector en la Mancomunidad',
      pillar1Badge: 'PDE ACADEMIC STANDARDS 8.2 Y 7.1',
      pillar1Title: '1. Escuelas K-12 y Docentes PDE',
      pillar1Desc:
        'Herramienta gratuita alineada a los estándares académicos de Historia y Geografía de Pensilvania (PDE Academic Standards), equipada con modo de proyección Smartboard, pizarra táctil, cápsulas de fuentes primarias, trivia de aula y generador de guías imprimibles en PDF.',
      pillar1Action: 'Activar Modo Docente',
      pillar2Badge: '67 CONDADOS · 25 PLACAS PHMC',
      pillar2Title: '2. Sociedades Históricas Condales y Museos',
      pillar2Desc:
        'Vitrina digital abierta para difundir el patrimonio local, años de fundación, sedes condales, líderes históricos y las Placas Oficiales Azul y Oro de la PHMC en los 67 condados.',
      pillar2Action: 'Abrir Índice de 67 Condados',
      pillar3Badge: 'RUTAS GPS MULTIPARADA',
      pillar3Title: '3. Turismo Cultural y Áreas Patrimoniales',
      pillar3Desc:
        'Planificador interactivo de excursiones (Field Trip Builder) que calcula distancias viales reales y abre itinerarios de hasta 5 paradas directamente en Google Maps para impulsar el turismo educativo estatal.',
      pillar3Action: 'Explorar Mapa y Rutas',
      pillar4Badge: 'ACCESIBILIDAD BILINGÜE EN / ES',
      pillar4Title: '4. Comunidades Bilingües e Hispanas (EN / ES)',
      pillar4Desc:
        'Acceso inclusivo con traducción instantánea EN/ES, audioguía histórica bilingüe por voz e indicadores demográficos completos para familias y programas escolares ESL / Dual Language en Pensilvania.',
      pillar4Action: 'Alternar Idioma EN / ES',
      shareSectionTitle: 'Comparte con tu Distrito Escolar, Museo o Comunidad',
      shareSectionDesc:
        'Ayuda a que directores de escuelas, docentes, sociedades históricas y familias de Pensilvania conozcan esta plataforma educativa gratuita:',
      shareLinkedInBtn: 'Compartir en LinkedIn',
      shareLinkedInSub: 'Ideal para Directores, Docentes e Historiadores',
      shareFacebookBtn: 'Compartir en Facebook',
      shareFacebookSub: 'Grupos Comunitarios y Culturales de PA',
      shareWhatsAppBtn: 'Enviar por WhatsApp',
      shareWhatsAppSub: 'Mensaje Directo a Colegas y Familias',
      copyOutreachBtn: 'Copiar Enlace Oficial con Mensaje de Presentación',
      copiedOutreachBadge: '✓ ¡Enlace y Mensaje de Presentación Copiados!',
      outreachPitchText:
        '🏛️ Conoce Keystone ChronoMap — el Atlas Histórico, Demográfico y Cívico interactivo y gratuito de los 67 condados de Pensilvania (1681–Actualidad). Incluye herramientas de aula PDE, placas PHMC, pirámides censales y audioguía bilingüe (EN/ES):',
      pwaInstallHint:
        '💻 Listo para Chromebooks e iPads Escolares: Docentes y estudiantes pueden instalar Keystone ChronoMap desde la barra del navegador como aplicación educativa nativa (PWA).',
      closeBtn: 'Volver al Atlas Interactivo',
    },
    comicEncyclopedia: {
      modalKicker:
        'ENCICLOPEDIA DIGITAL EN CARICATURA · 6 CAPÍTULOS · 1681 – PRESENTE',
      modalTitle:
        '🦸‍♂️ Las Aventuras de Keystone ChronoMap: Historia de Pensilvania en Caricaturas',
      modalSubtitle:
        'Explora los 67 condados, cartas fundacionales, batallas, titanes industriales y censos a través de historietas generadas en vivo en HTML5 Canvas y fuentes primarias verificadas.',
      chapterPrefix: 'Capítulo',
      listenComicLabel: '🔊 Escuchar Historieta',
      downloadChapterPdfBtn: '📥 Descargar Capítulo (PDF)',
      downloadFullBookPdfBtn:
        '📚 Descargar Libro Completo de Historietas (PDF)',
      preparingPdfBadge: '⏳ Preparando Páginas de Cómic en Alta Resolución...',
      viewCountiesOnMapBtn: '🗺️ Ver Condados de este Capítulo en el Mapa',
      expandedFactBadge: 'DATO ENCICLOPÉDICO AMPLIADO',
      directSourcesHeader:
        '📚 Fuentes Directas Oficiales (Haz clic para consultar los archivos)',
      prevChapterBtn: '← Capítulo Anterior',
      nextChapterBtn: 'Siguiente Capítulo →',
      closeBtn: 'Cerrar Enciclopedia',
      printCoverSubtitle:
        'Libro de Historietas Educativo y de Archivo sobre los 67 Condados de Pensilvania (1681–Presente)',
      printFooterNote:
        'Generado por Keystone ChronoMap — Atlas Histórico, Demográfico y Cívico de Acceso Abierto de Pensilvania',
      mode2dComicsBtn: '🎨 Historietas 2D (6 Capítulos)',
      mode3dStageBtn: '🏛️ Escenario de Personajes 3D (WebGL)',
      stage3dBadge: 'DIORAMA MUSEOGRÁFICO 3D WEBGL · ILUMINACIÓN PBR',
      stageSelectTownLabel: 'Pueblo / Escenario de PA:',
      stageSelectCountyAria: 'Seleccionar cualquiera de los 67 condados para el Escenario 3D',
      stageJumpAnyCountyPlaceholder: 'Ir a cualquiera de los 67 condados...',
      reset3dCameraBtn: 'Restablecer Vista 360°',
      stage3dInteractHint: 'Arrastra para rotar 360° · Zoom con rueda · Clic en figura 3D',
      capture3dSnapshotBtn: '📸 Capturar Escenario 3D para PDF',
      stageControlsBtn: 'Controles de Estudio',
      toggle3dPinsBtn: 'Etiquetas 3D',
      snapshotCapturedBadge: '✓ ¡Captura 3D añadida al Libro PDF!',
      listen3dBioLabel: '🔊 Escuchar Biografía',
      sculptedArtifactsHeader: 'Atuendo y Artefactos Históricos Esculpidos en 3D:',
      officialCuratorSourceLink: 'Verificar en Archivo Histórico Oficial',
      print3dSectionTitle: 'Captura del Diorama Museográfico de Personajes Históricos en 3D',
    },
    aiAssistant: {
      fabLabel: 'Asistente IA',
      fabAria: 'Abrir Asistente IA con Reconocimiento de Voz y Navegación',
      headerTitle: 'Asistente IA Keystone',
      headerSubtitle: (countyName: string) =>
        `Contexto Activo: Condado de ${countyName} · Voz y Texto`,
      welcomeMessage: (countyName: string) =>
        `👋 ¡Hola! Soy tu **Asistente IA de Keystone ChronoMap**. Estamos explorando el **Condado de ${countyName}**. Pregúntame por **voz (🎤)** o **texto**, o pídeme navegar por el atlas (ej. *"Llévame a Gettysburg"*, *"Ver Escenario 3D"*, *"Demografía de Scranton"* o *"Comparar 1682 vs. Hoy"*).`,
      inputPlaceholder: 'Pregunta sobre Pensilvania o da un comando de voz...',
      listeningStatus: '🎙️ Escuchando... Habla ahora (ES-US)',
      micBtnTitle: 'Hablar por micrófono (Reconocimiento de Voz)',
      sendBtnTitle: 'Enviar consulta',
      listenReplyTitle: 'Escuchar respuesta en voz alta',
      stopSpeechTitle: 'Detener lectura por voz',
      clearChatTitle: 'Reiniciar conversación',
      settingsTitle: 'Preferencias de Voz y Asistente',
      autoVoiceLabel: 'Leer respuestas automáticamente en voz alta',
      speechSpeedLabel: 'Velocidad de narración:',
      micPermissionError:
        'El permiso de micrófono fue denegado o no está disponible en este navegador. ¡Puedes escribir cualquier pregunta o comando abajo!',
      typingIndicator: 'Consultando los Archivos Históricos de Pensilvania...',
    },
    leftRail: {
      railAria: 'Riel de Controles, Asistente IA y Mi Excursión',
      territoriesTooltip: '🗺️ Territorios y Fronteras',
      territoriesDrawerTitle: 'Territorios y Fronteras',
      territoriesIntro:
        'Alterna entre los 67 condados actuales y las fusiones territoriales históricas (Turf.js):',
      modern67Sub: 'Fronteras actuales de los 67 condados',
      penn1682Sub: 'Philadelphia, Bucks, Chester + Tierras Indígenas',
      const1787Sub: '18 Condados de la etapa Constitucional',
      layersTooltip: '📍 Capas y Placas PHMC',
      layersDrawerTitle: 'Capas y Placas PHMC',
      aiGuideTooltip: '✨ Asistente IA',
      fieldTripsTooltip: (count: number) =>
        count > 0 ? `🚌 Mi Excursión (${count})` : '🚌 Mi Excursión',
      teacherModeTooltip: '🎓 Modo Docente',
      stopAddedToast: (title: string, count: number, max: number) =>
        `🚌 "${title}" añadido a Mi Excursión (${count}/${max})`,
      openTripsBtn: 'Ver Ruta',
    },
    footer: {
      ariaLabel: 'Información legal y pie de página',
      navAriaLabel: 'Enlaces legales y contacto',
      copyrightLine:
        '© 2026 Keystone ChronoMap · Atlas Educativo e Histórico Independiente de Pensilvania.',
      termsLink: 'Términos de Uso',
      privacyLink: 'Política de Privacidad',
      contactLink: 'Contacto',
    },
    creatorContact: {
      kicker: 'ARQUITECTO Y CREADOR DE LA PLATAFORMA',
      headline:
        'Analista Senior de Sistemas de Negocio | Gestión de Requerimientos y Mejora de Procesos',
      location: 'Pensilvania, Estados Unidos',
      availabilityBadge:
        'Disponible para Oportunidades Remotas e Híbridas en EE. UU.',
      bioHeader: 'Resumen Profesional y Misión',
      bioSummary:
        'Analista Senior de Sistemas de Negocio con más de 10 años de experiencia conectando necesidades estratégicas con soluciones tecnológicas mediante análisis de sistemas, documentación de requerimientos, automatización de procesos y visualización de datos. Aplicando su experiencia en estructurar información compleja y transformarla en herramientas prácticas, creó Keystone ChronoMap como un atlas educativo de acceso abierto para las comunidades de Pensilvania.',
      skillsHeader: 'Especialidades Clave y Stack Técnico',
      coreSkills: [
        'Systems Analysis',
        'Requirements Management',
        'Process Improvement',
        'SQL & Power BI',
        'SharePoint / M365',
        'Agile / Azure DevOps',
        'Bilingual (EN/ES)',
      ],
      linkedinBtn: 'Conectar en LinkedIn',
      directEmailLabel: 'Correo Directo',
      copyEmailBtn: 'Copiar Correo',
      copiedBadge: '✓ ¡Copiado!',
      emailActionBtn: 'Escribir',
      sendEmailTitle: 'Enviar correo directo a cesil.roa@gmail.com',
      supportLink: 'Apoyar este proyecto educativo',
      closeBtn: 'Cerrar',
      closeAria: 'Cerrar ventana de contacto del creador',
    },
  },
};

/**
 * Region translations in US English
 */
export const REGION_TRANSLATIONS_EN: Record<
  RegionId,
  { title: string; shortName: string }
> = {
  southeast: {
    title: 'Southeast · Colonial Cradle & Delaware Valley',
    shortName: 'Southeast',
  },
  northeast: {
    title: 'Northeast · Lehigh Valley, Poconos & Anthracite',
    shortName: 'Northeast',
  },
  southcentral: {
    title: 'South Central · Susquehanna Valley & PA Dutch',
    shortName: 'South Central',
  },
  alleghenies: {
    title: 'Central · Alleghenies, Laurel Highlands & Northern Tier',
    shortName: 'Alleghenies & Central',
  },
  western: {
    title: 'Western · Pittsburgh, Ohio Valley & Lake Erie',
    shortName: 'Western & Erie',
  },
};

/**
 * 6 Historical Eras in US English
 */
export const ERA_TRANSLATIONS_EN: Record<
  EraId,
  { yearLabel: string; title: string; subtitle: string; summary: string }
> = {
  '1681': {
    yearLabel: '1681',
    title: "William Penn's Royal Charter & The Three Original Counties",
    subtitle: 'Quaker Foundation & Indigenous Treaties (1681–1682)',
    summary:
      'King Charles II granted William Penn the colonial charter of Pennsylvania in March 1681. In 1682, Penn organized the "Holy Experiment" around three original counties along the Delaware River: Philadelphia, Bucks, and Chester, forging peace treaties with the Lenni-Lenape (Delaware) Nation.',
  },
  '1776': {
    yearLabel: '1776',
    title: 'Independence, Frontier & Constitutional Birth',
    subtitle: 'Philadelphia, York, Lancaster & Revolutionary Expansion',
    summary:
      'With 11 established counties by 1776, Pennsylvania became the epicenter of the American Revolution. While Philadelphia hosted the Declaration of Independence, the Continental Congress relocated to Lancaster and York during the British occupation of 1777–1778, and the Continental Army endured the winter at Valley Forge.',
  },
  '1861': {
    yearLabel: '1861',
    title: 'Union Bastion & Turning Point at Gettysburg',
    subtitle: '65 Counties Established · Arsenal of the Union',
    summary:
      'On the outbreak of the Civil War in 1861, 65 of the 67 counties had already been organized. Pennsylvania supplied troops, steel, coal, and railways to the Union, culminating in the Battle of Gettysburg (Adams County, July 1863) and President Lincoln’s Gettysburg Address.',
  },
  '1870': {
    yearLabel: '1870',
    title: 'Industrial Hegemony: Steel, Anthracite & Oil',
    subtitle: 'Titusville, Pittsburgh, Scranton & All 67 Counties Complete',
    summary:
      'Following Drake’s first commercial oil well in Titusville (Crawford, 1859), Bessemer steel mills in Pittsburgh (Allegheny) and Bethlehem (Northampton), and anthracite coal in Wilkes-Barre and Scranton, Lackawanna County was founded in 1878, completing the modern map of 67 counties.',
  },
  '1950': {
    yearLabel: '1950',
    title: 'Mid-Century Peak, Pennsylvania Turnpike & Modernization',
    subtitle: 'Industrial Zenith, Highways & Environmental Conservation',
    summary:
      'By 1950, Pennsylvania exceeded 10.4 million residents. The pioneering Pennsylvania Turnpike connected the Alleghenies from Carlisle to Pittsburgh, while metropolitan suburbs expanded in Montgomery, Delaware, and Bucks counties alongside state forest renewal.',
  },
  present: {
    yearLabel: 'Present',
    title: 'Contemporary Commonwealth: 67 Counties of Innovation & Heritage',
    subtitle: 'Biomedicine, Robotics, Logistics, Agriculture & Historical Archive',
    summary:
      'Today, the 67 counties of the Keystone State integrate four centuries of cartographic heritage with world-class research universities, robotics and healthcare hubs in Pittsburgh and Philadelphia, agro-industrial leadership in Lancaster, and natural reserves across the Pennsylvania Wilds.',
  },
};

/**
 * PHMC Categories in US English
 */
export const PHMC_CATEGORY_TRANSLATIONS_EN: Record<
  PhmcCategory | 'all',
  { label: string; shortLabel: string }
> = {
  all: {
    label: 'All Categories (25 Plaques)',
    shortLabel: 'All (25)',
  },
  industria: {
    label: 'Industry, Steel & Anthracite Coal',
    shortLabel: 'Industry & Coal',
  },
  derechos_civiles: {
    label: 'Civil Rights & Abolitionism',
    shortLabel: 'Civil Rights',
  },
  inventos: {
    label: 'Inventions, Science & Engineering',
    shortLabel: 'Inventions & Science',
  },
  mujeres_pioneras: {
    label: 'Pioneering Women of Pennsylvania',
    shortLabel: 'Pioneering Women',
  },
  militar_politica: {
    label: 'Political & Military History',
    shortLabel: 'Political History',
  },
};

/**
 * Curated English County Dossiers & Algorithmic English Builder for all 67 Counties
 */
const CURATED_COUNTY_DOSSIERS_EN: Record<
  string,
  {
    etymology: string;
    historicalImportance: string;
    economicProfile: string;
    indigenousHeritage: string;
    keyLandmark: string;
  }
> = {
  Philadelphia: {
    etymology:
      'Named by William Penn from the ancient Greek meaning "Brotherly Love" (philos + adelphos), inspired by the Biblical city in Asia Minor.',
    historicalImportance:
      'One of the three original counties founded in 1682. Hosted the First and Second Continental Congresses, the signing of the Declaration of Independence (1776), the Constitutional Convention (1787), and served as U.S. national capital from 1790 to 1800.',
    economicProfile:
      'Historically a global shipbuilding, textile, and financial hub; today anchored by biotechnology, university hospital systems ("Eds & Meds"), finance, and the Port of Philadelphia.',
    indigenousHeritage:
      'Ancestral territory of the Lenni-Lenape (Delaware) Nation, centered around the village of Shackamaxon along the Delaware River.',
    keyLandmark: 'Independence Hall & Liberty Bell (UNESCO World Heritage Site)',
  },
  Bucks: {
    etymology:
      'Named by William Penn in 1682 after Buckinghamshire, England, ancestral home of the Penn family.',
    historicalImportance:
      'One of Pennsylvania’s three original counties (1682). Site of William Penn’s country estate at Pennsbury Manor and General George Washington’s decisive crossing of the Delaware River on Christmas night, December 25, 1776.',
    economicProfile:
      'Combines Delaware River industrial corridors (Fairless Hills), biotechnology, tourism in New Hope and Doylestown, and fertile agricultural valleys.',
    indigenousHeritage:
      'Traditional homeland of the Lenni-Lenape (Unami), shaped by early deeds and the controversial Walking Purchase of 1737.',
    keyLandmark: 'Washington Crossing Historic Park & Pennsbury Manor',
  },
  Chester: {
    etymology:
      'Named by William Penn after the city of Cheshire (Chester) in England, port of departure for many early Quaker settlers.',
    historicalImportance:
      'One of the three original counties of 1682. Site of the Battle of Brandywine (September 1777), the Paoli Battlefield, and the southern flank of the Valley Forge winter encampment.',
    economicProfile:
      'World capital of mushroom cultivation in Kennett Square, combined with high-tech, pharmaceutical, and financial corporate campuses along the Route 202 corridor.',
    indigenousHeritage:
      'Lenni-Lenape (Okehocking Band) territory along the Brandywine and Schuylkill creeks.',
    keyLandmark: 'Brandywine Battlefield & Longwood Gardens',
  },
  Lancaster: {
    etymology:
      'Named after Lancashire, England, native county of colonial magistrate John Wright.',
    historicalImportance:
      'Pennsylvania’s fourth county, erected in 1729 from Chester County. Served as capital of the Continental Congress on September 27, 1777, state capital of Pennsylvania (1799–1812), and stronghold of abolitionist Congressman Thaddeus Stevens.',
    economicProfile:
      'Premier non-irrigated agricultural county in the eastern United States, famed for Pennsylvania Dutch/Amish farming, food processing, and cultural heritage tourism.',
    indigenousHeritage:
      'Conestoga (Susquehannock) and Shawnee settlements along the lower Susquehanna River.',
    keyLandmark: 'Central Market Lancaster, Wheatland & Ephrata Cloister',
  },
  York: {
    etymology:
      'Named after the House of York and the city of York in Yorkshire, England.',
    historicalImportance:
      'First county created west of the Susquehanna River (1749). From September 1777 to June 1778, York served as the national capital where the Continental Congress adopted the Articles of Confederation.',
    economicProfile:
      'Major manufacturing, precision machinery, Harley-Davidson motorcycle assembly, snack food production, and fertile piedmont agriculture.',
    indigenousHeritage:
      'Susquehannock and Shawnee river corridors west of the Susquehanna.',
    keyLandmark: 'Colonial Complex & Continental Congress Courthouse in York',
  },
  Adams: {
    etymology:
      'Named in 1800 in honor of John Adams, second President of the United States.',
    historicalImportance:
      'World-renowned site of the Battle of Gettysburg (July 1–3, 1863), the bloodiest engagement of the American Civil War, and President Abraham Lincoln’s Gettysburg Address (November 19, 1863).',
    economicProfile:
      'Heart of Pennsylvania’s South Mountain apple and fruit orchard belt, historical tourism, and higher education (Gettysburg College).',
    indigenousHeritage:
      'Susquehannock and Tuscarora seasonal hunting trails across the South Mountain pass.',
    keyLandmark: 'Gettysburg National Military Park & Soldiers’ National Cemetery',
  },
  Allegheny: {
    etymology:
      'Derived from the Lenape word "Allegewi" or "oolikhanna," meaning "fine river" or "stream of the Alligewi."',
    historicalImportance:
      'Established in 1788 at the strategic Forks of the Ohio (Fort Duquesne / Fort Pitt). Forged America’s industrial might as the Steel Capital of the World under Andrew Carnegie, Henry Clay Frick, and George Westinghouse.',
    economicProfile:
      'Transitioned from 19th–20th century steel, glass, and aluminum manufacturing into a global powerhouse of robotics, AI, autonomous systems, biomedical research, and finance.',
    indigenousHeritage:
      'Strategic council ground of the Seneca (Haudenosaunee), Shawnee, and Lenape at the confluence of the Allegheny, Monongahela, and Ohio rivers.',
    keyLandmark: 'Point State Park (Fort Pitt), Carrie Blast Furnaces & Duquesne Incline',
  },
  Lackawanna: {
    etymology:
      'From the Lenape word "Lechauhanne," meaning "the stream that forks."',
    historicalImportance:
      'Founded in 1878 as Pennsylvania’s 67th and youngest county. Scranton pioneered the first commercial electric streetcar system in the United States in 1886 ("The Electric City") and massive anthracite coal and iron production.',
    economicProfile:
      'Historic anthracite mining and steam locomotive hub; today centered on healthcare, higher education, logistics along I-81, and industrial heritage.',
    indigenousHeritage:
      'Munsee-Lenape village of Capouse Meadows at the confluence of the Lackawanna River and Roaring Brook.',
    keyLandmark: 'Steamtown National Historic Site & Scranton Iron Furnaces',
  },
  Dauphin: {
    etymology:
      'Named in 1785 in honor of Louis-Joseph, Dauphin of France (eldest son of King Louis XVI), recognizing French alliance in the American Revolution.',
    historicalImportance:
      'Home to Harrisburg, designated capital of the Commonwealth of Pennsylvania in 1812, and site of Camp Curtin, the largest Union military training camp of the Civil War.',
    economicProfile:
      'State government administration, multimodal railroad and highway logistics, chocolate manufacturing in Hershey, and river commerce.',
    indigenousHeritage:
      'Paxtang village of the Susquehannock and Lenape along the Susquehanna River crossing.',
    keyLandmark: 'Pennsylvania State Capitol Complex & Hershey Museum',
  },
  Crawford: {
    etymology:
      'Named in 1800 after Colonel William Crawford, Revolutionary War officer and surveyor associated with George Washington.',
    historicalImportance:
      'In Titusville on August 27, 1859, "Colonel" Edwin L. Drake drilled the world’s first commercial oil well along Oil Creek, igniting the global petroleum industry.',
    economicProfile:
      'Precision tooling and die manufacturing in Meadville (birthplace of the modern zipper), agriculture, and petroleum heritage.',
    indigenousHeritage:
      'Seneca Nation oil-skimming pits along Oil Creek and French Creek.',
    keyLandmark: 'Drake Well Museum & Park (Titusville)',
  },
  Erie: {
    etymology:
      'Named after Lake Erie and the Indigenous Erie ("Erielhonan") Nation.',
    historicalImportance:
      'Acquired via the 1792 Erie Triangle purchase to give Pennsylvania direct access to the Great Lakes. At Presque Isle Bay, Commodore Oliver Hazard Perry built the U.S. fleet that won the Battle of Lake Erie (1813).',
    economicProfile:
      'Great Lakes maritime shipping port, locomotive manufacturing, plastics engineering, viticulture, and Presque Isle tourism.',
    indigenousHeritage:
      'Ancestral territory of the Erie Nation and later the Seneca (Haudenosaunee Confederacy).',
    keyLandmark: 'Presque Isle State Park & U.S. Brig Niagara (Erie Maritime Museum)',
  },
  Montgomery: {
    etymology:
      'Named in 1784 in honor of General Richard Montgomery, Revolutionary War hero who fell at Quebec in 1775.',
    historicalImportance:
      'Site of the 1777–1778 Valley Forge winter encampment where General George Washington and Baron von Steuben forged the Continental Army into a unified fighting force.',
    economicProfile:
      'One of Pennsylvania’s wealthiest and most populous counties, leading in pharmaceuticals, biotechnology, financial services, and engineering.',
    indigenousHeritage:
      'Lenni-Lenape settlements along the Schuylkill River and Perkiomen Creek.',
    keyLandmark: 'Valley Forge National Historical Park & Mill Grove (Audubon)',
  },
  Somerset: {
    etymology: 'Named in 1795 after Somersetshire in England.',
    historicalImportance:
      'Contains Mount Davis (3,213 ft), highest natural point in Pennsylvania, and the Flight 93 National Memorial in Shanksville honoring the heroes of September 11, 2001.',
    economicProfile:
      'Laurel Highlands four-season mountain resorts, wind energy, maple syrup production, agriculture, and coal heritage.',
    indigenousHeritage:
      'Great Shamokin and Nemacolin trails across the Allegheny Front.',
    keyLandmark: 'Flight 93 National Memorial (Shanksville) & Mount Davis',
  },
};

export function getLocalizedCountyDossier(
  county: CountyRecord,
  lang: AppLanguage
) {
  if (lang === 'es') {
    return {
      etymology: county.etymology,
      historicalImportance: county.historicalImportance,
      economicProfile: county.economicProfile,
      indigenousHeritage: county.indigenousHeritage,
      keyLandmark: county.keyLandmark,
    };
  }

  const curated = CURATED_COUNTY_DOSSIERS_EN[county.name];
  if (curated) return curated;

  const regEn = REGION_TRANSLATIONS_EN[county.region].title;
  return {
    etymology: `${county.name} County was established in ${county.founded} with its county seat at ${county.countySeat}, preserving the naming heritage of Pennsylvania's ${regEn}.`,
    historicalImportance: `Incorporated in ${county.founded} during the territorial organization of the ${regEn}. Centered on ${county.countySeat}, ${county.name} County played a strategic role connecting Pennsylvania's river valleys, turnpikes, canals, and rail corridors across ${county.areaSqMi.toLocaleString('en-US')} square miles.`,
    economicProfile: `Anchored by regional commerce in ${county.countySeat}, combining historic agriculture, timber, mineral resources, and manufacturing with modern healthcare, education, and heritage tourism.`,
    indigenousHeritage: `Pre-colonial homeland and seasonal trails of Indigenous nations documented in the Commonwealth archives (${county.indigenousHeritage}).`,
    keyLandmark: county.keyLandmark,
  };
}

export function getLocalizedEra(era: HistoricalEra, lang: AppLanguage) {
  if (lang === 'es') {
    return {
      yearLabel: era.id === 'present' ? 'Presente' : era.yearLabel,
      title: era.title,
      subtitle: era.subtitle,
      summary: era.summary,
    };
  }
  return ERA_TRANSLATIONS_EN[era.id];
}

export function getLocalizedRegion(regionId: RegionId, lang: AppLanguage) {
  const reg = PA_REGIONS[regionId];
  if (lang === 'es') {
    return {
      title: reg.spanishTitle,
      shortName: reg.shortName,
    };
  }
  return REGION_TRANSLATIONS_EN[regionId];
}

/**
 * English translations for the 11 Historical Events & Battles
 */
export const EVENT_TRANSLATIONS_EN: Record<
  string,
  {
    title: string;
    shortTitle: string;
    dateLabel: string;
    summary: string;
    significance: string;
  }
> = {
  'shackamaxon-penn-treaty-1682': {
    title: 'Treaty of Shackamaxon (William Penn & Chief Tamanend)',
    shortTitle: 'Penn Treaty (Shackamaxon)',
    dateLabel: 'Late 1682',
    summary:
      'Under the Great Elm at Shackamaxon along the Delaware River, William Penn and Lenni-Lenape Chief Tamanend forged a covenant of peaceful coexistence and mutual respect.',
    significance:
      'Voltaire immortalized it as "the only treaty between Christians and Indigenous peoples never sworn to and never broken."',
  },
  'independence-hall-1776': {
    title: 'Declaration of Independence & U.S. Constitution (Independence Hall)',
    shortTitle: 'Independence Hall (1776/1787)',
    dateLabel: 'July 4, 1776 / Sept 17, 1787',
    summary:
      'Inside the Pennsylvania State House in Philadelphia, the Second Continental Congress adopted the Declaration of Independence in 1776 and framed the U.S. Constitution in 1787.',
    significance:
      'Birthplace of the United States and constitutional cornerstone of the Commonwealth of Pennsylvania.',
  },
  'battle-of-brandywine-1777': {
    title: 'Battle of Brandywine',
    shortTitle: 'Battle of Brandywine',
    dateLabel: 'September 11, 1777',
    summary:
      'General George Washington’s Continental Army clashed with General William Howe’s British and Hessian forces along Brandywine Creek near Chadds Ford, Chester County.',
    significance:
      'Largest single-day land engagement of the American Revolutionary War by troop count, prompting Congress to relocate to Lancaster and York.',
  },
  'valley-forge-encampment-1777': {
    title: 'Continental Army Winter Encampment at Valley Forge',
    shortTitle: 'Valley Forge (1777–1778)',
    dateLabel: 'December 1777 – June 1778',
    summary:
      'Over 12,000 Continental soldiers endured a harsh winter on the Schuylkill River heights while Baron Friedrich von Steuben trained the army in unified military drill.',
    significance:
      'Crucible of professional transformation for the Continental Army alongside news of the French Alliance.',
  },
  'york-articles-confederation-1777': {
    title: 'Adoption of the Articles of Confederation in York',
    shortTitle: 'Articles of Confederation (York)',
    dateLabel: 'November 15, 1777',
    summary:
      'Meeting in the York County Courthouse during the British occupation of Philadelphia, the Continental Congress adopted the Articles of Confederation.',
    significance:
      'First governing constitution of the thirteen united states and first official use of the title "United States of America."',
  },
  'drake-oil-well-1859': {
    title: 'Edwin Drake’s First Commercial Oil Well (Titusville)',
    shortTitle: 'Drake Oil Well (1859)',
    dateLabel: 'August 27, 1859',
    summary:
      'Along Oil Creek in Titusville, Crawford County, Edwin L. Drake and "Uncle Billy" Smith struck subterranean crude oil at 69.5 feet using a steam-powered iron drive pipe.',
    significance:
      'Launched the modern global petroleum industry and transformed northwestern Pennsylvania within months.',
  },
  'battle-of-gettysburg-1863': {
    title: 'Battle of Gettysburg',
    shortTitle: 'Battle of Gettysburg',
    dateLabel: 'July 1–3, 1863',
    summary:
      'Union General George G. Meade’s Army of the Potomac defeated Confederate General Robert E. Lee’s Army of Northern Virginia across Little Round Top, Culp’s Hill, and Pickett’s Charge.',
    significance:
      'Decisive military turning point of the American Civil War and defense of Northern soil.',
  },
  'gettysburg-address-1863': {
    title: 'Abraham Lincoln’s Gettysburg Address',
    shortTitle: 'Gettysburg Address (Nov 1863)',
    dateLabel: 'November 19, 1863',
    summary:
      'At the dedication of the Soldiers’ National Cemetery in Gettysburg, commissioned by Governor Andrew Curtin, President Lincoln delivered his 272-word address.',
    significance:
      'Redefined the Civil War as a "new birth of freedom" and enduring defense of "government of the people, by the people, for the people."',
  },
  'burning-of-chambersburg-1864': {
    title: 'Burning of Chambersburg',
    shortTitle: 'Burning of Chambersburg',
    dateLabel: 'July 30, 1864',
    summary:
      'Confederate cavalry under General John McCausland burned the center of Chambersburg (Franklin County) after residents refused a ransom of $100,000 in gold.',
    significance:
      'Only major Northern municipality destroyed by Confederate forces during the Civil War, leaving over 2,000 citizens homeless.',
  },
  'homestead-strike-1892': {
    title: 'Homestead Steel Strike',
    shortTitle: 'Homestead Strike (1892)',
    dateLabel: 'July 6, 1892',
    summary:
      'Armed battle along the Monongahela River between Amalgamated Association of Iron and Steel Workers union members and 300 Pinkerton agents hired by Henry Clay Frick at Carnegie Steel.',
    significance:
      'Watershed conflict in U.S. labor history during the Gilded Age.',
  },
  'flight-93-shanksville-2001': {
    title: 'Flight 93 National Memorial (Shanksville)',
    shortTitle: 'Flight 93 Memorial (2001)',
    dateLabel: 'September 11, 2001',
    summary:
      'The 40 passengers and crew of United Airlines Flight 93 acted heroically over Somerset County to prevent terrorists from striking the U.S. Capitol in Washington, D.C.',
    significance:
      'Solemn national memorial in the Laurel Highlands honoring civic courage in contemporary American history.',
  },
};

export function getLocalizedEvent(
  event: HistoricalEventItem,
  lang: AppLanguage
) {
  if (lang === 'es') {
    return {
      title: event.title,
      shortTitle: event.shortTitle,
      dateLabel: event.dateLabel,
      summary: event.summary,
      significance: event.historicalImpact,
    };
  }
  return (
    EVENT_TRANSLATIONS_EN[event.id] || {
      title: event.title,
      shortTitle: event.shortTitle,
      dateLabel: event.dateLabel,
      summary: event.summary,
      significance: event.historicalImpact,
    }
  );
}

/**
 * Generic helper tData(item, field, lang) as requested:
 * Supports objects with { en, es } bilingual fields OR suffix conventions (e.g. plaqueTextEn / plaqueTextEs)
 * with automatic fallback to English.
 */
export function tData<T extends Record<string, any>>(
  item: T | null | undefined,
  field: string,
  lang: AppLanguage
): string {
  if (!item) return '';

  const directVal = item[field];
  if (
    directVal &&
    typeof directVal === 'object' &&
    ('en' in directVal || 'es' in directVal)
  ) {
    return String(directVal[lang] ?? directVal.en ?? directVal.es ?? '');
  }

  const langSuffix = lang === 'en' ? 'En' : 'Es';
  const fallbackSuffix = lang === 'en' ? 'Es' : 'En';

  if (`${field}${langSuffix}` in item && item[`${field}${langSuffix}`]) {
    return String(item[`${field}${langSuffix}`]);
  }
  if (
    `${field}${fallbackSuffix}` in item &&
    item[`${field}${fallbackSuffix}`]
  ) {
    return String(item[`${field}${fallbackSuffix}`]);
  }

  return directVal !== undefined && directVal !== null ? String(directVal) : '';
}
