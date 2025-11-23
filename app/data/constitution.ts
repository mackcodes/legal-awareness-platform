// Constitution of India - Complete Data
// Source: Official Government of India Constitution

export interface Article {
  number: string;
  title: string;
  description: string;
  content?: string;
}

export interface Part {
  id: number;
  number: string;
  name: string;
  articles: string;
  description: string;
  articlesList: Article[];
}

export const CONSTITUTION_PARTS: Part[] = [
  {
    id: 1,
    number: "I",
    name: "The Union and its Territory",
    articles: "1-4",
    description: "Defines India's territory and states",
    articlesList: [
      {
        number: "1",
        title: "Name and territory of the Union",
        description: "India, that is Bharat, shall be a Union of States",
        content: "India, that is Bharat, shall be a Union of States. The States and the territories thereof shall be as specified in the First Schedule. The territory of India shall comprise: (a) the territories of the States; (b) the Union territories specified in the First Schedule; and (c) such other territories as may be acquired."
      },
      {
        number: "2",
        title: "Admission or establishment of new States",
        description: "Parliament may admit into the Union new States or establish new States",
        content: "Parliament may by law admit into the Union, or establish, new States on such terms and conditions as it thinks fit."
      },
      {
        number: "3",
        title: "Formation of new States and alteration of areas, boundaries or names of existing States",
        description: "Parliament may form new States and alter existing States",
        content: "Parliament may by law: (a) form a new State by separation of territory from any State or by uniting two or more States or parts of States or by uniting any territory to a part of any State; (b) increase the area of any State; (c) diminish the area of any State; (d) alter the boundaries of any State; (e) alter the name of any State."
      },
      {
        number: "4",
        title: "Laws made under Articles 2 and 3 to provide for amendment",
        description: "Laws for admission, establishment, formation of States",
        content: "Any law referred to in Article 2 or Article 3 shall contain such provisions for the amendment of the First Schedule and the Fourth Schedule as may be necessary to give effect to the provisions of the law."
      }
    ]
  },
  {
    id: 2,
    number: "II",
    name: "Citizenship",
    articles: "5-11",
    description: "Rights and acquisition of citizenship",
    articlesList: [
      {
        number: "5",
        title: "Citizenship at the commencement of the Constitution",
        description: "Who were citizens when Constitution came into effect",
        content: "At the commencement of this Constitution, every person who has his domicile in the territory of India and: (a) who was born in the territory of India; or (b) either of whose parents was born in the territory of India; or (c) who has been ordinarily resident in the territory of India for not less than five years immediately preceding such commencement, shall be a citizen of India."
      },
      {
        number: "6",
        title: "Rights of citizenship of certain persons who have migrated to India from Pakistan",
        description: "Citizenship rights for migrants from Pakistan",
        content: "Provisions for persons who migrated to India from Pakistan and their rights to Indian citizenship."
      },
      {
        number: "7",
        title: "Rights of citizenship of certain migrants to Pakistan",
        description: "Provisions for migrants to Pakistan",
        content: "Notwithstanding anything in Articles 5 and 6, a person who has after the first day of March, 1947, migrated from the territory of India to the territory now included in Pakistan shall not be deemed to be a citizen of India."
      },
      {
        number: "8",
        title: "Rights of citizenship of certain persons of Indian origin residing outside India",
        description: "Citizenship for overseas Indians",
        content: "Provisions for persons of Indian origin living outside India to be citizens."
      },
      {
        number: "9",
        title: "Persons voluntarily acquiring citizenship of a foreign State not to be citizens",
        description: "Loss of citizenship by acquiring foreign citizenship",
        content: "No person shall be a citizen of India by virtue of Article 5, or be deemed to be a citizen of India by virtue of Article 6 or Article 8, if he has voluntarily acquired the citizenship of any foreign State."
      },
      {
        number: "10",
        title: "Continuance of the rights of citizenship",
        description: "Rights continue as per law",
        content: "Every person who is or is deemed to be a citizen of India under any of the foregoing provisions of this Part shall, subject to the provisions of any law that may be made by Parliament, continue to be such citizen."
      },
      {
        number: "11",
        title: "Parliament to regulate the right of citizenship by law",
        description: "Parliament can make laws about citizenship",
        content: "Nothing in the foregoing provisions of this Part shall derogate from the power of Parliament to make any provision with respect to the acquisition and termination of citizenship and all other matters relating to citizenship."
      }
    ]
  },
  {
    id: 3,
    number: "III",
    name: "Fundamental Rights",
    articles: "12-35",
    description: "Basic rights guaranteed to all citizens",
    articlesList: [
      {
        number: "12",
        title: "Definition",
        description: "Definition of 'State' for Fundamental Rights",
        content: "In this Part, unless the context otherwise requires, 'the State' includes the Government and Parliament of India and the Government and the Legislature of each of the States and all local or other authorities within the territory of India or under the control of the Government of India."
      },
      {
        number: "13",
        title: "Laws inconsistent with or in derogation of the fundamental rights",
        description: "Laws against Fundamental Rights are void",
        content: "All laws in force in the territory of India immediately before the commencement of this Constitution, in so far as they are inconsistent with the provisions of this Part, shall, to the extent of such inconsistency, be void. The State shall not make any law which takes away or abridges the rights conferred by this Part."
      },
      {
        number: "14",
        title: "Equality before law",
        description: "Right to Equality - Equal protection of laws",
        content: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India."
      },
      {
        number: "15",
        title: "Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth",
        description: "No discrimination based on religion, race, caste, sex, or birthplace",
        content: "The State shall not discriminate against any citizen on grounds only of religion, race, caste, sex, place of birth or any of them. No citizen shall, on grounds only of religion, race, caste, sex, place of birth or any of them, be subject to any disability, liability, restriction or condition."
      },
      {
        number: "16",
        title: "Equality of opportunity in matters of public employment",
        description: "Equal opportunity in government jobs",
        content: "There shall be equality of opportunity for all citizens in matters relating to employment or appointment to any office under the State. No citizen shall, on grounds only of religion, race, caste, sex, descent, place of birth, residence or any of them, be ineligible for, or discriminated against in respect of, any employment or office under the State."
      },
      {
        number: "17",
        title: "Abolition of Untouchability",
        description: "Untouchability abolished and forbidden",
        content: "'Untouchability' is abolished and its practice in any form is forbidden. The enforcement of any disability arising out of 'Untouchability' shall be an offence punishable in accordance with law."
      },
      {
        number: "18",
        title: "Abolition of titles",
        description: "No titles except military and academic",
        content: "No title, not being a military or academic distinction, shall be conferred by the State. No citizen of India shall accept any title from any foreign State."
      },
      {
        number: "19",
        title: "Protection of certain rights regarding freedom of speech, etc.",
        description: "Six freedoms - speech, assembly, association, movement, residence, profession",
        content: "All citizens shall have the right: (a) to freedom of speech and expression; (b) to assemble peaceably and without arms; (c) to form associations or unions; (d) to move freely throughout the territory of India; (e) to reside and settle in any part of the territory of India; and (f) to practise any profession, or to carry on any occupation, trade or business."
      },
      {
        number: "20",
        title: "Protection in respect of conviction for offences",
        description: "Protection against arbitrary conviction",
        content: "No person shall be convicted of any offence except for violation of a law in force at the time of the commission of the act. No person shall be prosecuted and punished for the same offence more than once. No person accused of any offence shall be compelled to be a witness against himself."
      },
      {
        number: "21",
        title: "Protection of life and personal liberty",
        description: "Right to Life and Personal Liberty - Most important right",
        content: "No person shall be deprived of his life or personal liberty except according to procedure established by law."
      },
      {
        number: "21A",
        title: "Right to education",
        description: "Free and compulsory education for children aged 6-14",
        content: "The State shall provide free and compulsory education to all children of the age of six to fourteen years in such manner as the State may, by law, determine."
      },
      {
        number: "22",
        title: "Protection against arrest and detention in certain cases",
        description: "Rights of arrested persons",
        content: "No person who is arrested shall be detained in custody without being informed of the grounds for such arrest. Every person who is arrested shall be produced before the nearest magistrate within a period of twenty-four hours of such arrest. No person shall be detained for more than three months unless an Advisory Board reports sufficient cause."
      },
      {
        number: "23",
        title: "Prohibition of traffic in human beings and forced labour",
        description: "Ban on human trafficking and bonded labor",
        content: "Traffic in human beings and begar and other similar forms of forced labour are prohibited and any contravention of this provision shall be an offence punishable in accordance with law."
      },
      {
        number: "24",
        title: "Prohibition of employment of children in factories, etc.",
        description: "No child labor in hazardous work",
        content: "No child below the age of fourteen years shall be employed to work in any factory or mine or engaged in any other hazardous employment."
      },
      {
        number: "25",
        title: "Freedom of conscience and free profession, practice and propagation of religion",
        description: "Right to practice and propagate religion",
        content: "Subject to public order, morality and health, all persons are equally entitled to freedom of conscience and the right freely to profess, practise and propagate religion."
      },
      {
        number: "26",
        title: "Freedom to manage religious affairs",
        description: "Right to manage religious institutions",
        content: "Subject to public order, morality and health, every religious denomination shall have the right: (a) to establish and maintain institutions for religious and charitable purposes; (b) to manage its own affairs in matters of religion; (c) to own and acquire movable and immovable property; and (d) to administer such property in accordance with law."
      },
      {
        number: "27",
        title: "Freedom from taxation for promotion of any particular religion",
        description: "No tax for promoting specific religion",
        content: "No person shall be compelled to pay any taxes, the proceeds of which are specifically appropriated in payment of expenses for the promotion or maintenance of any particular religion or religious denomination."
      },
      {
        number: "28",
        title: "Freedom from religious instruction in educational institutions",
        description: "No religious education in government schools",
        content: "No religious instruction shall be provided in any educational institution wholly maintained out of State funds."
      },
      {
        number: "29",
        title: "Protection of interests of minorities",
        description: "Right to conserve culture and language",
        content: "Any section of the citizens residing in the territory of India or any part thereof having a distinct language, script or culture of its own shall have the right to conserve the same."
      },
      {
        number: "30",
        title: "Right of minorities to establish and administer educational institutions",
        description: "Minorities can establish educational institutions",
        content: "All minorities, whether based on religion or language, shall have the right to establish and administer educational institutions of their choice."
      },
      {
        number: "31",
        title: "Compulsory acquisition of property",
        description: "Repealed by 44th Amendment",
        content: "This article has been omitted by the Constitution (Forty-fourth Amendment) Act, 1978."
      },
      {
        number: "32",
        title: "Remedies for enforcement of rights conferred by this Part",
        description: "Right to Constitutional Remedies - Dr. Ambedkar called it 'Heart and Soul of Constitution'",
        content: "The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed. The Supreme Court shall have power to issue directions or orders or writs, including writs in the nature of habeas corpus, mandamus, prohibition, quo warranto and certiorari for the enforcement of any of the rights conferred by this Part."
      },
      {
        number: "33",
        title: "Power of Parliament to modify rights in their application to Forces, etc.",
        description: "Parliament can modify rights for armed forces",
        content: "Parliament may determine to what extent any of the rights conferred by this Part shall, in their application to the members of the Armed Forces or the Forces charged with the maintenance of public order, be restricted or abrogated."
      },
      {
        number: "34",
        title: "Restriction on rights while martial law is in force",
        description: "Rights can be restricted during martial law",
        content: "Notwithstanding anything in the foregoing provisions of this Part, Parliament may by law indemnify any person in the service of the Union or of a State in respect of any act done by him in connection with the maintenance or restoration of order in any area within the territory of India where martial law was in force."
      },
      {
        number: "35",
        title: "Legislation to give effect to provisions of this Part",
        description: "Parliament can make laws to implement Fundamental Rights",
        content: "Notwithstanding anything in this Constitution, Parliament shall have, and the Legislature of a State shall not have, power to make laws with respect to any of the matters which are enumerated in this Part."
      }
    ]
  },
  {
    id: 4,
    number: "IV",
    name: "Directive Principles of State Policy",
    articles: "36-51",
    description: "Guidelines for government policy",
    articlesList: [
      {
        number: "36",
        title: "Definition",
        description: "Definition of 'State' for this Part",
        content: "In this Part, unless the context otherwise requires, 'the State' has the same meaning as in Part III."
      },
      {
        number: "37",
        title: "Application of principles in this Part",
        description: "Directive Principles are not enforceable by courts but fundamental in governance",
        content: "The provisions contained in this Part shall not be enforceable by any court, but the principles therein laid down are nevertheless fundamental in the governance of the country and it shall be the duty of the State to apply these principles in making laws."
      },
      {
        number: "38",
        title: "State to secure a social order for the promotion of welfare of the people",
        description: "State shall promote welfare of people by securing social order",
        content: "The State shall strive to promote the welfare of the people by securing and protecting as effectively as it may a social order in which justice, social, economic and political, shall inform all the institutions of the national life."
      },
      {
        number: "39",
        title: "Certain principles of policy to be followed by the State",
        description: "Equal livelihood, prevent concentration of wealth, equal pay for equal work",
        content: "The State shall direct its policy towards securing: (a) that the citizens, men and women equally, have the right to an adequate means of livelihood; (b) that the ownership and control of the material resources of the community are so distributed as best to subserve the common good; (c) that the operation of the economic system does not result in the concentration of wealth and means of production to the common detriment; (d) that there is equal pay for equal work for both men and women; (e) that the health and strength of workers and children are not abused; (f) that children are given opportunities to develop in a healthy manner."
      },
      {
        number: "39A",
        title: "Equal justice and free legal aid",
        description: "Provide free legal aid to ensure justice for all",
        content: "The State shall secure that the operation of the legal system promotes justice, on a basis of equal opportunity, and shall, in particular, provide free legal aid, by suitable legislation or schemes or in any other way, to ensure that opportunities for securing justice are not denied to any citizen by reason of economic or other disabilities."
      },
      {
        number: "40",
        title: "Organisation of village panchayats",
        description: "State shall organize village panchayats",
        content: "The State shall take steps to organise village panchayats and endow them with such powers and authority as may be necessary to enable them to function as units of self-government."
      },
      {
        number: "41",
        title: "Right to work, to education and to public assistance in certain cases",
        description: "State shall secure right to work, education, and public assistance",
        content: "The State shall, within the limits of its economic capacity and development, make effective provision for securing the right to work, to education and to public assistance in cases of unemployment, old age, sickness and disablement, and in other cases of undeserved want."
      },
      {
        number: "42",
        title: "Provision for just and humane conditions of work and maternity relief",
        description: "Ensure just working conditions and maternity relief",
        content: "The State shall make provision for securing just and humane conditions of work and for maternity relief."
      },
      {
        number: "43",
        title: "Living wage, etc., for workers",
        description: "Secure living wage and decent standard of life for workers",
        content: "The State shall endeavour to secure, by suitable legislation or economic organisation or in any other way, to all workers, agricultural, industrial or otherwise, work, a living wage, conditions of work ensuring a decent standard of life and full enjoyment of leisure and social and cultural opportunities."
      },
      {
        number: "43A",
        title: "Participation of workers in management of industries",
        description: "Workers participation in industrial management",
        content: "The State shall take steps, by suitable legislation or in any other way, to secure the participation of workers in the management of undertakings, establishments or other organisations engaged in any industry."
      },
      {
        number: "43B",
        title: "Promotion of cooperative societies",
        description: "State shall promote cooperative societies",
        content: "The State shall endeavour to promote voluntary formation, autonomous functioning, democratic control and professional management of co-operative societies."
      },
      {
        number: "44",
        title: "Uniform civil code for the citizens",
        description: "Secure uniform civil code throughout India",
        content: "The State shall endeavour to secure for the citizens a uniform civil code throughout the territory of India."
      },
      {
        number: "45",
        title: "Provision for early childhood care and education to children below the age of six years",
        description: "Provide early childhood care and education",
        content: "The State shall endeavour to provide early childhood care and education for all children until they complete the age of six years."
      },
      {
        number: "46",
        title: "Promotion of educational and economic interests of Scheduled Castes, Scheduled Tribes and other weaker sections",
        description: "Protect educational and economic interests of weaker sections",
        content: "The State shall promote with special care the educational and economic interests of the weaker sections of the people, and, in particular, of the Scheduled Castes and the Scheduled Tribes, and shall protect them from social injustice and all forms of exploitation."
      },
      {
        number: "47",
        title: "Duty of the State to raise the level of nutrition and the standard of living and to improve public health",
        description: "Improve nutrition, living standards, and public health",
        content: "The State shall regard the raising of the level of nutrition and the standard of living of its people and the improvement of public health as among its primary duties and, in particular, the State shall endeavour to bring about prohibition of the consumption except for medicinal purposes of intoxicating drinks and of drugs which are injurious to health."
      },
      {
        number: "48",
        title: "Organisation of agriculture and animal husbandry",
        description: "Organize agriculture and animal husbandry on modern scientific lines",
        content: "The State shall endeavour to organise agriculture and animal husbandry on modern and scientific lines and shall, in particular, take steps for preserving and improving the breeds, and prohibiting the slaughter, of cows and calves and other milch and draught cattle."
      },
      {
        number: "48A",
        title: "Protection and improvement of environment and safeguarding of forests and wild life",
        description: "Protect environment, forests, and wildlife",
        content: "The State shall endeavour to protect and improve the environment and to safeguard the forests and wild life of the country."
      },
      {
        number: "49",
        title: "Protection of monuments and places and objects of national importance",
        description: "Protect monuments and places of national importance",
        content: "It shall be the obligation of the State to protect every monument or place or object of artistic or historic interest, declared by or under law made by Parliament to be of national importance, from spoliation, disfigurement, destruction, removal, disposal or export, as the case may be."
      },
      {
        number: "50",
        title: "Separation of judiciary from executive",
        description: "Separate judiciary from executive in public services",
        content: "The State shall take steps to separate the judiciary from the executive in the public services of the State."
      },
      {
        number: "51",
        title: "Promotion of international peace and security",
        description: "Promote international peace and maintain just international order",
        content: "The State shall endeavour to: (a) promote international peace and security; (b) maintain just and honourable relations between nations; (c) foster respect for international law and treaty obligations in the dealings of organised peoples with one another; and (d) encourage settlement of international disputes by arbitration."
      }
    ]
  },
  {
    id: 5,
    number: "IVA",
    name: "Fundamental Duties",
    articles: "51A",
    description: "Duties of every citizen",
    articlesList: [
      {
        number: "51A",
        title: "Fundamental Duties",
        description: "11 fundamental duties of citizens of India (added by 42nd Amendment, 1976)",
        content: "It shall be the duty of every citizen of India:\n\n(a) to abide by the Constitution and respect its ideals and institutions, the National Flag and the National Anthem;\n\n(b) to cherish and follow the noble ideals which inspired our national struggle for freedom;\n\n(c) to uphold and protect the sovereignty, unity and integrity of India;\n\n(d) to defend the country and render national service when called upon to do so;\n\n(e) to promote harmony and the spirit of common brotherhood amongst all the people of India transcending religious, linguistic and regional or sectional diversities; to renounce practices derogatory to the dignity of women;\n\n(f) to value and preserve the rich heritage of our composite culture;\n\n(g) to protect and improve the natural environment including forests, lakes, rivers and wild life, and to have compassion for living creatures;\n\n(h) to develop the scientific temper, humanism and the spirit of inquiry and reform;\n\n(i) to safeguard public property and to abjure violence;\n\n(j) to strive towards excellence in all spheres of individual and collective activity so that the nation constantly rises to higher levels of endeavour and achievement;\n\n(k) who is a parent or guardian to provide opportunities for education to his child or, as the case may be, ward between the age of six and fourteen years."
      }
    ]
  },
  {
    id: 6,
    number: "V",
    name: "The Union",
    articles: "52-151",
    description: "Structure of central government - President, Parliament, Supreme Court",
    articlesList: [
      {
        number: "52",
        title: "The President of India",
        description: "There shall be a President of India",
        content: "There shall be a President of India."
      },
      {
        number: "53",
        title: "Executive power of the Union",
        description: "Executive power vested in President",
        content: "The executive power of the Union shall be vested in the President and shall be exercised by him either directly or through officers subordinate to him in accordance with this Constitution. The supreme command of the Defence Forces of the Union shall be vested in the President."
      },
      {
        number: "54",
        title: "Election of President",
        description: "President elected by Electoral College",
        content: "The President shall be elected by the members of an electoral college consisting of: (a) the elected members of both Houses of Parliament; and (b) the elected members of the Legislative Assemblies of the States."
      },
      {
        number: "55",
        title: "Manner of election of President",
        description: "Election by proportional representation with single transferable vote",
        content: "The election of the President shall be held in accordance with the system of proportional representation by means of the single transferable vote and the voting at such election shall be by secret ballot."
      },
      {
        number: "56",
        title: "Term of office of President",
        description: "President holds office for 5 years",
        content: "The President shall hold office for a term of five years from the date on which he enters upon his office. The President may resign by writing to the Vice-President."
      },
      {
        number: "57",
        title: "Eligibility for re-election",
        description: "Person who holds or has held office as President is eligible for re-election",
        content: "A person who holds, or who has held, office as President shall be eligible for re-election to that office."
      },
      {
        number: "58",
        title: "Qualifications for election as President",
        description: "Must be citizen of India, 35+ years, qualified for Lok Sabha",
        content: "No person shall be eligible for election as President unless he: (a) is a citizen of India, (b) has completed the age of thirty-five years, and (c) is qualified for election as a member of the House of the People."
      },
      {
        number: "61",
        title: "Procedure for impeachment of the President",
        description: "President can be impeached for violation of Constitution",
        content: "When a President is to be impeached for violation of the Constitution, the charge shall be preferred by either House of Parliament. No such charge shall be preferred unless: (a) the proposal is contained in a resolution moved after at least fourteen days' notice; (b) such resolution has been passed by a majority of not less than two-thirds of the total membership of the House."
      },
      {
        number: "72",
        title: "Power of President to grant pardons, etc.",
        description: "President can grant pardons, reprieves, respites, remissions",
        content: "The President shall have the power to grant pardons, reprieves, respites or remissions of punishment or to suspend, remit or commute the sentence of any person convicted of any offence in all cases where the punishment or sentence is by a Court Martial; in all cases where the punishment or sentence is for an offence against any law relating to a matter to which the executive power of the Union extends; in all cases where the sentence is a sentence of death."
      },
      {
        number: "74",
        title: "Council of Ministers to aid and advise President",
        description: "President acts on advice of Council of Ministers headed by PM",
        content: "There shall be a Council of Ministers with the Prime Minister at the head to aid and advise the President who shall, in the exercise of his functions, act in accordance with such advice."
      },
      {
        number: "75",
        title: "Other provisions as to Ministers",
        description: "PM appointed by President, other ministers on PM's advice",
        content: "The Prime Minister shall be appointed by the President and the other Ministers shall be appointed by the President on the advice of the Prime Minister. The Ministers shall hold office during the pleasure of the President. The Council of Ministers shall be collectively responsible to the House of the People."
      },
      {
        number: "76",
        title: "Attorney-General for India",
        description: "President appoints Attorney-General",
        content: "The President shall appoint a person who is qualified to be appointed a Judge of the Supreme Court to be Attorney-General for India. It shall be the duty of the Attorney-General to give advice to the Government of India upon such legal matters as referred to him, and to perform such other duties of a legal character as assigned to him by the President."
      },
      {
        number: "79",
        title: "Constitution of Parliament",
        description: "Parliament consists of President, Lok Sabha, and Rajya Sabha",
        content: "There shall be a Parliament for the Union which shall consist of the President and two Houses to be known respectively as the Council of States (Rajya Sabha) and the House of the People (Lok Sabha)."
      },
      {
        number: "80",
        title: "Composition of the Council of States",
        description: "Rajya Sabha - 250 members, 12 nominated, rest elected",
        content: "The Council of States shall consist of: (a) twelve members to be nominated by the President; and (b) not more than two hundred and thirty-eight representatives of the States and of the Union territories."
      },
      {
        number: "81",
        title: "Composition of the House of the People",
        description: "Lok Sabha - not more than 550 members",
        content: "Subject to the provisions of Article 331, the House of the People shall consist of: (a) not more than five hundred and thirty members chosen by direct election from territorial constituencies in the States, and (b) not more than twenty members to represent the Union territories."
      },
      {
        number: "83",
        title: "Duration of Houses of Parliament",
        description: "Rajya Sabha is permanent, Lok Sabha lasts 5 years unless dissolved",
        content: "The Council of States shall not be subject to dissolution, but as nearly as possible one-third of the members thereof shall retire as soon as may be on the expiration of every second year. The House of the People, unless sooner dissolved, shall continue for five years from the date appointed for its first meeting."
      },
      {
        number: "84",
        title: "Qualification for membership of Parliament",
        description: "Must be citizen of India, 30+ for Rajya Sabha, 25+ for Lok Sabha",
        content: "A person shall not be qualified to be chosen to fill a seat in Parliament unless he: (a) is a citizen of India; (b) is, in the case of a seat in the Council of States, not less than thirty years of age and, in the case of a seat in the House of the People, not less than twenty-five years of age; and (c) possesses such other qualifications as may be prescribed by Parliament."
      },
      {
        number: "105",
        title: "Powers, privileges, etc., of the Houses of Parliament and of the members and committees thereof",
        description: "Parliament has freedom of speech and other privileges",
        content: "Subject to the provisions of this Constitution and to the rules and standing orders regulating the procedure of Parliament, there shall be freedom of speech in Parliament. No member of Parliament shall be liable to any proceedings in any court in respect of anything said or any vote given by him in Parliament."
      },
      {
        number: "108",
        title: "Joint sitting of both Houses in certain cases",
        description: "President can summon joint sitting to resolve deadlock",
        content: "If after a Bill has been passed by one House and transmitted to the other House, the Bill is rejected by the other House; or more than six months elapse from the date of the reception of the Bill without it being passed; or the Bill is passed with amendments to which the originating House does not agree, the President may summon the Houses to meet in a joint sitting for the purpose of deliberating and voting on the Bill."
      },
      {
        number: "110",
        title: "Definition of 'Money Bills'",
        description: "Bills dealing only with taxation, expenditure, loans",
        content: "A Bill shall be deemed to be a Money Bill if it contains only provisions dealing with all or any of the following matters: (a) the imposition, abolition, remission, alteration or regulation of any tax; (b) the regulation of the borrowing of money; (c) the custody of the Consolidated Fund or the Contingency Fund of India; (d) the appropriation of moneys out of the Consolidated Fund of India; (e) expenditure from the Consolidated Fund of India."
      },
      {
        number: "112",
        title: "Annual financial statement (Budget)",
        description: "President causes annual budget to be laid before Parliament",
        content: "The President shall in respect of every financial year cause to be laid before both the Houses of Parliament a statement of the estimated receipts and expenditure of the Government of India for that year, referred to as the 'annual financial statement' or Budget."
      },
      {
        number: "123",
        title: "Power of President to promulgate Ordinances during recess of Parliament",
        description: "President can issue ordinances when Parliament is not in session",
        content: "If at any time, except when both Houses of Parliament are in session, the President is satisfied that circumstances exist which render it necessary for him to take immediate action, he may promulgate such Ordinances as the circumstances appear to him to require. An Ordinance promulgated under this article shall have the same force and effect as an Act of Parliament but shall cease to operate at the expiration of six weeks from the reassembly of Parliament."
      },
      {
        number: "124",
        title: "Establishment and constitution of Supreme Court",
        description: "Supreme Court consists of CJI and not more than 33 other judges",
        content: "There shall be a Supreme Court of India consisting of a Chief Justice of India and, until Parliament by law prescribes a larger number, of not more than thirty-three other Judges."
      },
      {
        number: "124A",
        title: "National Judicial Appointments Commission",
        description: "Body for appointment of judges (struck down by Supreme Court in 2015)",
        content: "This article and the National Judicial Appointments Commission were declared unconstitutional by the Supreme Court in 2015."
      },
      {
        number: "126",
        title: "Appointment of acting Chief Justice",
        description: "President can appoint acting CJI when office is vacant",
        content: "When the office of Chief Justice of India is vacant or when the Chief Justice is unable to perform the duties of his office, the duties of the office shall be performed by such one of the other Judges of the Court as the President may appoint for the purpose."
      },
      {
        number: "129",
        title: "Supreme Court to be a court of record",
        description: "Supreme Court is court of record with power to punish for contempt",
        content: "The Supreme Court shall be a court of record and shall have all the powers of such a court including the power to punish for contempt of itself."
      },
      {
        number: "130",
        title: "Seat of Supreme Court",
        description: "Supreme Court is located in Delhi",
        content: "The Supreme Court shall sit in Delhi or in such other place or places, as the Chief Justice of India may, with the approval of the President, from time to time, appoint."
      },
      {
        number: "131",
        title: "Original jurisdiction of the Supreme Court",
        description: "SC has original jurisdiction in disputes between governments",
        content: "The Supreme Court shall, to the exclusion of any other court, have original jurisdiction in any dispute between the Government of India and one or more States; or between the Government of India and any State or States on one side and one or more other States on the other; or between two or more States."
      },
      {
        number: "132",
        title: "Appellate jurisdiction of Supreme Court in appeals from High Courts in certain cases",
        description: "SC has appellate jurisdiction in constitutional matters",
        content: "An appeal shall lie to the Supreme Court from any judgment, decree or final order of a High Court in the territory of India, whether in a civil, criminal or other proceeding, if the High Court certifies that the case involves a substantial question of law as to the interpretation of this Constitution."
      },
      {
        number: "136",
        title: "Special leave to appeal by Supreme Court",
        description: "SC can grant special leave to appeal in any matter",
        content: "The Supreme Court may, in its discretion, grant special leave to appeal from any judgment, decree, determination, sentence or order in any cause or matter passed or made by any court or tribunal in the territory of India."
      },
      {
        number: "137",
        title: "Review of judgments or orders by the Supreme Court",
        description: "SC can review its own judgments",
        content: "Subject to the provisions of any law made by Parliament or any rules made under Article 145, the Supreme Court shall have power to review any judgment pronounced or order made by it."
      },
      {
        number: "141",
        title: "Law declared by Supreme Court to be binding on all courts",
        description: "SC judgments are binding on all courts in India",
        content: "The law declared by the Supreme Court shall be binding on all courts within the territory of India."
      },
      {
        number: "143",
        title: "Power of President to consult Supreme Court",
        description: "President can seek SC's opinion on questions of law",
        content: "If at any time it appears to the President that a question of law or fact has arisen, or is likely to arise, which is of such a nature and of such public importance that it is expedient to obtain the opinion of the Supreme Court upon it, he may refer the question to that Court for consideration and the Court may, after such hearing as it thinks fit, report to the President its opinion thereon."
      },
      {
        number: "145",
        title: "Rules of Court, etc.",
        description: "SC can make rules for its functioning",
        content: "The Supreme Court may from time to time, with the approval of the President, make rules for regulating generally the practice and procedure of the Court."
      }
    ]
  },
  {
    id: 7,
    number: "VI",
    name: "The States",
    articles: "152-237",
    description: "State governments - Governor, State Legislature, High Courts",
    articlesList: [
      {
        number: "152",
        title: "Definition",
        description: "Definition of 'State' for this Part",
        content: "In this Part, unless the context otherwise requires, 'the State' means a State specified in the First Schedule."
      },
      {
        number: "153",
        title: "Governors of States",
        description: "There shall be a Governor for each State",
        content: "There shall be a Governor for each State. Nothing in this article shall prevent the appointment of the same person as Governor for two or more States."
      },
      {
        number: "154",
        title: "Executive power of State",
        description: "Executive power of State vested in Governor",
        content: "The executive power of the State shall be vested in the Governor and shall be exercised by him either directly or through officers subordinate to him in accordance with this Constitution."
      },
      {
        number: "155",
        title: "Appointment of Governor",
        description: "Governor appointed by President",
        content: "The Governor of a State shall be appointed by the President by warrant under his hand and seal."
      },
      {
        number: "156",
        title: "Term of office of Governor",
        description: "Governor holds office for 5 years",
        content: "The Governor shall hold office during the pleasure of the President. The Governor shall hold office for a term of five years from the date on which he enters upon his office."
      },
      {
        number: "157",
        title: "Qualifications for appointment as Governor",
        description: "Must be citizen of India, 35+ years",
        content: "No person shall be eligible for appointment as Governor unless he is a citizen of India and has completed the age of thirty-five years."
      },
      {
        number: "161",
        title: "Power of Governor to grant pardons, etc.",
        description: "Governor can grant pardons, reprieves, respites, remissions for state matters",
        content: "The Governor of a State shall have the power to grant pardons, reprieves, respites or remissions of punishment or to suspend, remit or commute the sentence of any person convicted of any offence against any law relating to a matter to which the executive power of the State extends."
      },
      {
        number: "163",
        title: "Council of Ministers to aid and advise Governor",
        description: "Governor acts on advice of Council of Ministers headed by CM",
        content: "There shall be a Council of Ministers with the Chief Minister at the head to aid and advise the Governor in the exercise of his functions, except in so far as he is by or under this Constitution required to exercise his functions in his discretion."
      },
      {
        number: "164",
        title: "Other provisions as to Ministers",
        description: "CM appointed by Governor, other ministers on CM's advice",
        content: "The Chief Minister shall be appointed by the Governor and the other Ministers shall be appointed by the Governor on the advice of the Chief Minister. The Ministers shall hold office during the pleasure of the Governor. The Council of Ministers shall be collectively responsible to the Legislative Assembly of the State."
      },
      {
        number: "165",
        title: "Advocate-General for the State",
        description: "Governor appoints Advocate-General for State",
        content: "The Governor of each State shall appoint a person who is qualified to be appointed a Judge of a High Court to be Advocate-General for the State."
      },
      {
        number: "168",
        title: "Constitution of Legislatures in States",
        description: "State Legislature consists of Governor and one or two Houses",
        content: "For every State there shall be a Legislature which shall consist of the Governor, and: (a) in the States of Bihar, Maharashtra, Karnataka, and Uttar Pradesh, two Houses; (b) in other States, one House."
      },
      {
        number: "169",
        title: "Abolition or creation of Legislative Councils in States",
        description: "Parliament can abolish or create Legislative Council in a State",
        content: "Parliament may by law provide for the abolition of the Legislative Council of a State having such a Council or for the creation of such a Council in a State having no such Council, if the Legislative Assembly of the State passes a resolution to that effect by a majority of the total membership of the Assembly and by a majority of not less than two-thirds of the members of the Assembly present and voting."
      },
      {
        number: "170",
        title: "Composition of the Legislative Assemblies",
        description: "Legislative Assembly - not more than 500, not less than 60 members",
        content: "The total number of members in the Legislative Assembly of each State shall not be less than sixty and not more than five hundred."
      },
      {
        number: "171",
        title: "Composition of the Legislative Councils",
        description: "Legislative Council - not more than 1/3 of Assembly, not less than 40",
        content: "The total number of members in the Legislative Council of a State shall not exceed one-third of the total number of members in the Legislative Assembly of that State and shall not be less than forty."
      },
      {
        number: "172",
        title: "Duration of State Legislatures",
        description: "Legislative Council is permanent, Assembly lasts 5 years",
        content: "Every Legislative Assembly of every State, unless sooner dissolved, shall continue for five years from the date appointed for its first meeting. The Legislative Council of a State shall not be subject to dissolution."
      },
      {
        number: "173",
        title: "Qualification for membership of the State Legislature",
        description: "Must be citizen of India, 30+ for Council, 25+ for Assembly",
        content: "A person shall not be qualified to be chosen to fill a seat in the Legislature of a State unless he: (a) is a citizen of India; (b) is, in the case of a seat in the Legislative Assembly, not less than twenty-five years of age and, in the case of a seat in the Legislative Council, not less than thirty years of age."
      },
      {
        number: "176",
        title: "Special address by the Governor",
        description: "Governor addresses State Legislature at commencement of first session",
        content: "At the commencement of the first session after each general election to the Legislative Assembly and at the commencement of the first session of each year, the Governor shall address the Legislative Assembly or, in the case of a State having a Legislative Council, both Houses assembled together."
      },
      {
        number: "200",
        title: "Assent to Bills",
        description: "Governor can assent, withhold assent, or reserve Bill for President",
        content: "When a Bill has been passed by the Legislative Assembly of a State or, in the case of a State having a Legislative Council, has been passed by both Houses of the Legislature of the State, it shall be presented to the Governor and the Governor shall declare either that he assents to the Bill or that he withholds assent therefrom or that he reserves the Bill for the consideration of the President."
      },
      {
        number: "213",
        title: "Power of Governor to promulgate Ordinances during recess of Legislature",
        description: "Governor can issue ordinances when Legislature is not in session",
        content: "If at any time, except when the Legislative Assembly of a State is in session, or where there is a Legislative Council in a State, except when both Houses of the Legislature are in session, the Governor is satisfied that circumstances exist which render it necessary for him to take immediate action, he may promulgate such Ordinances as the circumstances appear to him to require."
      },
      {
        number: "214",
        title: "High Courts for States",
        description: "There shall be a High Court for each State",
        content: "There shall be a High Court for each State."
      },
      {
        number: "215",
        title: "High Courts to be courts of record",
        description: "High Court is court of record with power to punish for contempt",
        content: "Every High Court shall be a court of record and shall have all the powers of such a court including the power to punish for contempt of itself."
      },
      {
        number: "217",
        title: "Appointment and conditions of the office of a Judge of a High Court",
        description: "HC Judge appointed by President, retires at 62",
        content: "Every Judge of a High Court shall be appointed by the President. Every Judge shall hold office until he attains the age of sixty-two years."
      },
      {
        number: "226",
        title: "Power of High Courts to issue certain writs",
        description: "HC can issue writs for enforcement of Fundamental Rights and other purposes",
        content: "Every High Court shall have power to issue to any person or authority, including in appropriate cases, any Government, within those territories directions, orders or writs, including writs in the nature of habeas corpus, mandamus, prohibition, quo warranto and certiorari, for the enforcement of any of the rights conferred by Part III and for any other purpose."
      },
      {
        number: "227",
        title: "Power of superintendence over all courts by the High Court",
        description: "HC has superintendence over all courts in State",
        content: "Every High Court shall have superintendence over all courts and tribunals throughout the territories in relation to which it exercises jurisdiction."
      }
    ]
  },
  {
    id: 8,
    number: "VII",
    name: "The States in Part B of the First Schedule (Repealed)",
    articles: "238",
    description: "Omitted by Constitution 7th Amendment Act, 1956",
    articlesList: [
      {
        number: "238",
        title: "Part B States (Repealed)",
        description: "This Part has been repealed",
        content: "Article 238 and Part VII of the Constitution were omitted by the Constitution (Seventh Amendment) Act, 1956."
      }
    ]
  },
  {
    id: 9,
    number: "VIII",
    name: "The Union Territories",
    articles: "239-242",
    description: "Administration of Union Territories",
    articlesList: [
      {
        number: "239",
        title: "Administration of Union territories",
        description: "Union territories administered by President through Administrator",
        content: "Every Union territory shall be administered by the President acting, to such extent as he thinks fit, through an administrator to be appointed by him with such designation as he may specify."
      },
      {
        number: "239A",
        title: "Creation of local Legislatures or Council of Ministers or both for certain Union territories",
        description: "Parliament can create Legislatures for Union Territories",
        content: "Parliament may by law create for the Union territory of Puducherry a body, whether elected or partly nominated and partly elected, to function as a Legislature for the Union territory, or a Council of Ministers, or both."
      },
      {
        number: "239AA",
        title: "Special provisions with respect to Delhi",
        description: "Delhi has Legislative Assembly and Council of Ministers",
        content: "The Union territory of Delhi shall be called the National Capital Territory of Delhi and the administrator thereof shall be designated as the Lieutenant Governor. There shall be a Legislative Assembly for the National Capital Territory and the Council of Ministers to aid and advise the Lieutenant Governor."
      },
      {
        number: "240",
        title: "Power of President to make regulations for certain Union territories",
        description: "President can make regulations for Union Territories",
        content: "The President may make regulations for the peace, progress and good government of the Union territories of the Andaman and Nicobar Islands, Lakshadweep, Dadra and Nagar Haveli and Daman and Diu, and Ladakh."
      },
      {
        number: "241",
        title: "High Courts for Union territories",
        description: "Parliament can establish High Courts for Union Territories",
        content: "Parliament may by law constitute a High Court for a Union territory or declare any court in any such territory to be a High Court for all or any of the purposes of this Constitution."
      },
      {
        number: "242",
        title: "Coorg (Repealed)",
        description: "Omitted by Constitution 7th Amendment Act, 1956",
        content: "Article 242 was omitted by the Constitution (Seventh Amendment) Act, 1956."
      }
    ]
  },
  {
    id: 10,
    number: "IX",
    name: "The Panchayats",
    articles: "243-243O",
    description: "Panchayati Raj institutions for rural local self-government",
    articlesList: [
      {
        number: "243",
        title: "Definitions",
        description: "Definitions for this Part",
        content: "In this Part, unless the context otherwise requires: 'district' means a district in a State; 'Gram Sabha' means a body consisting of persons registered in the electoral rolls relating to a village comprised within the area of Panchayat at the village level; 'Panchayat' means an institution of self-government constituted under article 243B."
      },
      {
        number: "243A",
        title: "Gram Sabha",
        description: "Gram Sabha may exercise powers and perform functions at village level",
        content: "A Gram Sabha may exercise such powers and perform such functions at the village level as the Legislature of a State may, by law, provide."
      },
      {
        number: "243B",
        title: "Constitution of Panchayats",
        description: "Panchayats at village, intermediate, and district levels",
        content: "There shall be constituted in every State, Panchayats at the village, intermediate and district levels in accordance with the provisions of this Part."
      },
      {
        number: "243C",
        title: "Composition of Panchayats",
        description: "All seats filled by direct election, reservation for SCs/STs/women",
        content: "All the seats in a Panchayat shall be filled by persons chosen by direct election from territorial constituencies in the Panchayat area. Seats shall be reserved for Scheduled Castes, Scheduled Tribes, and not less than one-third of the total number of seats shall be reserved for women."
      },
      {
        number: "243D",
        title: "Reservation of seats",
        description: "Reservation for SCs, STs, and women including Chairpersons",
        content: "Seats shall be reserved for Scheduled Castes and Scheduled Tribes in every Panchayat. Not less than one-third of the total number of seats reserved shall be reserved for women belonging to Scheduled Castes or Scheduled Tribes. Not less than one-third of the total number of offices of Chairpersons in the Panchayats shall be reserved for women."
      },
      {
        number: "243E",
        title: "Duration of Panchayats, etc.",
        description: "Panchayats continue for 5 years",
        content: "Every Panchayat, unless sooner dissolved, shall continue for five years from the date appointed for its first meeting. Elections to constitute a Panchayat shall be completed before the expiry of its duration or within six months from the date of its dissolution."
      },
      {
        number: "243F",
        title: "Disqualifications for membership",
        description: "State Legislature may provide disqualifications",
        content: "A person shall be disqualified for being chosen as, and for being, a member of a Panchayat if he is so disqualified by or under any law made by the Legislature of a State."
      },
      {
        number: "243G",
        title: "Powers, authority and responsibilities of Panchayats",
        description: "State may endow Panchayats with powers for self-government",
        content: "The Legislature of a State may, by law, endow the Panchayats with such powers and authority as may be necessary to enable them to function as institutions of self-government including powers and authority with respect to the preparation of plans for economic development and social justice and implementation of schemes for economic development and social justice."
      },
      {
        number: "243K",
        title: "Elections to the Panchayats",
        description: "State Election Commission conducts Panchayat elections",
        content: "The superintendence, direction and control of the preparation of electoral rolls for, and the conduct of, all elections to the Panchayats shall be vested in a State Election Commission."
      }
    ]
  },
  {
    id: 11,
    number: "IXA",
    name: "The Municipalities",
    articles: "243P-243ZG",
    description: "Urban local self-government institutions",
    articlesList: [
      {
        number: "243P",
        title: "Definitions",
        description: "Definitions for this Part",
        content: "In this Part, unless the context otherwise requires: 'Committee' means a Committee constituted under article 243S; 'district' means a district in a State; 'Metropolitan area' means an area having a population of ten lakhs or more; 'Municipal area' means the territorial area of a Municipality; 'Municipality' means an institution of self-government constituted under article 243Q."
      },
      {
        number: "243Q",
        title: "Constitution of Municipalities",
        description: "Nagar Panchayat, Municipal Council, Municipal Corporation",
        content: "There shall be constituted in every State: (a) a Nagar Panchayat for a transitional area; (b) a Municipal Council for a smaller urban area; and (c) a Municipal Corporation for a larger urban area."
      },
      {
        number: "243R",
        title: "Composition of Municipalities",
        description: "All seats filled by direct election, reservation for SCs/STs/women",
        content: "All the seats in a Municipality shall be filled by persons chosen by direct election from the territorial constituencies in the Municipal area. Seats shall be reserved for Scheduled Castes and Scheduled Tribes. Not less than one-third of the total number of seats shall be reserved for women."
      },
      {
        number: "243T",
        title: "Duration of Municipalities, etc.",
        description: "Municipalities continue for 5 years",
        content: "Every Municipality, unless sooner dissolved, shall continue for five years from the date appointed for its first meeting. Elections to constitute a Municipality shall be completed before the expiry of its duration or within six months from the date of its dissolution."
      },
      {
        number: "243W",
        title: "Powers, authority and responsibilities of Municipalities, etc.",
        description: "State may endow Municipalities with powers for self-government",
        content: "The Legislature of a State may, by law, endow the Municipalities with such powers and authority as may be necessary to enable them to function as institutions of self-government including powers with respect to the preparation of plans for economic development and social justice and the performance of functions and implementation of schemes as may be entrusted to them including those in relation to the matters listed in the Twelfth Schedule."
      },
      {
        number: "243ZA",
        title: "Elections to the Municipalities",
        description: "State Election Commission conducts Municipal elections",
        content: "The superintendence, direction and control of the preparation of electoral rolls for, and the conduct of, all elections to the Municipalities shall be vested in the State Election Commission."
      }
    ]
  },
  {
    id: 12,
    number: "IXB",
    name: "The Co-operative Societies",
    articles: "243ZH-243ZT",
    description: "Provisions relating to cooperative societies",
    articlesList: [
      {
        number: "243ZH",
        title: "Definitions",
        description: "Definitions for this Part",
        content: "In this Part, unless the context otherwise requires: 'authorised person' means a person referred to as such in article 243ZQ; 'board' means the board of directors or the governing body of a co-operative society; 'co-operative society' means a society registered or deemed to be registered under any law relating to co-operative societies."
      },
      {
        number: "243ZI",
        title: "Incorporation of co-operative societies",
        description: "State Legislature may make laws for incorporation of cooperative societies",
        content: "The Legislature of a State may, by law, make provisions with respect to the incorporation, regulation and winding up of co-operative societies based on the principles of voluntary formation, democratic member-control, member-economic participation and autonomous functioning."
      },
      {
        number: "243ZK",
        title: "Election of members of board",
        description: "Board members elected by members of cooperative society",
        content: "The board and office bearers of a co-operative society shall be elected by members within six months of its registration or commencement of this Part of the Constitution."
      },
      {
        number: "243ZL",
        title: "Supersession and suspension of board and interim management",
        description: "Board can be superseded for specific reasons with time limits",
        content: "The board of any co-operative society shall not be superseded or kept under suspension for a period exceeding six months. The board shall be reconstituted by conducting elections before the expiry of the period of supersession or suspension."
      }
    ]
  },
  {
    id: 13,
    number: "X",
    name: "The Scheduled and Tribal Areas",
    articles: "244-244A",
    description: "Administration of Scheduled and Tribal Areas",
    articlesList: [
      {
        number: "244",
        title: "Administration of Scheduled Areas and Tribal Areas",
        description: "Special provisions for administration of Scheduled and Tribal Areas",
        content: "The provisions of the Fifth Schedule shall apply to the administration and control of the Scheduled Areas and Scheduled Tribes in any State other than the States of Assam, Meghalaya, Tripura and Mizoram. The provisions of the Sixth Schedule shall apply to the administration of the tribal areas in the States of Assam, Meghalaya, Tripura and Mizoram."
      },
      {
        number: "244A",
        title: "Formation of an autonomous State comprising certain tribal areas in Assam and creation of local Legislature or Council of Ministers or both therefor",
        description: "Autonomous State within Assam for tribal areas",
        content: "Parliament may, by law, form within the State of Assam an autonomous State comprising certain tribal areas and create therefor a body to function as a Legislature or a Council of Ministers or both."
      }
    ]
  },
  {
    id: 14,
    number: "XI",
    name: "Relations Between the Union and the States",
    articles: "245-263",
    description: "Distribution of legislative and executive powers",
    articlesList: [
      {
        number: "245",
        title: "Extent of laws made by Parliament and by the Legislatures of States",
        description: "Parliament makes laws for whole or any part of India",
        content: "Parliament may make laws for the whole or any part of the territory of India. The Legislature of a State may make laws for the whole or any part of the State."
      },
      {
        number: "246",
        title: "Subject-matter of laws made by Parliament and by the Legislatures of States",
        description: "Distribution of legislative powers - Union, State, and Concurrent Lists",
        content: "Parliament has exclusive power to make laws with respect to any of the matters enumerated in List I (Union List) in the Seventh Schedule. The Legislature of any State has exclusive power to make laws for such State with respect to any of the matters enumerated in List II (State List) in the Seventh Schedule. Both Parliament and State Legislature have power to make laws with respect to any of the matters enumerated in List III (Concurrent List) in the Seventh Schedule."
      },
      {
        number: "248",
        title: "Residuary powers of legislation",
        description: "Parliament has exclusive power to make laws on matters not in State or Concurrent List",
        content: "Parliament has exclusive power to make any law with respect to any matter not enumerated in the Concurrent List or State List."
      },
      {
        number: "249",
        title: "Power of Parliament to legislate with respect to a matter in the State List in the national interest",
        description: "Rajya Sabha can authorize Parliament to make laws on State subjects",
        content: "If the Council of States has declared by resolution supported by not less than two-thirds of the members present and voting that it is necessary or expedient in the national interest that Parliament should make laws with respect to any matter enumerated in the State List, it shall be lawful for Parliament to make laws for the whole or any part of the territory of India with respect to that matter."
      },
      {
        number: "250",
        title: "Power of Parliament to legislate with respect to any matter in the State List if a Proclamation of Emergency is in operation",
        description: "Parliament can legislate on State subjects during Emergency",
        content: "While a Proclamation of Emergency is in operation, Parliament shall have power to make laws for the whole or any part of the territory of India with respect to any of the matters enumerated in the State List."
      },
      {
        number: "252",
        title: "Power of Parliament to legislate for two or more States by consent and adoption of such legislation by any other State",
        description: "Parliament can make laws for consenting States",
        content: "If it appears to the Legislatures of two or more States to be desirable that any of the matters with respect to which Parliament has no power to make laws for the States except as provided in articles 249 and 250 should be regulated in such States by Parliament by law, those Legislatures may pass resolutions to that effect and Parliament may pass an Act for regulating that matter accordingly."
      },
      {
        number: "253",
        title: "Legislation for giving effect to international agreements",
        description: "Parliament can make laws to implement international treaties",
        content: "Parliament has power to make any law for the whole or any part of the territory of India for implementing any treaty, agreement or convention with any other country or countries or any decision made at any international conference, association or other body."
      },
      {
        number: "254",
        title: "Inconsistency between laws made by Parliament and laws made by the Legislatures of States",
        description: "Union law prevails over State law in case of conflict",
        content: "If any provision of a law made by the Legislature of a State is repugnant to any provision of a law made by Parliament, then the law made by Parliament shall prevail and the law made by the Legislature of the State shall, to the extent of the repugnancy, be void."
      },
      {
        number: "256",
        title: "Obligation of States and the Union",
        description: "Executive power of State to be exercised so as not to impede Union",
        content: "The executive power of every State shall be so exercised as to ensure compliance with the laws made by Parliament and any existing laws which apply in that State, and the executive power of the Union shall extend to the giving of such directions to a State as may appear to the Government of India to be necessary for that purpose."
      },
      {
        number: "257",
        title: "Control of the Union over States in certain cases",
        description: "Union can give directions to States for certain purposes",
        content: "The executive power of every State shall be so exercised as not to impede or prejudice the exercise of the executive power of the Union. The executive power of the Union shall extend to the giving of directions to a State as to the construction and maintenance of means of communication."
      },
      {
        number: "262",
        title: "Adjudication of disputes relating to waters of inter-State rivers or river valleys",
        description: "Parliament can resolve inter-State water disputes",
        content: "Parliament may by law provide for the adjudication of any dispute or complaint with respect to the use, distribution or control of the waters of any inter-State river or river valley."
      },
      {
        number: "263",
        title: "Provisions with respect to an inter-State Council",
        description: "President can establish Inter-State Council",
        content: "If at any time it appears to the President that the public interests would be served by the establishment of a Council charged with the duty of inquiring into and advising upon disputes which may have arisen between States, or investigating and discussing subjects in which some or all of the States have a common interest, it shall be lawful for the President by order to establish such a Council, and to define the nature of the duties to be performed by it."
      }
    ]
  },
  {
    id: 15,
    number: "XII",
    name: "Finance, Property, Contracts and Suits",
    articles: "264-300A",
    description: "Financial relations between Union and States",
    articlesList: [
      {
        number: "264",
        title: "Interpretation",
        description: "Definitions for this Part",
        content: "In this Part, 'Finance Commission' means a Finance Commission constituted under article 280."
      },
      {
        number: "265",
        title: "Taxes not to be imposed save by authority of law",
        description: "No tax shall be levied or collected except by authority of law",
        content: "No tax shall be levied or collected except by authority of law."
      },
      {
        number: "266",
        title: "Consolidated Funds and public accounts of India and of the States",
        description: "All revenues received form part of Consolidated Fund",
        content: "All revenues received by the Government of India shall form part of the Consolidated Fund of India. All revenues received by the Government of a State shall form part of the Consolidated Fund of the State."
      },
      {
        number: "267",
        title: "Contingency Fund",
        description: "Parliament/State Legislature may establish Contingency Fund",
        content: "Parliament may by law establish a Contingency Fund in the nature of an imprest to be entitled the Contingency Fund of India into which shall be paid such sums as may be determined by such law, and the said Fund shall be placed at the disposal of the President to enable advances to be made by him out of it for meeting unforeseen expenditure pending authorisation by Parliament."
      },
      {
        number: "268",
        title: "Duties levied by the Union but collected and appropriated by the States",
        description: "Certain stamp duties levied by Union but collected by States",
        content: "Such stamp duties and such duties of excise on medicinal and toilet preparations as are mentioned in the Union List shall be levied by the Government of India but shall be collected in the case where such duties are leviable within any State, and shall be assigned to that State."
      },
      {
        number: "269",
        title: "Taxes levied and collected by the Union but assigned to the States",
        description: "Certain taxes collected by Union but assigned to States",
        content: "Taxes on the sale or purchase of goods and taxes on the consignment of goods shall be levied and collected by the Government of India but shall be assigned to the States."
      },
      {
        number: "270",
        title: "Taxes levied and distributed between the Union and the States",
        description: "Union taxes distributed between Union and States",
        content: "All taxes and duties referred to in the Union List, except duties and taxes referred to in articles 268, 269 and 269A, shall be levied and collected by the Government of India and shall be distributed between the Union and the States in the manner provided in this article."
      },
      {
        number: "275",
        title: "Grants from the Union to certain States",
        description: "Parliament can provide grants-in-aid to States",
        content: "Such sums as Parliament may by law provide shall be charged on the Consolidated Fund of India in each year as grants-in-aid of the revenues of such States as Parliament may determine to be in need of assistance."
      },
      {
        number: "280",
        title: "Finance Commission",
        description: "President constitutes Finance Commission every 5 years",
        content: "The President shall, within two years from the commencement of this Constitution and thereafter at the expiration of every fifth year or at such earlier time as the President considers necessary, by order constitute a Finance Commission which shall consist of a Chairman and four other members."
      },
      {
        number: "282",
        title: "Expenditure defrayable by the Union or a State out of its revenues",
        description: "Union or State can make grants for any public purpose",
        content: "The Union or a State may make any grants for any public purpose, notwithstanding that the purpose is not one with respect to which Parliament or the Legislature of the State may make laws."
      },
      {
        number: "300",
        title: "Suits and proceedings",
        description: "Government of India/State may sue and be sued",
        content: "The Government of India may sue or be sued by the name of the Union of India and the Government of a State may sue or be sued by the name of the State."
      },
      {
        number: "300A",
        title: "Persons not to be deprived of property save by authority of law",
        description: "Right to property - cannot be deprived except by law",
        content: "No person shall be deprived of his property save by authority of law."
      }
    ]
  },
  {
    id: 16,
    number: "XIII",
    name: "Trade, Commerce and Intercourse within India",
    articles: "301-307",
    description: "Freedom of trade and commerce throughout India",
    articlesList: [
      {
        number: "301",
        title: "Freedom of trade, commerce and intercourse",
        description: "Trade, commerce and intercourse throughout India shall be free",
        content: "Subject to the other provisions of this Part, trade, commerce and intercourse throughout the territory of India shall be free."
      },
      {
        number: "302",
        title: "Power of Parliament to impose restrictions on trade, commerce and intercourse",
        description: "Parliament can impose restrictions in public interest",
        content: "Parliament may by law impose such restrictions on the freedom of trade, commerce or intercourse between one State and another or within any part of the territory of India as may be required in the public interest."
      },
      {
        number: "303",
        title: "Restrictions on the legislative powers of the Union and of the States with regard to trade and commerce",
        description: "Parliament cannot give preference to one State over another",
        content: "Parliament shall not in exercise of its powers have the power to make any law giving, or authorising the giving of, any preference to one State over another, or making, or authorising the making of, any discrimination between one State and another."
      },
      {
        number: "304",
        title: "Restrictions on trade, commerce and intercourse among States",
        description: "State Legislature can impose reasonable restrictions",
        content: "The Legislature of a State may by law impose on goods imported from other States any tax to which similar goods manufactured or produced in that State are subject, or impose such reasonable restrictions on the freedom of trade, commerce or intercourse with or within that State as may be required in the public interest."
      },
      {
        number: "307",
        title: "Appointment of authority for carrying out the purposes of articles 301 to 304",
        description: "Parliament can appoint authority to ensure freedom of trade",
        content: "Parliament may by law appoint such authority as it considers appropriate for carrying out the purposes of articles 301, 302, 303 and 304, and may by law confer on such authority such powers and such duties as it thinks necessary."
      }
    ]
  },
  {
    id: 17,
    number: "XIV",
    name: "Services Under the Union and the States",
    articles: "308-323",
    description: "Public services - recruitment, conditions of service",
    articlesList: [
      {
        number: "308",
        title: "Interpretation",
        description: "Definitions for this Part",
        content: "In this Part, unless the context otherwise requires, 'State' does not include the State of Jammu and Kashmir."
      },
      {
        number: "309",
        title: "Recruitment and conditions of service of persons serving the Union or a State",
        description: "Parliament/State Legislature can regulate recruitment and service conditions",
        content: "Acts of the appropriate Legislature may regulate the recruitment, and conditions of service of persons appointed, to public services and posts in connection with the affairs of the Union or of any State."
      },
      {
        number: "310",
        title: "Tenure of office of persons serving the Union or a State",
        description: "Civil servants hold office during pleasure of President/Governor",
        content: "Every person who is a member of a defence service or of a civil service of the Union or of an all-India service or holds any civil post under the Union, holds office during the pleasure of the President. Every person who is a member of a civil service of a State or holds any civil post under a State holds office during the pleasure of the Governor of the State."
      },
      {
        number: "311",
        title: "Dismissal, removal or reduction in rank of persons employed in civil capacities under the Union or a State",
        description: "Civil servant cannot be dismissed without inquiry",
        content: "No person who is a member of a civil service of the Union or an all-India service or a civil service of a State or holds a civil post under the Union or a State shall be dismissed or removed by an authority subordinate to that by which he was appointed. No such person shall be dismissed or removed or reduced in rank except after an inquiry in which he has been informed of the charges against him and given a reasonable opportunity of being heard."
      },
      {
        number: "312",
        title: "All-India services",
        description: "Rajya Sabha can create All-India Services",
        content: "If the Council of States has declared by resolution supported by not less than two-thirds of the members present and voting that it is necessary or expedient in the national interest so to do, Parliament may by law provide for the creation of one or more all-India services common to the Union and the States."
      },
      {
        number: "315",
        title: "Public Service Commissions for the Union and for the States",
        description: "UPSC for Union, State PSC for States",
        content: "There shall be a Public Service Commission for the Union and a Public Service Commission for each State."
      },
      {
        number: "320",
        title: "Functions of Public Service Commissions",
        description: "PSC conducts examinations and advises on service matters",
        content: "It shall be the duty of the Union and the State Public Service Commissions to conduct examinations for appointments to the services of the Union and the services of the State respectively. It shall also be the duty of the Public Service Commissions to advise on all matters relating to methods of recruitment to civil services and civil posts."
      }
    ]
  },
  {
    id: 18,
    number: "XIVA",
    name: "Tribunals",
    articles: "323A-323B",
    description: "Administrative and other tribunals",
    articlesList: [
      {
        number: "323A",
        title: "Administrative tribunals",
        description: "Parliament can establish Administrative Tribunals",
        content: "Parliament may, by law, provide for the adjudication or trial by administrative tribunals of disputes and complaints with respect to recruitment and conditions of service of persons appointed to public services and posts in connection with the affairs of the Union or of any State."
      },
      {
        number: "323B",
        title: "Tribunals for other matters",
        description: "Parliament/State Legislature can establish tribunals",
        content: "The appropriate Legislature may, by law, provide for the establishment of tribunals for the adjudication or trial of any disputes, complaints, or offences with respect to all or any of the matters specified in the law including taxation, foreign exchange, industrial and labour disputes, land reforms, ceiling on urban property, elections, food, production and distribution of foodstuffs."
      }
    ]
  },
  {
    id: 19,
    number: "XV",
    name: "Elections",
    articles: "324-329A",
    description: "Election Commission and conduct of elections",
    articlesList: [
      {
        number: "324",
        title: "Superintendence, direction and control of elections to be vested in an Election Commission",
        description: "Election Commission conducts all elections",
        content: "The superintendence, direction and control of the preparation of the electoral rolls for, and the conduct of, all elections to Parliament and to the Legislature of every State and of elections to the offices of President and Vice-President shall be vested in a Commission referred to as the Election Commission."
      },
      {
        number: "325",
        title: "No person to be ineligible for inclusion in electoral rolls on grounds of religion, race, caste or sex",
        description: "Universal adult franchise - no discrimination",
        content: "There shall be one general electoral roll for every territorial constituency for election to either House of Parliament or to the House or either House of the Legislature of a State and no person shall be ineligible for inclusion in any such roll or claim to be included in any special electoral roll for any such constituency on grounds only of religion, race, caste, sex or any of them."
      },
      {
        number: "326",
        title: "Elections to the House of the People and to the Legislative Assemblies of States to be on the basis of adult suffrage",
        description: "Every citizen 18+ years has right to vote",
        content: "The elections to the House of the People and to the Legislative Assembly of every State shall be on the basis of adult suffrage; that is to say, every person who is a citizen of India and who is not less than eighteen years of age on such date as may be fixed and is not otherwise disqualified shall be entitled to be registered as a voter at any such election."
      },
      {
        number: "327",
        title: "Power of Parliament to make provision with respect to elections to Legislatures",
        description: "Parliament can make laws regarding elections",
        content: "Parliament may from time to time by law make provision with respect to all matters relating to, or in connection with, elections to either House of Parliament or to the House or either House of the Legislature of a State."
      },
      {
        number: "329",
        title: "Bar to interference by courts in electoral matters",
        description: "Courts cannot interfere in electoral matters",
        content: "Notwithstanding anything in this Constitution, no election to either House of Parliament or to the House or either House of the Legislature of a State shall be called in question except by an election petition presented to such authority and in such manner as may be provided for by or under any law made by the appropriate Legislature."
      }
    ]
  },
  {
    id: 20,
    number: "XVI",
    name: "Special Provisions Relating to Certain Classes",
    articles: "330-342",
    description: "Reservations for SCs, STs, and Anglo-Indians",
    articlesList: [
      {
        number: "330",
        title: "Reservation of seats for Scheduled Castes and Scheduled Tribes in the House of the People",
        description: "Seats reserved for SCs and STs in Lok Sabha",
        content: "Seats shall be reserved in the House of the People for the Scheduled Castes and the Scheduled Tribes in proportion to their population."
      },
      {
        number: "332",
        title: "Reservation of seats for Scheduled Castes and Scheduled Tribes in the Legislative Assemblies of the States",
        description: "Seats reserved for SCs and STs in State Assemblies",
        content: "Seats shall be reserved for the Scheduled Castes and the Scheduled Tribes in the Legislative Assembly of every State in proportion to their population."
      },
      {
        number: "335",
        title: "Claims of Scheduled Castes and Scheduled Tribes to services and posts",
        description: "Reservation in government services for SCs and STs",
        content: "The claims of the members of the Scheduled Castes and the Scheduled Tribes shall be taken into consideration, consistently with the maintenance of efficiency of administration, in the making of appointments to services and posts in connection with the affairs of the Union or of a State."
      },
      {
        number: "338",
        title: "National Commission for Scheduled Castes",
        description: "Commission to safeguard interests of SCs",
        content: "There shall be a Commission for the Scheduled Castes to be known as the National Commission for the Scheduled Castes. It shall be the duty of the Commission to investigate and monitor all matters relating to the safeguards provided for the Scheduled Castes and to inquire into specific complaints with respect to the deprivation of rights and safeguards of the Scheduled Castes."
      },
      {
        number: "338A",
        title: "National Commission for Scheduled Tribes",
        description: "Commission to safeguard interests of STs",
        content: "There shall be a Commission for the Scheduled Tribes to be known as the National Commission for the Scheduled Tribes. It shall be the duty of the Commission to investigate and monitor all matters relating to the safeguards provided for the Scheduled Tribes and to inquire into specific complaints with respect to the deprivation of rights and safeguards of the Scheduled Tribes."
      },
      {
        number: "340",
        title: "Appointment of a Commission to investigate the conditions of backward classes",
        description: "President can appoint Commission for backward classes",
        content: "The President may by order appoint a Commission consisting of such persons as he thinks fit to investigate the conditions of socially and educationally backward classes within the territory of India."
      },
      {
        number: "341",
        title: "Scheduled Castes",
        description: "President specifies Scheduled Castes",
        content: "The President may with respect to any State or Union territory, by public notification, specify the castes, races or tribes which shall be deemed to be Scheduled Castes in relation to that State or Union territory."
      },
      {
        number: "342",
        title: "Scheduled Tribes",
        description: "President specifies Scheduled Tribes",
        content: "The President may with respect to any State or Union territory, by public notification, specify the tribes or tribal communities which shall be deemed to be Scheduled Tribes in relation to that State or Union territory."
      }
    ]
  },
  {
    id: 21,
    number: "XVII",
    name: "Official Language",
    articles: "343-351",
    description: "Official languages of the Union and States",
    articlesList: [
      {
        number: "343",
        title: "Official language of the Union",
        description: "Hindi in Devanagari script is official language of Union",
        content: "The official language of the Union shall be Hindi in Devanagari script. For a period of fifteen years from the commencement of this Constitution, the English language shall continue to be used for all the official purposes of the Union for which it was being used immediately before such commencement."
      },
      {
        number: "344",
        title: "Commission and Committee of Parliament on official language",
        description: "President constitutes Commission on official language",
        content: "The President shall, at the expiration of five years from the commencement of this Constitution and thereafter at the expiration of ten years from such commencement, by order constitute a Commission to make recommendations to the President as to the progressive use of the Hindi language for the official purposes of the Union."
      },
      {
        number: "345",
        title: "Official language or languages of a State",
        description: "State Legislature can adopt official language(s)",
        content: "The Legislature of a State may by law adopt any one or more of the languages in use in the State or Hindi as the language or languages to be used for all or any of the official purposes of that State."
      },
      {
        number: "346",
        title: "Official language for communication between one State and another or between a State and the Union",
        description: "Hindi or English for inter-state communication",
        content: "The language for the time being authorised for use in the Union for official purposes shall be the official language for communication between one State and another State and between a State and the Union."
      },
      {
        number: "347",
        title: "Special provision relating to language spoken by a section of the population of a State",
        description: "President can direct use of language spoken by section of population",
        content: "If a substantial proportion of the population of a State desire the use of any language spoken by them to be recognised by that State, the President may direct that such language shall also be officially recognised throughout that State or any part thereof for such purpose as he may specify."
      },
      {
        number: "350",
        title: "Language to be used in representations for redress of grievances",
        description: "Right to submit representation in any language",
        content: "Every person shall be entitled to submit a representation for the redress of any grievance to any officer or authority of the Union or a State in any of the languages used in the Union or in the State, as the case may be."
      },
      {
        number: "350A",
        title: "Facilities for instruction in mother-tongue at primary stage",
        description: "Provide primary education in mother tongue",
        content: "It shall be the endeavour of every State to provide adequate facilities for instruction in the mother-tongue at the primary stage of education to children belonging to linguistic minority groups."
      },
      {
        number: "350B",
        title: "Special Officer for linguistic minorities",
        description: "President appoints Special Officer for linguistic minorities",
        content: "There shall be a Special Officer for linguistic minorities to be appointed by the President. It shall be the duty of the Special Officer to investigate all matters relating to the safeguards provided for linguistic minorities under this Constitution."
      },
      {
        number: "351",
        title: "Directive for development of the Hindi language",
        description: "Develop Hindi by drawing from Sanskrit and other Indian languages",
        content: "It shall be the duty of the Union to promote the spread of the Hindi language, to develop it so that it may serve as a medium of expression for all the elements of the composite culture of India and to secure its enrichment by assimilating the forms, style and expressions used in Hindustani and in the other languages of India."
      }
    ]
  },
  {
    id: 22,
    number: "XVIII",
    name: "Emergency Provisions",
    articles: "352-360",
    description: "National Emergency, President's Rule, Financial Emergency",
    articlesList: [
      {
        number: "352",
        title: "Proclamation of Emergency",
        description: "President can proclaim Emergency due to war, external aggression, or armed rebellion",
        content: "If the President is satisfied that a grave emergency exists whereby the security of India or of any part of the territory thereof is threatened, whether by war or external aggression or armed rebellion, he may, by Proclamation, make a declaration to that effect. A Proclamation of Emergency must be approved by both Houses of Parliament within one month."
      },
      {
        number: "353",
        title: "Effect of Proclamation of Emergency",
        description: "During Emergency, Union's executive power extends to directing States",
        content: "While a Proclamation of Emergency is in operation, the executive power of the Union shall extend to giving directions to any State as to the manner in which the executive power thereof is to be exercised. Parliament shall have power to make laws for the whole or any part of the territory of India with respect to any matter in the State List."
      },
      {
        number: "356",
        title: "Provisions in case of failure of constitutional machinery in States",
        description: "President's Rule - President can assume State functions",
        content: "If the President, on receipt of a report from the Governor of a State or otherwise, is satisfied that a situation has arisen in which the government of the State cannot be carried on in accordance with the provisions of this Constitution, the President may by Proclamation assume to himself all or any of the functions of the Government of the State and declare that the powers of the Legislature of the State shall be exercisable by or under the authority of Parliament."
      },
      {
        number: "357",
        title: "Exercise of legislative powers under Proclamation issued under article 356",
        description: "Parliament can legislate for State during President's Rule",
        content: "Where a Proclamation of Emergency is in operation in any State, Parliament shall have power to make laws with respect to any matter in the State List and to confer powers and impose duties on the Union or officers and authorities of the Union."
      },
      {
        number: "358",
        title: "Suspension of provisions of article 19 during emergencies",
        description: "Article 19 (six freedoms) suspended during Emergency",
        content: "While a Proclamation of Emergency declaring that the security of India or any part thereof is threatened by war or by external aggression is in operation, nothing in article 19 shall restrict the power of the State to make any law or to take any executive action."
      },
      {
        number: "359",
        title: "Suspension of the enforcement of the rights conferred by Part III during emergencies",
        description: "President can suspend right to move court for enforcement of Fundamental Rights",
        content: "Where a Proclamation of Emergency is in operation, the President may by order declare that the right to move any court for the enforcement of such of the rights conferred by Part III as may be mentioned in the order and all proceedings pending in any court for the enforcement of the rights so mentioned shall remain suspended for the period during which the Proclamation is in force."
      },
      {
        number: "360",
        title: "Provisions as to financial emergency",
        description: "President can proclaim Financial Emergency",
        content: "If the President is satisfied that a situation has arisen whereby the financial stability or credit of India or of any part of the territory thereof is threatened, he may by a Proclamation make a declaration to that effect (Financial Emergency). During Financial Emergency, the executive authority of the Union shall extend to the giving of directions to any State to observe such canons of financial propriety as may be specified in the directions."
      }
    ]
  },
  {
    id: 23,
    number: "XIX",
    name: "Miscellaneous",
    articles: "361-367",
    description: "Various miscellaneous provisions",
    articlesList: [
      {
        number: "361",
        title: "Protection of President and Governors",
        description: "President and Governors immune from court proceedings",
        content: "The President, or the Governor of a State, shall not be answerable to any court for the exercise and performance of the powers and duties of his office. No criminal proceedings whatsoever shall be instituted or continued against the President, or the Governor of a State, in any court during his term of office."
      },
      {
        number: "361A",
        title: "Protection of publication of proceedings of Parliament and State Legislatures",
        description: "No liability for publishing parliamentary proceedings",
        content: "No person shall be liable to any civil or criminal proceedings in any court in respect of the publication in a newspaper of a substantially true report of any proceedings of either House of Parliament or the Legislative Assembly, or either House of the Legislature, of a State, unless the publication is proved to have been made with malice."
      },
      {
        number: "363",
        title: "Bar to interference by courts in disputes arising out of certain treaties, agreements, etc.",
        description: "Courts cannot interfere in disputes arising from treaties before Constitution",
        content: "Neither the Supreme Court nor any other court shall have jurisdiction in any dispute arising out of any provision of a treaty, agreement, covenant, engagement, sanad or other similar instrument which was entered into or executed before the commencement of this Constitution."
      },
      {
        number: "365",
        title: "Effect of failure to comply with, or to give effect to, directions given by the Union",
        description: "President can declare constitutional breakdown if State fails to comply with Union directions",
        content: "Where any State has failed to comply with or to give effect to any directions given in the exercise of the executive power of the Union, it shall be lawful for the President to hold that a situation has arisen in which the Government of the State cannot be carried on in accordance with the provisions of this Constitution."
      },
      {
        number: "366",
        title: "Definitions",
        description: "Definitions of various terms used in Constitution",
        content: "In this Constitution, unless the context otherwise requires, various terms are defined including: 'agricultural income', 'appropriate Legislature', 'Constitution', 'corporation tax', 'debt', 'estate duty', 'existing law', 'Federal Court', 'goods', 'guarantee', 'High Court', 'Indian State', 'net proceeds', 'pension', 'Proclamation of Emergency', 'public notification', 'railway', 'Scheduled Castes', 'Scheduled Tribes', 'securities', 'tax on income', 'tax on the sale or purchase of goods', 'taxation laws', 'Union territory'."
      },
      {
        number: "367",
        title: "Interpretation",
        description: "General interpretation provisions",
        content: "Unless the context otherwise requires, the General Clauses Act, 1897, shall apply for the interpretation of this Constitution as it applies for the interpretation of an Act of the Legislature of the Dominion of India."
      }
    ]
  },
  {
    id: 24,
    number: "XX",
    name: "Amendment of the Constitution",
    articles: "368",
    description: "Procedure for amending the Constitution",
    articlesList: [
      {
        number: "368",
        title: "Power of Parliament to amend the Constitution and procedure therefor",
        description: "Parliament can amend Constitution by special majority",
        content: "Parliament may amend by way of addition, variation or repeal any provision of this Constitution in accordance with the procedure laid down in this article. An amendment Bill must be passed in each House by a majority of the total membership of that House and by a majority of not less than two-thirds of the members of that House present and voting. If the amendment seeks to make any change in certain specified provisions (federal structure, Fundamental Rights, etc.), the amendment must also be ratified by the Legislatures of not less than one-half of the States before the Bill is presented to the President for assent."
      }
    ]
  },
  {
    id: 25,
    number: "XXI",
    name: "Temporary, Transitional and Special Provisions",
    articles: "369-392",
    description: "Special provisions for certain states and temporary provisions",
    articlesList: [
      {
        number: "370",
        title: "Temporary provisions with respect to the State of Jammu and Kashmir (Repealed)",
        description: "Special status for J&K - Abrogated on 5 August 2019",
        content: "Article 370, which granted special autonomous status to Jammu and Kashmir, was abrogated by the Constitution (Application to Jammu and Kashmir) Order, 2019 on 5 August 2019. The state was reorganized into two Union Territories: Jammu and Kashmir, and Ladakh."
      },
      {
        number: "371",
        title: "Special provision with respect to the States of Maharashtra and Gujarat",
        description: "Special provisions for development of Vidarbha, Marathwada, Saurashtra, Kutch",
        content: "The President may provide for equitable allocation of funds for developmental expenditure over the State, having regard to the requirements of the different areas, particularly Vidarbha and Marathwada in Maharashtra, and Saurashtra and Kutch in Gujarat."
      },
      {
        number: "371A",
        title: "Special provision with respect to the State of Nagaland",
        description: "Special provisions for Nagaland regarding customary law",
        content: "No Act of Parliament in respect of religious or social practices of the Nagas, Naga customary law and procedure, administration of civil and criminal justice involving decisions according to Naga customary law, and ownership and transfer of land and its resources, shall apply to the State of Nagaland unless the Legislative Assembly of Nagaland by a resolution so decides."
      },
      {
        number: "371B",
        title: "Special provision with respect to the State of Assam",
        description: "Committee for tribal areas in Assam",
        content: "The Legislative Assembly of the State of Assam shall consist of not less than one hundred and eight and not more than one hundred and twenty-six members. There shall be a Committee of the Legislative Assembly consisting of members elected from the tribal areas to deal with matters affecting tribal areas."
      },
      {
        number: "371C",
        title: "Special provision with respect to the State of Manipur",
        description: "Committee for Hill Areas in Manipur",
        content: "There shall be a Committee of the Legislative Assembly of the State of Manipur consisting of members of that Assembly elected from the Hill Areas of that State, to deal with matters relating to the administration of the Hill Areas."
      },
      {
        number: "371D",
        title: "Special provisions with respect to the State of Andhra Pradesh or the State of Telangana",
        description: "Equitable opportunities for people of different regions in public employment and education",
        content: "The President may provide for equitable opportunities and facilities for the people belonging to different parts of the State of Andhra Pradesh or Telangana in the matter of public employment and in the matter of education."
      },
      {
        number: "371E",
        title: "Establishment of Central University in Andhra Pradesh",
        description: "Central University established in Andhra Pradesh",
        content: "Parliament may by law provide for the establishment of a University in the State of Andhra Pradesh."
      },
      {
        number: "371F",
        title: "Special provisions with respect to the State of Sikkim",
        description: "Special provisions for Sikkim",
        content: "Special provisions shall apply to the State of Sikkim including representation in Lok Sabha, Legislative Assembly, and protection of customary laws and land rights."
      },
      {
        number: "371G",
        title: "Special provision with respect to the State of Mizoram",
        description: "Special provisions for Mizoram regarding customary law",
        content: "No Act of Parliament in respect of religious or social practices of the Mizos, Mizo customary law and procedure, administration of civil and criminal justice involving decisions according to Mizo customary law, and ownership and transfer of land shall apply to the State of Mizoram unless the Legislative Assembly of Mizoram by a resolution so decides."
      },
      {
        number: "371H",
        title: "Special provision with respect to the State of Arunachal Pradesh",
        description: "Special provisions for Arunachal Pradesh regarding customary law",
        content: "The Legislative Assembly of the State of Arunachal Pradesh shall consist of not less than forty members. The Governor shall have special responsibility with respect to law and order in the State so long as the Legislative Assembly has less than thirty members."
      },
      {
        number: "371I",
        title: "Special provision with respect to the State of Goa",
        description: "Legislative Assembly of Goa shall have not less than thirty members",
        content: "The Legislative Assembly of the State of Goa shall consist of not less than thirty members."
      },
      {
        number: "371J",
        title: "Special provisions with respect to the State of Karnataka",
        description: "Equitable opportunities for people of different regions in Karnataka",
        content: "The President may provide for equitable allocation of funds for developmental expenditure over the State of Karnataka, having regard to the requirements of the different areas of the State, particularly Hyderabad-Karnataka region."
      },
      {
        number: "372",
        title: "Continuance in force of existing laws and their adaptation",
        description: "Pre-Constitution laws continue until amended or repealed",
        content: "All the law in force in the territory of India immediately before the commencement of this Constitution shall continue in force therein until altered or repealed or amended by a competent Legislature or other competent authority."
      },
      {
        number: "373",
        title: "Power of President to make order in respect of persons under preventive detention in certain cases",
        description: "President can make orders regarding preventive detention",
        content: "Until provision is made by Parliament under clause (7) of article 22 or until the expiration of one year from the commencement of this Constitution, whichever is earlier, article 22 shall have effect as if any reference to Parliament in clauses (4) and (7) were substituted a reference to the President."
      },
      {
        number: "374",
        title: "Provisions as to Judges of the Federal Court and proceedings pending in the Federal Court or before His Majesty in Council",
        description: "Federal Court judges become Supreme Court judges",
        content: "The Judges of the Federal Court holding office immediately before the commencement of this Constitution shall become Judges of the Supreme Court. All proceedings pending in the Federal Court at such commencement shall stand transferred to the Supreme Court."
      },
      {
        number: "376",
        title: "Provisions as to Judges of High Courts",
        description: "Pre-Constitution High Court judges continue",
        content: "Judges of a High Court in any Province holding office immediately before the commencement of this Constitution shall become the Judges of the High Court in the corresponding State."
      },
      {
        number: "377",
        title: "Provisions as to Comptroller and Auditor-General of India",
        description: "Pre-Constitution Auditor General continues",
        content: "The Auditor-General of India holding office immediately before the commencement of this Constitution shall become the Comptroller and Auditor-General of India."
      },
      {
        number: "378",
        title: "Provisions as to Public Service Commissions",
        description: "Pre-Constitution PSCs continue",
        content: "A Public Service Commission functioning in any State immediately before the commencement of this Constitution shall continue to function as the Public Service Commission for that State."
      }
    ]
  }
];
